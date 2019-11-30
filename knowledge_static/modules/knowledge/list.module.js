(function(name, moduleFun) {
    if (!window.modules) {
        window.modules = Object.create(null);
    };
    let module = moduleFun();
    if (arguments.length > 2) {
        let components = Object.create(null);
        for (let i = 2; i < arguments.length; i++) {
            let name = arguments[i];
            i++;
            let func = arguments[i];
            if (!func) {
                continue;
            }
            let component = func();
            components[name] = component;
        }
        module.components = components;
    }

    window.modules[name] = module;
})('knowledge/list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"app\">\r\n    <div id=\"toolbar\">\r\n        <button @click=\"add\">增加</button>\r\n        <button>返回</button>\r\n    </div>\r\n    <div>\r\n        知识点列表：\r\n    </div>\r\n    <div>\r\n        <jxiaui-datagrid ref=\"datagrid\" :dataset=\"dataset\">\r\n            <jxiaui-datagrid-item label=\"标题\" field=\"title\">\r\n                <template v-slot=\"row\">\r\n                    <a :href=\"getUrl(row)\">{{row.title}}</a>\r\n                </template>\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"类型\" field=\"category\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"内容\">\r\n                <template v-slot=\"row\">\r\n                    {{getContentShort(row)}}\r\n                </template>\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"操作\">\r\n                <template v-slot=\"row\">\r\n                    <button @click=\"toEdit(row)\">编辑</button>\r\n                    <button @click=\"del(row)\">删除</button>\r\n\t\t\t\t</template>\r\n            </jxiaui-datagrid-item>\r\n        </jxiaui-datagrid>\r\n    </div>\r\n</div>";
        

        exports.init = function() {
            let categoryId = router.getParam("categoryId");
new Vue({
    el: '#app',
    data: {
        form: {
            id: null,
            name: null,
            url: null
        },
        dataset: {
            url: "knowledge!list.do",
            params: {
                categoryId: categoryId
            }
        }
    },
    mounted() {},
    methods: {
        getUrl(row) {
            return "#knowledge/view?id=" + row.id;
        },
        add() {
            router.goRoute("knowledge/add");
        },
        query() {
            this.$refs.datagrid.query();
        },
        getContentShort(row) {
            let content = row.content;
            let tempEl = document.createElement("div");
            tempEl.innerHTML = content;
            content = tempEl.textContent;
            if (content.length <= 10) {
                return content;
            } else {
                return content.substring(0, 10) + "...";
            }
        },
        toEdit(row) {
            router.goRoute('knowledge/edit', {
                id: row.id
            })
        },
        del(row) {
            if (!confirm("是否确认删除？")) {
                return;
            }
            let me = this;
            $.ajax({
                url: 'knowledge!del.do',
                data: {
                    id: row.id
                }
            }).done(function(data) {
                if (data.success) {
                    alert("删除成功");
                    me.query();
                } else {
                    alert("删除失败");
                }
            })
        }
    }
});
        };
        return module.exports;
    }

    
);
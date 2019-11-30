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
})('knowledge/view', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"app\">\r\n    <div class=\"view-row\">\r\n        <div style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;\">\r\n            <span>{{form.title}}</span>\r\n            <button @click=\"back\">返回</button>\r\n        </div>\r\n    </div>\r\n    <div class=\"view-row\">\r\n        <div style=\"border-bottom: 1px solid #ccc;padding-bottom: 10px;\">\r\n            知识库类别： <a :href=\"getUrl()\">{{form.categoryName}}</a>\r\n        </div>\r\n    </div>\r\n    <div class=\"view-row\">\r\n        <jxiaui-left-right-pane :left-width=\"200\">\r\n            <div slot=\"left\">\r\n                <jxiaui-tree :data=\"treeData\">\r\n                    <template v-slot=\"treeNode\">\r\n                        {{treeNode.name}}\r\n                    </template>\r\n                </jxiaui-tree>\r\n            </div>\r\n            <div slot=\"right\">\r\n                <jxiaui-html-view v-model=\"form.content\" :height=\"viewHeight\"></jxiaui-html-view>\r\n            </div>\r\n        </jxiaui-left-right-pane>\r\n\r\n    </div>\r\n</div>";
        

        exports.init = function() {
            let id = router.getParam("id");

new Vue({
    el: '#app',
    data: {
        viewHeight: 500,
        form: {},
        treeData: [{
            name: 'test'
        }]
    },
    mounted() {
        let height = document.body.clientHeight;
        this.viewHeight = height - 150;
        this.loadData();
    },
    methods: {
        loadData() {
            $.ajax({
                url: 'knowledge!detail.do',
                data: {
                    id: id
                }
            }).done(res => {
                this.form = res.data;
            })
        },
        getUrl() {
            return "#knowledge/list?categoryId=" + this.form.categoryId;
        },
        back() {
            router.goRoute("knowledge/list", {
                categoryId: this.form.categoryId
            })
        }
    }
})
        };
        return module.exports;
    }

    
);
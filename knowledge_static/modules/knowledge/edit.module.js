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
})('knowledge/edit', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"app\">\r\n    <div class=\"jxiaui-table-form\">\r\n        <table style=\"width: 100%;\">\r\n            <tr>\r\n                <th>标题</th>\r\n                <td><input v-model=\"form.title\"></td>\r\n            </tr>\r\n            <tr>\r\n                <th>知识类型</th>\r\n                <td>\r\n                    <jxiaui-select v-model=\"form.categoryId\" url=\"category!listAll.do\" label-name=\"name\" value-name=\"id\"></jxiaui-select>\r\n                </td>\r\n            </tr>\r\n            <tr>\r\n                <th>\r\n                    <jxiaui-tree :data=\"treeData\">\r\n                        <template v-slot=\"treeNode\">\r\n                            <span v-if=\"!treeNode.isNew\">{{treeNode.title}}</span> \r\n                            <input v-if=\"treeNode.isNew\" v-model=\"treeNode.title\">\r\n                            <button v-if=\"treeNode.isNew\" @click=\"subNewNode(treeNode)\">确认</button>\r\n                            <button v-if=\"!treeNode.isNew\" @click=\"addNode(treeNode)\">增加</button>\r\n                        </template>\r\n                    </jxiaui-tree>\r\n                </th>\r\n                <td>\r\n                    <jxiaui-rich-editor v-model=\"form.content\" :height=\"viewHeight\"></jxiaui-rich-editor>\r\n                </td>\r\n            </tr>\r\n        </table>\r\n    </div>\r\n    <div>\r\n        <button @click=\"sub\">确认修改</button>\r\n    </div>\r\n</div>";
        

        exports.init = function() {
            let id = router.getParam("id");

new Vue({
    el: '#app',
    data: {
        viewHeight: 500,
        form: {},
        treeData: null
    },
    mounted() {
        let height = document.body.clientHeight;
        this.viewHeight = height - 150;
        this.loadData();
    },
    methods: {
        resetTreeData() {
            this.treeData = [{
                pid: null,
                id: 'root',
                isNew: false,
                title: '所有章节'
            }];
        },
        subNewNode(node) {
            if (node.pid === 'root') {
                node.pid = null;
            }
            this.$http.post("knowledge!addChapter.do", node).then(function(res) {
                let data = res.body;
                if (data.success) {
                    alert("操作成功");
                }
            });
        },
        addNode(parent) {
            this.treeData.push({
                pid: parent.id,
                knowledgeId: id,
                isNew: true,
                name: ''
            })
        },
        loadData() {
            this.resetTreeData();
            $.ajax({
                url: 'knowledge!detail.do',
                data: {
                    id: id
                }
            }).done(res => {
                let data = res.data;
                this.form = data;
                let chapterList = data.chapterList;
                if (chapterList) {
                    chapterList.forEach(ch => {
                        this.treeData.push(ch);
                    })
                }
            })
        },
        sub() {
            this.$http.post("knowledge!update.do", this.form).then(function(res) {
                let data = res.body;
                if (data.success) {
                    router.goRoute("knowledge/list");
                }
            });
        }
    }
})
        };
        return module.exports;
    }

    
);
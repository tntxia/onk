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
})('template/detail', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"app\">\r\n    <table id=\"form\" class=\"table table-bordered\">\r\n        <tr>\r\n            <th>名称</th>\r\n            <td><input v-model=\"detail.name\" style=\"width:400px;\"></td>\r\n        </tr>\r\n        <tr>\r\n            <th>显示名称</th>\r\n            <td><input v-model=\"detail.display_name\" style=\"width:400px;\"></td>\r\n        </tr>\r\n        <tr>\r\n            <th>服务路径</th>\r\n            <td><input v-model=\"detail.service_url\" style=\"width:400px;\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td colspan=\"2\">\r\n                <button @click=\"update\">修改</button>\r\n                <button @click=\"generateReport\">生成报表</button>\r\n                <button @click=\"exports\">导出</button>\r\n            </td>\r\n        </tr>\r\n    </table>\r\n    <cols-table :pid=\"id\"></cols-table>\r\n</div>";
        

        exports.init = function() {
            var id = router.getParam('id');

console.log("components", this.components);
new Vue({
    el: '#app',
    data() {
        return {
            id: id,
            detail: {
                id: id,
                name: null,
                display_name: null,
                service_url: null
            }
        }
    },
    components: this.components,
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: 'template!detail.do',
                data: {
                    id: id
                }
            }).done(res => {
                me.detail = res;
            })
        },
        update() {
            let param = this.detail;
            $.ajax({
                url: 'template!update.do',
                data: param
            }).done(res => {
                if (res.success) {
                    alert("修改成功");
                } else {
                    alert("修改失败");
                }
            }).fail(e => {
                console.error(e);
            });
        },
        generateReport: function() {
            this.$refs.paramsFillDialog.show();
        },
        exports() {
            $.ajax({
                url: 'template!export.do',
                data: {
                    id: id
                }
            }).done(function() {

            })
        }
    }
});
        };
        return module.exports;
    }

    ,
    'cols-table',
    function() {
        var module = Object.create(null);
        module.exports = {
    props: ['pid'],
    data() {
        return {
            showFlag: false,
            id: null,
            callback: null,
            coId: null,
            dataset: {
                url: 'template!listCols.do',
                method: 'post'
            }
        }
    },
    mounted() {
        this.query();
    },
    updated() {},
    methods: {
        add() {
            let datagrid = this.$refs["datagrid"];
            datagrid.addRow();
        },
        save(row) {
            let me = this;
            row.template_id = this.pid;
            $.ajax({
                url: 'template!addCol.do',
                type: 'post',
                data: row
            }).done(function(res) {
                if (res.success) {
                    alert("操作成功");
                    me.query();
                } else {
                    alert("操作失败");
                }
            })
        },
        query() {
            let datagrid = this.$refs["datagrid"];
            if (!datagrid) {
                return;
            }
            datagrid.loadData({
                id: this.pid
            });
        }
    },
    watch: {
        pid() {
            if (!this.pid) {
                return;
            }
            this.query();
        }
    }
}
module.exports.template = "<div>\r\n    <div>\r\n        <button @click=\"add\">增加列</button>\r\n    </div>\r\n    <jxiaui-datagrid ref=\"datagrid\" :dataset=\"dataset\">\r\n        <jxiaui-datagrid-item label=\"列名\">\r\n            <template v-slot=\"row\">\r\n                 <input v-model=\"row.name\">\r\n             </template>\r\n        </jxiaui-datagrid-item>\r\n        <jxiaui-datagrid-item label=\"对应字段\">\r\n            <template v-slot=\"row\">\r\n                 <input v-model=\"row.field\">\r\n             </template>\r\n        </jxiaui-datagrid-item>\r\n        <jxiaui-datagrid-item label=\"操作\">\r\n            <template v-slot:default=\"row\">\r\n                 <button @click=\"save(row)\">保存</button>\r\n             </template>\r\n        </jxiaui-datagrid-item>\r\n    </jxiaui-datagrid>\r\n</div>";
        return module.exports;
    }
    
);
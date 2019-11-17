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
})('province/list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        form: {
            name: null
        },
        dataset: {
            url: "province!list.do"
        }
    },
    mounted() {

    },
    methods: {
        add() {
            router.goRoute("province/add");
        },
        query() {
            let datagrid = this.$refs["datagrid"];
            datagrid.setParams(this.form);
            datagrid.loadData();
        },
        toEdit(row) {
            router.goRoute('province/edit', {
                id: row.id
            })
        },
        manageCity(row) {
            router.goRoute('city/list', {
                pid: row.id
            })
        },
        del(row) {
            $.ajax({
                url: 'province!del.do',
                data: {
                    id: row.id
                }
            }).done(res => {
                if (res.success) {
                    alert("操作成功");
                    me.query();
                } else {
                    alert("操作失败");
                }
            }).fail(e => {
                alert("操作异常");
            })
        }
    }
});
        };
        return module.exports;
    }

    
);
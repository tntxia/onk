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
})('sale/client_contact_list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = null;
        

        exports.init = function() {
            let url = webRoot + "/client/client!listContact.do";
new Vue({
    el: '#app',
    data: {
        dataset: {
            url: url,
            method: 'post',
            pageSize: 50
        },
        form: {
            name: null
        }
    },
    mounted() {},
    methods: {
        getUrl: function(row) {
            return '#sale/client_contact_view?id=' + row.nameid;
        },
        query() {
            let datagrid = this.$refs["datagrid"];
            datagrid.setParams(this.form);
            datagrid.loadData();
        },
        toAdd() {
            window.open(webRoot + '/sale/xmgl/xmglt.jsp');
        },
        del(row) {
            if (!confirm("是否确认删除此联系人，删除后无法恢复")) {
                return;
            }
            let me = this;
            $.ajax({
                url: 'client/contact!del.do',
                data: {
                    id: row.nameid
                }
            }).done(res => {
                if (res.success) {
                    alert("操作成功");
                    me.query();
                } else {
                    alert("操作失败");
                }
            })
        }
    }
});
        };
        return module.exports;
    }

    
);
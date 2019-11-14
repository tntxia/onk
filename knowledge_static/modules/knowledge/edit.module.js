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

        exports.init = function() {
            let id = router.getParam("id");

new Vue({
    el: '#app',
    data: {
        viewHeight: 500,
        form: {}
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
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
})('knowledge/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        form: {
            title: null,
            categoryId: null,
            categoryList: [],
            content: null,
            driver: "org.h2.Driver",
            username: "sa",
            password: "sa"
        }
    },
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: 'category!listAll.do'
            }).done(function(res) {
                if (res.success) {
                    me.categoryList = res.data;
                }
            })
        },
        sub() {
            this.$http.post("knowledge!add.do", this.form, function(res) {
                let data = res.body;
                if (data.success) {
                    router.goRoute("knowledge/list");
                }
            });
        }
    }
});
        };
        return module.exports;
    }

    
);
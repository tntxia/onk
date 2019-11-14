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
})('category/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        form: {
            name: null
        }
    },
    methods: {
        sub() {
            this.$http.post('category!add.do', this.form, function(res) {
                let data = res.body;
                if (data.success) {
                    router.goRoute("category/list");
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
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
})('city/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            let pid = router.getParam("pid");
new Vue({
    el: '#app',
    data: {
        form: {
            pid: pid,
            name: null,
            nameEn: null
        }
    },
    methods: {
        sub() {
            $.ajax({
                url: 'city!add.do',
                type: 'post',
                data: this.form
            }).then(res => {
                if (res.success) {
                    router.goRoute("city/list", {
                        pid: pid
                    })
                } else {
                    alert("操作失败");
                }
            }, e => {

            })
        }
    }
});
        };
        return module.exports;
    }

    
);
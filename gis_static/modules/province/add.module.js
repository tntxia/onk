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
})('province/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        form: {
            name: null,
            nameEn: null,
            regionType: 'SAR'
        }
    },
    methods: {
        sub() {
            $.ajax({
                url: 'province!add.do',
                type: 'post',
                data: this.form
            }).then(res => {
                if (res.success) {
                    alert("操作成功");
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
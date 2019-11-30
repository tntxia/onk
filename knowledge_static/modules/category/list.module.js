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
})('category/list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = null;
        

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        dataset: {
            url: "category!list.do"
        }
    },
    mounted() {},
    methods: {
        add() {
            router.goRoute("category/add");
        },
        getUrl(row) {
            return "#knowledge/list?categoryId=" + row.id;
        },
        toEdit(row) {
            router.goRoute('category/edit', {
                id: row.id
            })
        }
    }
});
        };
        return module.exports;
    }

    
);
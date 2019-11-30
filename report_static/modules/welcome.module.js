(function(name, moduleFun) {
    if (!window.modules) {
        window.modules = Object.create(null);
    };
    let module = moduleFun();
    if (arguments.length > 2) {
        let components = Object.create(null);
        for (let i = 2; i < arguments.length; i++) {
            let func = arguments[i];
            if (!func) {
                continue;
            }
            let component = func();
            components[component.name] = component.init;
        }
        module.components = components;
    }

    window.modules[name] = module;
})('welcome', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            
        };
        return module.exports;
    }

    
);
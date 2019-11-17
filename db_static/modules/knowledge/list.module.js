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
})('knowledge/list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            let categoryId = router.getParam("categoryId");
new Vue({
    el: '#app',
    data: {
        form: {
            id: null,
            name: null,
            url: null
        },
        dataset: {
            url: "knowledge!list.do",
            params: {
                categoryId: categoryId
            }
        }
    },
    mounted() {

    },
    methods: {
        getUrl(row) {
            return "#knowledge/view?id=" + row.id;
        },
        add() {
            router.goRoute("knowledge/add");
        },
        getContentShort(row) {
            let content = row.content;
            let tempEl = document.createElement("div");
            tempEl.innerHTML = content;
            content = tempEl.textContent;
            if (content.length <= 10) {
                return content;
            } else {
                return content.substring(0, 10) + "...";
            }
        },
        toEdit(row) {
            router.goRoute('knowledge/edit', {
                id: row.id
            })
        }
    }
});
        };
        return module.exports;
    }

    
);
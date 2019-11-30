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
})('template/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"app\">\n    <div class=\"jxiaui-table-form\">\n        <table>\n            <tr>\n                <th>名称</th>\n                <td><input v-model=\"form.name\"></td>\n            </tr>\n            <tr>\n                <th>显示名称</th>\n                <td><input v-model=\"form.display_name\"></td>\n            </tr>\n            <tr>\n                <th>服务路径</th>\n                <td><input v-model=\"form.service_url\"></td>\n            </tr>\n            <tr>\n                <td colspan=\"2\"><button @click=\"sub\">增加</button></td>\n            </tr>\n        </table>\n    </div>\n</div>";
        

        exports.init = function() {
            new Vue({
    el: '#app',
    data: {
        form: {}
    },
    methods: {
        sub() {
            var params = this.form;
            $.ajax({
                url: 'template!add.do',
                type: 'post',
                data: params
            }).done(function(data) {
                if (data.success) {
                    alert("操作成功");
                    router.goRoute("template/list");
                } else {
                    alert("操作失败");
                }
            }).fail(data => {
                alert("操作异常");
            })
        }
    }
})
        };
        return module.exports;
    }

    
);
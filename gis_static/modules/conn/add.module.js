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
})('conn/add', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        exports.init = function() {
            new Vue({
                el: '#app',
                data: {
                    form: {
                        name: null,
                        dbType: 'h2',
                        url: "jdbc:h2:<path>",
                        driver: "org.h2.Driver",
                        username: "sa",
                        password: "sa"
                    }
                },
                methods: {
                    chooseFile() {
                        this.$refs.fileChoose.show();
                    },
                    resetUrl(chooseFile) {
                        let dbType = this.form.dbType;
                        if (dbType == "h2") {
                            this.form.url = "jdbc:h2:tcp://localhost:9394/" + chooseFile.absolutePath;
                        } else if (dbType == "sqlserver") {
                            form.setValue("url", "jdbc:sqlserver://<host>:<port>;DatabaseName=<dbName>");
                        }
                    },
                    sub() {
                        $.ajax({
                            url: 'dbconn!add.do',
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
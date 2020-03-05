(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('header-main', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        let updatePasswordDialogComp = {
    template: "<jxiaui-dialog ref=\"dialog\" @close=\"hide\" :title=\"title\">\r\n    <table class=\"table table-bordered\">\r\n        <tr>\r\n            <th>原密码：</th>\r\n            <td><input v-model=\"passwordOld\"></td>\r\n        </tr>\r\n        <tr>\r\n            <th>新密码：</th>\r\n            <td><input v-model=\"newPassword\"></td>\r\n        </tr>\r\n        <tr>\r\n            <th>重复输入新密码：</th>\r\n            <td><input v-model=\"newPasswordRepeat\"></td>\r\n        </tr>\r\n    </table>\r\n    <div>\r\n        <button @click=\"sub\">确认</button>\r\n    </div>\r\n</jxiaui-dialog>",
    data() {
        return {
            title: "修改密码",
            passwordOld: null,
            newPassword: null,
            newPasswordRepeat: null
        }
    },
    methods: {
        show() {
            this.$refs.dialog.show();
        },
        hide() {
            this.$refs.dialog.close();
        },
        sub() {
            let me = this;
            let passwordOld = this.passwordOld;
            var password = this.newPassword;
            var password2 = this.newPasswordRepeat;

            if (!passwordOld) {
                alert("请输入原始密码");
                return;
            }

            if (!password) {
                alert("请输入密码");
                return;
            }

            if (!password) {
                alert("请输入重复密码");
                return;
            }

            if (password != password2) {
                alert("两次输入的密码不一定，请重新输入！");
                return;
            }

            $.ajax({
                url: webRoot +
                    "/user!changePass.do",
                data: {
                    passwordOld: passwordOld,
                    password: password
                },
                success: function(data) {
                    if (data.success) {
                        alert("密码修改成功！");
                        me.hide();
                    } else {
                        alert("修改失败！" + data.msg);
                    }
                }
            });

        }
    }
}

let mainMenuSelected;

module.exports = {
    props: ['module'],
    data() {
        return {
            username: null,
            loginList: [],
            toDoCount: 0,
            todoDialogTitle: null,
            menus: [],
            timeStr: null
        }
    },
    components: {
        'update-password-dialog': updatePasswordDialogComp
    },
    mounted() {

        let me = this;

        this.showTime();

        let vm = this;
        $.ajax({
            url: "menu!list.do"
        }).done(res => {
            res.forEach(m => {
                if (m.key_name === mainMenuSelected) {
                    m.selected = true;
                } else {
                    m.selected = false;
                }
            })
            vm.menus = res;
        })
        this.fetchData();
    },
    updated() {},
    methods: {
        showTime() {
            let me = this;

            var today = new Date;
            var week = new Array(7);
            week[0] = "天";
            week[1] = "一";
            week[2] = "二";
            week[3] = "三";
            week[4] = "四";
            week[5] = "五";
            week[6] = "六";
            this.timeStr = "今天是:" + today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日  星期" + week[today.getDay()];
        },
        home: function() {
            router.goRoute("index_main");
        },
        back: function() {
            history.back();
        },
        forward: function() {
            history.forward();
        },
        fetchData() {
            let vm = this;
            $.ajax({
                url: "userAlertCount.do",
                success: function(data) {
                    if (data.success) {
                        vm.toDoCount = data.count;
                    }
                },
                error: function(e) {
                    console.error(e);
                }
            });
            $.ajax({
                url: "logininfo.do"
            }).done(res => {
                vm.username = res.username;
                vm.todoDialogTitle = vm.username + "的待办事项"
                let loginList = res.loginList;
                if (!loginList) {
                    loginList = [];
                }
                vm.loginList = loginList;
            })
        },
        passchange: function() {
            debugger
            this.$refs.updatePasswordDialog.show();
        },
        selectMenu(key) {
            this.menus.forEach(m => {
                if (m.key_name == key) {
                    m.selected = true;
                } else {
                    m.selected = false;
                }
            })
        },
        openWork: function() {
            var url = 'setting/setting.dispatch?method=toWorkAgent';
            window.open(url);
        },
        openHelp: function() {
            var url = 'setting/help.jsp';

            window.open(url);

        },
        openAboat: function() {
            var url = 'viewSystemInfo.dispatch';

            window.open(url);
        },
        checkwork: function() {
            $.ajax({
                url: 'checkwork/checkwork!record.do',
                success: function(data) {
                    if (data.success) {
                        if (confirm("打卡成功！是否查看我的考勤？")) {
                            router.goRoute("hr_my_attandance");
                        }
                    } else {
                        alert("操作失败！");
                    }
                },
                error: function(e) {
                    alert("后台服务异常");
                }
            });
        },
        logout: function() {
            $.ajax({
                url: 'logout.do',
                success: function() {
                    window.location.reload();
                }
            });
        }
    },
    watch: {
        module() {
            let moduleName = this.module;
            let type;
            if (moduleName.indexOf("/") >= 0) {
                type = moduleName.split("/")[0];
            } else {
                type = moduleName.split("_")[0];
            }
            mainMenuSelected = type;
            this.selectMenu(type);
        }
    }
}
module.exports.template = "<div>\r\n    <div class=\"logo_and_nav\">\r\n        <header-logo-and-name></header-logo-and-name>\r\n        <div class=\"right-top-nav\">\r\n            <ul>\r\n                <li class=\"user-info-li\">\r\n                    <div>\r\n                        <header-user-pic></header-user-pic>\r\n                        <span>{{username }}</span>\r\n                        <span class=\"message-num-circle\">{{toDoCount}}</span>\r\n                    </div>\r\n                    <div class=\"drop-down-layer\">\r\n                        <header-my-todo></header-my-todo>\r\n                    </div>\r\n                </li>\r\n                <li>\r\n                    <a>个人设置</a><span class=\"glyphicon glyphicon-chevron-down\"></span>\r\n                    <div class=\"submenu\" style=\"position: absolute; top: 14px; border: 1px solid #ccc; background: white;\">\r\n                        <div>\r\n                            <a @click=\"passchange\">更改口令</a>\r\n                        </div>\r\n                        <div>\r\n                            <a href=\"workAgent.mvc\">工作代理</a>\r\n                        </div>\r\n                        <div>\r\n                            <a @click=\"openHelp\">Office Online 帮助</a>\r\n                        </div>\r\n                        <div>\r\n                            <a @click=\"openAboat\">关于Office Online </a>\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n                <li><a href=\"#knowledge/type\">知识库</a></li>\r\n                <li><a href=\"#rule\">规章制度</a></li>\r\n                <li><a @click=\"checkwork\">打卡登记</a></li>\r\n                <li><a @click=\"logout\">退出</a></li>\r\n            </ul>\r\n            <div id=\"topMessage\"></div>\r\n        </div>\r\n        <div class=\"current-online-info\">\r\n            {{timeStr}} 当前在线人数：{{loginList.length}} 在线人员列表：{{loginList.join(\";\")}}\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"top_bottom_menu\">\r\n        <ul id=\"historyMenu\">\r\n            <li id=\"home\"><span class=\"fa fa-home\" @click=\"home\"></span>\r\n            </li>\r\n            <li id=\"back\"><span class=\"fa fa-arrow-left\" @click=\"back\"></span>\r\n\r\n            </li>\r\n            <li id=\"forward\"><span class=\"fa fa-arrow-right\" @click=\"back\"></span>\r\n            </li>\r\n            <li>|</li>\r\n        </ul>\r\n        <ul id=\"menu1\">\r\n            <li v-for=\"m in menus\" :class=\"{selected: m.selected}\"><a :href=\"m.url\">{{m.name}}</a></li>\r\n        </ul>\r\n    </div>\r\n    <update-password-dialog ref=\"updatePasswordDialog\"></update-password-dialog>\r\n</div>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('header-logo-and-name', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    data() {
        return {
            companyName: null,
            companyNameEn: null
        }
    },
    mounted() {
        this.v = this.value;
        this.fetchData();
    },
    updated() {},
    methods: {
        handleChange() {
            this.$emit("input", this.v);
        },
        fetchData: function() {
            let vm = this;
            $.ajax({
                url: '/oa_static/json/app.json'
            }).done(function(data) {
                vm.companyName = data.companyName;
                vm.companyNameEn = data.companyNameEn;
            });
        }
    }
}
module.exports.template = "<div style=\"position: absolute;height: 59px;\">\r\n    <div class=\"logo\">\r\n    </div>\r\n    <div class=\"company-info\">\r\n        <div class=\"company-name\">{{companyName }}</div>\r\n        <div class=\"company-name-en\">{{companyNameEn }}</div>\r\n    </div>\r\n</div>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('header-user-pic', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        let mainMenuSelected;
module.exports = {
    data() {
        return {
            src: '/static/images/no-user-pic.png'
        }
    },
    mounted() {
        this.loadData();
    },
    updated() {},
    methods: {
        // 加载用户的图片数据
        loadData() {
            let me = this;
            $.ajax({
                url: 'user!picId.do'
            }).done(function(res) {
                if (res.success && res.picId) {
                    me.src = '/file_center/file!showPic.do?uuid=' + res.picId
                }
            })
        },
        // 打开上传文件窗口
        toUpload() {
            this.$refs["picFile"].click();

        },
        // 上传用户图片
        uploadUserPic() {
            let userFile = this.$refs["picFile"].files[0];
            console.log("userFile", userFile);
            let formData = new FormData();
            formData.append("pic", userFile);
            $.ajax({
                url: 'user!uploadPic.do',
                type: "post",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
            }).done(function(res) {
                if (res.success) {
                    me.loadData();
                } else {
                    alert("操作失败");
                }
            })

        },
    }
}
module.exports.template = "<div style=\"display: inline-block;\">\r\n    <img :src=\"src\" style=\"border-radius: 50%;width: 25px;\" title=\"点击上传头像\" @click=\"toUpload\">\r\n    <input type=\"file\" style=\"display: none;\" ref=\"picFile\" @change=\"uploadUserPic\">\r\n</div>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('header-my-todo', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    data() {
        return {
            username: null,
            title: null,
            items: []
        }
    },
    mounted() {
        this.fetchData();
    },
    updated() {},
    methods: {
        fetchData: function() {
            let vm = this;
            $.ajax({
                url: webRoot + "/userAlert.do",
                success: function(data) {
                    vm.username = data.username;
                    vm.title = vm.username + "的待办事项"
                    vm.items = data.items;
                },
                error: function(e) {
                    console.error(e);
                }
            });
        },
        handleClick() {
            this.hide();
        }
    }
}
module.exports.template = "<jxiaui-table-form v-if=\"items && items.length\">\r\n    <jxiaui-table-form-item :key=\"index\" :label=\"item.label\" v-for=\"(item,index) in items\" v-if=\"item.count>0\">\r\n        <a :href=\"item.url\" @click=\"handleClick\"> \r\n                    {{item.count}}\r\n                </a>\r\n    </jxiaui-table-form-item>\r\n</jxiaui-table-form>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('unit-select', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['value'],
    data() {
        return {
            v: null,
            unitList: []
        }
    },
    mounted() {
        this.loadData();
    },
    updated() {},
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: 'unit!list.do'
            }).done(function(res) {

                if (res && res.length) {
                    me.v = res[0].punit_name;
                }
                me.unitList = res;
            })
        }
    },
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<select v-model=\"v\">\r\n    <option v-for=\"u in unitList\">{{u.punit_name}}</option>\r\n</select>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('tax-select', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['value'],
    data() {
        return {
            v: "不含税",
            taxList: ["不含税", "增值发票3%", "普通发票3%", "普通发票13%", "增值发票13%", "普通发票16%", "增值发票16%", "普通发票17%", "增值发票17%", "商业发票"]
        }
    },
    mounted() {
        if (this.value) {
            this.v = this.value;
        } else {
            this.$emit("input", this.v);
        }
    },
    updated() {},
    methods: {},
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<select v-model=\"v\">\r\n    <option v-for=\"t in taxList\">{{t}}</option>\r\n</select>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('country-select', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['value'],
    data() {
        return {
            v: '中国',
            countryList: []
        }
    },
    mounted() {
        this.loadData();
    },
    updated() {},
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: '/gis/country!listAll.do'
            }).done(function(res) {
                let data = res.data;
                me.countryList = data;
            })
        }
    },
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<select v-model=\"v\">\r\n    <option v-for=\"c in countryList\">{{c.name}}</option>\r\n</select>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('province-select', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['value'],
    data() {
        return {
            v: null,
            provinceList: []
        }
    },
    mounted() {
        this.loadData();
    },
    updated() {},
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: '/gis/province!listAll.do'
            }).done(function(res) {
                let data = res.data;
                if (data && data.length) {
                    me.v = data[0].name;
                }
                me.provinceList = data;
            })
        }
    },
    watch: {
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<select v-model=\"v\">\r\n    <option v-for=\"c in provinceList\">{{c.name}}</option>\r\n</select>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('city-select', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['value', 'parent'],
    data() {
        return {
            v: null,
            cityList: []
        }
    },
    mounted() {
        this.loadData();
    },
    updated() {},
    methods: {
        loadData() {
            if (!this.parent) {
                return;
            }
            let me = this;
            $.ajax({
                url: '/gis/city!listAllByProvinceName.do',
                type: 'post',
                data: {
                    parent: this.parent
                }
            }).done(function(res) {
                let data = res.data;
                if (data && data.length) {
                    me.v = data[0].name;
                }
                me.cityList = data;
            })
        }
    },
    watch: {
        parent() {
            this.loadData();
        },
        v() {
            this.$emit("input", this.v);
        }
    }
}
module.exports.template = "<select v-model=\"v\">\r\n    <option v-for=\"c in cityList\">{{c.name}}</option>\r\n</select>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('client-choose-dialog', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    data() {
        return {
            id: null,
            callback: null,
            form: {
                id: null,
                rfq: null,
                gmjl: null,
                fk: null,
                th: null
            },
            dataset: {
                url: webRoot + '/client/client!list.do',
                method: 'post'
            }
        }
    },
    mounted() {},
    updated() {},
    methods: {
        show() {
            this.$refs.dialog.show();
        },
        choose(row) {
            this.$emit("choose", row);
            this.$refs.dialog.close();
        },
        query() {
            let datagrid = this.$refs["datagrid"];
            datagrid.setParams(this.form);
            datagrid.loadData();
        }
    }
}
module.exports.template = "<jxiaui-dialog :width=\"1000\" ref=\"dialog\">\r\n    <div>\r\n        <span>客户名称:</span><input v-model=\"form.coname\"><button @click=\"query\">查询</button>\r\n    </div>\r\n    <div>\r\n        <jxiaui-datagrid class=\"table\" ref=\"datagrid\" :dataset=\"dataset\">\r\n            <jxiaui-datagrid-item label=\"序号\" type=\"index\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"编号\" field=\"co_number\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"名称\" field=\"coname\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"电话\" field=\"cotel\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"地址\" field=\"coaddr\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"选择\">\r\n                <template v-slot=\"row\">\r\n                    <button @click=\"choose(row)\">选择</button>\r\n                </template>\r\n            </jxiaui-datagrid-item>\r\n        </jxiaui-datagrid>\r\n    </div>\r\n\r\n</jxiaui-dialog>"
        return module.exports;
    })(),

);
(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('client-choose-contact-dialog', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    props: ['pid'],
    data() {
        return {
            showFlag: false,
            id: null,
            callback: null,
            coId: null,
            dataset: {
                url: webRoot + '/client/contact!list.do',
                method: 'post'
            }
        }
    },
    mounted() {},
    updated() {},
    methods: {
        show() {
            this.$refs.dialog.show();
            this.$nextTick(function() {
                this.query();
            });
        },
        choose(row) {
            this.$emit("choose", row);
            this.$refs.dialog.close();
        },
        query() {
            let datagrid = this.$refs["datagrid"];
            if (!datagrid) {
                return;
            }
            datagrid.loadData({
                pid: this.pid
            });
        }
    },
    watch: {
        pid() {
            if (!this.pid) {
                return;
            }
            this.query();
        }
    }
}
module.exports.template = "<jxiaui-dialog :width=\"1000\" ref=\"dialog\">\r\n    <div>\r\n        <jxiaui-datagrid class=\"table\" ref=\"datagrid\" :dataset=\"dataset\" :load-data-when-init=\"false\">\r\n            <jxiaui-datagrid-item label=\"序号\" type=\"index\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"联系人\" field=\"name\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"先生/小姐\" field=\"mr\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"职位\" field=\"job\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"办公室电话\" field=\"tel\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"手机\" field=\"waptel\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"选择\">\r\n                <template v-slot=\"row\">\r\n                    <button @click=\"choose(row)\">选择</button>\r\n                </template>\r\n            </jxiaui-datagrid-item>\r\n        </jxiaui-datagrid>\r\n    </div>\r\n\r\n</jxiaui-dialog>"
        return module.exports;
    })(),

);
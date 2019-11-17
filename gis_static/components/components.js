(function(globe) {
    if (!globe.Vue) { console.warn("可能你还没导入Vue的引用。。。"); }
    if (arguments.length < 2) { console.warn('参数不对'); return; }
    for (let i = 1; i < arguments.length; i++) {
        Vue.component('file-choose', arguments[i]);
    }
})(window,

    (() => {
        let module = Object.create(null);
        module.exports = {
    name: 'file-choose',
    props: {
        value: {
            default: ''
        }
    },
    render: function(h) {

        if (!this.showFlag) {
            return h();
        }

        let me = this;
        let domTree = new VueRenderDomTree(h);
        domTree.setOptions({
            'class': 'file-choose'
        });
        let title = domTree.createElement('div', {
            'class': 'title-bar'
        });
        title.createElement('button', {
            text: '关闭',
            on: {
                click: function() {
                    me.showFlag = false;
                }
            }
        });
        let treeDiv = domTree.createElement("div", {
            'class': 'tree'
        });

        appendToTree(treeDiv, this.tree);
        return domTree.render();

        function appendToTree(parent, data) {
            data.forEach(d => {
                let el = parent.createElement('div', {
                    'class': 'tree-node',
                    on: {
                        click: function(e) {
                            e.stopPropagation();
                            me.$emit("choose", d);
                            me.hide();
                            console.log(d);
                        }
                    }
                });
                el.createElement("span", {
                    'class': ['tree-node-toggle', d.expand ? 'fa fa-caret-up' : 'fa fa-caret-down'],
                    on: {
                        click: function(e) {
                            e.stopPropagation();
                            me.loadFile(d);
                            console.log(d);
                        }
                    }
                });
                el.createElement("span", {
                    text: d.name
                });
                if (d.children) {
                    appendToTree(el, d.children);
                }
            })
        }
    },
    data() {
        return {
            showFlag: false,
            tree: []
        }
    },
    mounted() {},
    methods: {
        loadFile(parent) {
            let me = this;
            let parentPath;
            if (parent) {
                parentPath = parent.absolutePath;
            }
            $.ajax({
                url: 'file!list.do',
                data: {
                    parent: parentPath
                }
            }).done(function(res) {
                if (res.success) {
                    let data = res.data;
                    if (!parent) {
                        me.tree = data;
                    } else {
                        me.$set(parent, "children", data);
                    }
                }
            })
        },
        show() {
            this.showFlag = true;
            this.loadFile();
        },
        hide() {
            this.false = true;
        },
        choose(file) {
            this.$emit("choose", file);
        }
    }
}
        return module.exports;
    })(),

);
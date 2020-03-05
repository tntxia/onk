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
})('report/list', function() {
        var module = Object.create(null);
        var exports = Object.create(null);
        module.exports = exports;

        
        module.exports.template = "<div id=\"template-app\">\r\n    <div id=\"form\">\r\n        <button @click=\"add\">增加报表模板</button>\r\n        <button @click=\"toImport\">导入</button>\r\n        <input type=\"file\" ref=\"hiddenFileInput\" @change=\"uploadFile\" style=\"display:none;\">\r\n\r\n    </div>\r\n    <div id=\"datagrid\">\r\n        <jxiaui-datagrid class=\"table\" :dataset=\"dataset\">\r\n            <jxiaui-datagrid-item label=\"名称\" field=\"name\"></jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"状态\" field=\"status\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"文件路径\" field=\"file_path\">\r\n                <template v-slot=\"row\">\r\n                    {{row.file_path}} <button @click=\"down(row)\">下载</button>\r\n                </template>\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"创建时间\" field=\"create_time\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"服务地址\" field=\"service_url\">\r\n            </jxiaui-datagrid-item>\r\n            <jxiaui-datagrid-item label=\"操作\">\r\n                <template v-slot=\"row\">\r\n\t\t\t\t\t<button @click=\"del(row)\">删除</button>\r\n                    <button @click=\"exports(row)\">导出</button>\r\n                    <button @click=\"copy(row)\">复制</button>\r\n\t\t\t\t</template>\r\n            </jxiaui-datagrid-item>\r\n        </jxiaui-datagrid>\r\n    </div>\r\n</div>";
        

        exports.init = function() {
            let url = webRoot + "report!list.do";

new Vue({
    el: '#template-app',
    data() {
        return {
            dataset: {
                url: url,
                method: 'post',
                pageSize: 50
            }
        }
    },
    mounted() {},
    methods: {
        loadData() {
            let me = this;
            $.ajax({
                url: "report!list.do"
            }).done(res => {
                me.$refs["templateList"].setRows(res.rows);
            })
        },
        add() {
            router.goRoute("template/add");
        },
        del(row) {
            let me = this;
            $.ajax({
                url: 'template!del.do',
                data: {
                    id: row.id
                }
            }).done(function(data) {
                if (data.success) {
                    alert("删除成功");
                    me.loadData();
                } else {
                    alert("删除失败")
                }
            }).fail(function() {
                alert("删除异常")
            })
        },
        exports(row) {
            let me = this;
            $.ajax({
                url: 'template!export.do',
                data: {
                    id: row.id
                }
            }).done(function(data) {
                if (data.success) {
                    let downloadPath = "http://" + host + ":" + port + "/" + contextPath + "/file!download.do?uuid=" + data.uuid
                    window.open(downloadPath);
                } else {
                    alert("导出失败")
                }
            }).fail(function() {
                alert("导出异常")
            })
        },
        down(row) {
            window.open("report!download.do?id=" + row.id);
        },
        toImport() {
            this.$refs["hiddenFileInput"].click();
        },
        uploadFile(e) {
            let file = event.target.files[0];
            console.log(e);
            let param = new FormData();
            param.append('file', file);
            $.ajax({
                type: "POST",
                data: param,
                url: 'template!templateImport.do',
                contentType: false,
                processData: false,
            }).success(function(data) {
                if (data.status) {
                    console.log(data.url);
                } else {
                    console.log(data.msg);
                }
            }).error(function(data) {
                alert(data);
                console.log(data);
            });
        }
    }
})
        };
        return module.exports;
    }

    
);
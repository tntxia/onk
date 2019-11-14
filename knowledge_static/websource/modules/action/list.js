new Vue({
    el: '#app',
    data: {
        form: {
            id: null,
            name: null,
            url: null
        },
        dataset: {
            url: "action!list.do"
        }
    },
    mounted() {

    },
    methods: {
        add() {
            router.goRoute("action/add");
        },
        toEdit(row) {
            router.goRoute('action/edit', {
                id: row.id
            })
        }
    }
});
<template>

        <div class="pt-3">
            <b-row class="justify-content-center">
                <b-col class="p-4 col-9 border border-summary">
                    {{description}}
                </b-col>
            </b-row>
        </div>

</template>

<script>
    export default {
        name: 'summary-site',
        props: {description:String},
        data: () => {
            return {}
        },
        methods: { },
        watch: {

        },
    }
</script>

<style scoped>

    .border-summary{border-radius: 9px;}

</style>

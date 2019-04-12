<template>
    <b-container fluid id="footer">
        <top-bar :flag="false" class="ml-0 mr-0 pt-5"></top-bar>

        <b-row class="justify-content-center text-right p-3 mr-5 text-white">
            <b-col sm="12" md="12" lg="12">
                <b-container class="p-2">
                    <small> &copy; Todos los derechos reservados, {{ new Date().getFullYear() }}</small>
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import TopBar from '../components/TopBar';

    export default {
        name: "SixthSection",
        components: {
            TopBar
        },
        data: () => {
            return {
                optionsMenu: [
                    {
                        positionOption: '01',
                        name: 'INICIO'
                    },
                    {
                        positionOption: '02',
                        name: 'EXHIBICIÓN PRINCIPAL'
                    },
                    {
                        positionOption: '03',
                        name: 'COLECCIONES'
                    },
                    {
                        positionOption: '04',
                        name: 'BLOG'
                    },
                    {
                        positionOption: '05',
                        name: 'VIDEOS'
                    }

                ]
            }
        }
    }
</script>

<style scoped>

    #footer {
        background-color: #152f4e;
    }

</style>
<template>
    <b-container fluid id="footer">
        <b-row class="justify-content-center pt-5">
            <b-col sm="2" md="2" lg="2" v-for="option in optionsMenu" :key="option.positionOption" class="p-2 option">
                <b-link router-tag="a" to="/" class="text-left text-no-decoration text-white flex-fill">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':(parseInt(option.positionOption) === 1)}"></b-dropdown-divider>
                    <small>{{option.name}}</small>
                </b-link>
            </b-col>
        </b-row>

        <b-row class="justify-content-center text-right pr-5 text-white">
            <b-col sm="12" md="12" lg="12">
                <p> &copy; Todos los derechos reservados, {{ new Date().getFullYear() }}</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "SixthSection",
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
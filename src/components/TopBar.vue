<template>
    <!--menu-->
        <div class="position-absolute text-white d-flex justify-content-center" id="topbar">
            <div v-for="option in optionsMenu" :key="option.positionOption" class="p-2 option">
                <b-link router-tag="a" to="/" class="text-left text-no-decoration text-white flex-fill">
                    {{option.positionOption}}
                    <b-dropdown-divider class="divider-line-2"
                                        :class="{'active':(parseInt(option.positionOption) === 1)}"></b-dropdown-divider>
                    <small>{{option.name}}</small>
                </b-link>
            </div>
        </div>
</template>

<script>
export default {
    name:'TopBar',
    data:()=>{
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
    #topbar {
        z-index: 2;
        top: 35px;
        margin-left: 25%;
        margin-right: 25%;
    }

    .divider-line-2 {
        border: 2px solid #fff;
    }

    .option {
        width: 180px;
    }

    .dropdown-divider.active {
        border: 2px solid #6aae40;
    }

    .text-no-decoration {
        text-decoration: none;
    }
</style>
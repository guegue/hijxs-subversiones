<template>
    <b-container fluid id="content-testimonios">
        <div id="sub-content-test" class="justify-content-center">
            <b-row class="mt-4">
                <div class="" style="width:45%; margin-left:3%;">
                    <button type="button" class="btn btn-lg btn-style btn-color">
                      <span style="color:#65b32e !important;  stroke: white; stroke-width: 40;" class="fa fa-filter">
                      </span> FILTRAR
                    </button>
                </div>
                <div class="" style="width:45%; margin-left:3%;">
                    <div class="input-group h-100">
                        <input type="text" class="form-control h-100" placeholder="Search this">
                        <div class="input-group-append">
                            <button class="btn btn-color text-white pr-4 pl-4" style="font-size: 1.9em !important;"
                                    type="button">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </b-row>

            <b-row class="mt-4 mb-2 justify-content-center">
                <!--            <b-col sm="11" md="11" lg="11" class="text-center">-->
                <div class="card" style="width:45%; margin-right:3%; height: 440px;">
                    <div class="card-body mt-4">
                        <h5 class="card-title">Testimonios recopidados</h5>
                        <h6 class="card-subtitle color-green mb-2">a través del tiempo</h6>
                        <p class="card-text-test">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi ut aliquip ex ea commodo consequat...
                            <a href="#" key="idcard-content" class="color-green id-card-content" target="_blank">
                                VER MÁS
                            </a>
                        </p>
                        <div class="mt-4">
                            <span class="btn-circle-card mt-1">
                                    <img class="img-card" style="border-radius: 100px;" width="60px" height="60px" src="https://sub-versiones.hijosdeperu.org/files/medium/ffe586ec3245dcb562c382b910c1d644df514c49.jpg">
                            </span>
                            <div class="autor" style="padding-top: 60px;">
                                Alejandro Cortez
                            </div>
                            <div class="autor">
                                42 años / Lima
                            </div>
                        </div>

                    </div>
                </div>

                <div class="card" style="width:45%;">
                    <div class="card-body mt-4">
                        <h5 class="card-title">Testimonios recopidados 2</h5>
                        <h6 class="card-subtitle color-green mb-2">a través del tiempo</h6>
                        <p class="card-text-test ">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi ut
                            aliquip ex ea commodo consequat.
                        </p>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>

                <!-- </b-col>-->
            </b-row>
        </div>
    </b-container>

</template>

<script>

    export default {
        name: 'ThirdSection',
        data: () => {
            return {
                resourceClass: []
            }
        },
    created() {
        this.getClassCita();
    },
        methods: {
            getClassCita() { // Testimonios Clase (80)
                this.$axios(this.$domainOmeka + 'api/item_sets?site_id=13&site_id=13&resource_class_id=80') //site_id=13 site Contexto
                    .then((classTestimonio) => this.getTestimonios(classTestimonio))
                    .then(() => {
                        this.$nextTick(() => {

                        });
                    })
            },
           getTestimonios(classTestimonio){

               if(parseInt(classTestimonio.data.length)>0)
               {
                   this.$axios(classTestimonio.data[0]['o:items']['@id'])
                       .then((itemsTestimonio) => this.recorrerTestimonios(itemsTestimonio))
                       .then((resp)=>console.log(resp))

               }
           },
           async recorrerTestimonios(itemsTestimonio){

                var ciclo =0;

                if(parseInt(itemsTestimonio.data.length)>0)
                {
                   await itemsTestimonio.data.forEach(async (testimonio)=>{

                       await this.$axios(testimonio['o:media'][0]['@id'])
                         .then((img) => {
                             window.console.log(img.data['o:thumbnail_urls'].medium);
                             ciclo+=1;
                         })

                    });
                }

    }
        },
    }

</script>

<style scoped>

    #content-testimonios {
        background-color: #f8f8f8;
    }

    .color-green {
        color: #65b32e;
    }

    .btn-color {
        background-color: #65b32e;
    }

    #sub-content-test {
        width: 85vw;
        margin: auto;
    }

    .btn-style {
        padding-right: 6rem !important;
        padding-left: 6rem;
        font-size: 1.3em;
        font-weight: 500;
        color: #fff;
    }

    .btn-style:hover {
        color: #fff
    }

    .card-title {
        font-size: 2.1em;
        color: #152f4e;
        margin-bottom: -6px;
    }

    .card-subtitle {
        font-size: 2em;
    }

    .card-text-test {
        color: #5d5d5d;
        font-size: 1.2em;
        font-weight: 400;
        text-align: justify;

    }

    .id-card-content {
        font-weight: 600;
        font-size: 1.1em;
    }

    .autor {
        color: #4a4a4a;
        text-indent: 175px;
        font-weight: 600;
        font-size: 1.3em;
    }

    .btn-circle-card {
        width: 120px;
        height: 120px;
        text-align: center;
        padding: 30px 0;
        font-size: 1em;
        line-height: 1.428571429;
        border-radius: 65px;
        position: absolute;
        font-weight: 500;
        /*background-color: #d0d0d0;*/
        /*background: radial-gradient(circle, #fff, #f1ecec, #d0d0d0);*/
        background: linear-gradient(217deg, rgba(255,255,255,.8), rgba(255,0,0,0) 70.71%),
        linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
        linear-gradient(360deg, rgba(82,82,82,.8), rgba(0,0,255,0) 70.71%)
       /* background: rgb(255,255,255);
        background: radial-gradient(circle, rgba(230,230,230,0.3) 40%, rgba(82,82,82,0.7) 30%, rgba(90,92,93,.4) 30%); */

    }
    .img-card:hover{
        -webkit-transform:scale(1.1); transform:scale(1.1);
    }



</style>

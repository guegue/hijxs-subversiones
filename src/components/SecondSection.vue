<template>
    <div>
        <b-container class="background-degraded" fluid>
            <!--horizontal line-->
            <b-row class="ml-5 pl-5">
                <b-col sm="12" md="12" lg="12">
                    <hr class="line-top-title">
                </b-col>
            </b-row>
            <!--Title Section-->
            <b-row class="ml-5 pl-5 mb-5 text-white">
                <b-col sm="12" md="12" lg="12">
                    <h1 class="title-exhibition text-uppercase">Nuestras Exhibici&oacute;n</h1>
                </b-col>
            </b-row>



            <b-row class="justify-content-center">

                <b-col sm="3" md="3" lg="3" v-for="(card,index) in contentCards" :key="index"
                       class="p-0 div-card opacity-img">
                    <img :src="card.image" class="w-100 h-100" alt="">
                    <h3 class="title-card">{{card.title}}</h3>
                    <h5 class="rotation-270 place-date-card">{{card.place}} | {{card.date}}</h5>
                    <i class="fas fa-share-alt fa-2x"
                       :class="{'share-card-1':((index + 1) % 2 === 1),'share-card-2':((index + 1) % 2 === 0)}"></i>
                </b-col>

            </b-row>


        </b-container>
    </div>

</template>

<script>
    export default {
        name: "SecondSection",
        data: () => {
            return {
                contentCards: [
                    {
                        title: 'Title',
                        image: 'http://news.princeton.edu/uploads/266/image/2012_b/peru/Peru_Spotlight_MI.jpg',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/02/2018',
                        place: 'Cusco, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://us.123rf.com/450wm/wollertz/wollertz1608/wollertz160800206/64723702-per%C3%BA-11-mayo-vista-a%C3%A9rea-de-las-monta%C3%B1as-de-per%C3%BA-de-un-avi%C3%B3n-que-vuela-de-lima-a-cuzco-11-de-mayo-de-2016-per%C3%BA-.jpg?ver=6',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/10/2020',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'http://coolspotters.com/files/photos/979071/llama-profile.jpg',
                        description: 'This card has supporting text below as a natural lead-in to additional content.',
                        date: '31/12/2000',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://st3.depositphotos.com/1022135/19317/i/450/depositphotos_193177768-stock-photo-detail-urubamba-river-peru.jpg',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
                        date: '10/03/2012',
                        place: 'Arequipa, Peru'
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .background-degraded {
        height: 660px;
        background-image: linear-gradient(to right, #152f4e, #65B32E);
    }

    .line-top-title {
        border: 2px solid #fff;
        width: 7%;
        margin-left: 0.4em;
    }

    .title-exhibition {
        font-style: oblique;
    }

    .div-card {
        height: 520px;
        width: 25% !important;
        min-width: 25% !important;
        max-width: 25% !important;
    }

    .div-card:nth-child(1) {
        top: 40px;
        left: -30px;
        z-index: 4;
    }

    .div-card:nth-child(2) {
        left: -50px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 5;
    }

    .div-card:nth-child(3) {
        left: -30px;
        top: 60px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 6;
        height: 550px;
    }

    .div-card:nth-child(4) {
        left: -5px;
        margin-right: -50px;
        padding-right: -150px;
        z-index: 7;
    }

    .opacity-img {
        position: relative;
        opacity: 1;
        transition: all 0.5s;
        -webkit-transition: all 0.5s;
    }

    .opacity-img:after {
        content: '\A';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 1;
        transition: background 0.5s;
        -webkit-transition: background 0.5s;
    }

    .opacity-img:hover:after {
        opacity: 0;
        background: rgba(0, 0, 0, 0);
    }

    .title-card {
        z-index: 10;
        position: absolute;
        top: 35px;
        left: 25px;
        color: #fff;
    }

    .place-date-card {
        z-index: 10;
        position: absolute;
        bottom: 160px;
        left: -125px;
        color: white !important;
        font-style: oblique;
        font-weight: 500;
        letter-spacing: 5px;
    }

</style>
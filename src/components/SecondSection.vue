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
            <b-row class="ml-5 pl-5 text-white">
                <b-col sm="12" md="12" lg="12">
                    <h1 class="title-exhibition text-uppercase">Nuestras Exhibici&oacute;n</h1>
                </b-col>
            </b-row>


            <b-row class="mt-5" id="group-card">

                <b-col sm="3" md="3" lg="3" v-for="(card,index) in contentCards" :key="index" class="p-0 div-card">
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
                        image: 'https://placekitten.com/g/300/450',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/02/2018',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://placekitten.com/g/300/450',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.',
                        date: '01/10/2020',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://placekitten.com/g/300/450',
                        description: 'This card has supporting text below as a natural lead-in to additional content.',
                        date: '31/12/2000',
                        place: 'Lima, Peru'
                    },
                    {
                        title: 'Title',
                        image: 'https://placekitten.com/g/300/450',
                        description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
                        date: '10/03/2012',
                        place: 'Lima, Peru'
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .background-degraded {
        background-image: linear-gradient(to right, #15304E, #60AC30);
    }

    .line-top-title {
        border: 2px solid #fff;
        width: 7%;
        margin-left: 0.4em;
    }

    .title-exhibition {
        font-style: oblique;
    }

    .container-fluid #group-card {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .div-card {
        height: 520px;
        width: 25% !important;
        min-width: 25% !important;
        max-width: 25% !important;
    }

    .div-card:nth-child(1) {
        top: 40px;
        z-index: 4;
    }

    .div-card:nth-child(2) {
        left: -25px;
        /*padding-left: -50px;*/
        margin-right: -50px;
        padding-right: -150px;
        z-index: 5;
    }

    .div-card:nth-child(3) {
        left: -20px;
        top: 60px;
        /*padding-left: -50px;*/
        margin-right: -50px;
        padding-right: -150px;
        z-index: 6;
        height: 550px;
    }

    .div-card:nth-child(4) {
        left: -5px;
        /*padding-left: -50px;*/
        margin-right: -50px;
        padding-right: -150px;
        z-index: 7;
    }

    .title-card {
        position: absolute;
        top: 35px;
        left: 25px;
        color: #fff;
    }

    .share-card-1 {
        position: absolute;
        top: 15px;
        right: 45px;
        color: #fff;
    }

    .share-card-2 {
        position: absolute;
        top: 15px;
        right: 30px;
        color: #fff;
    }

    .rotation-270 {
        transform: rotate(270deg);
        -webkit-transform: rotate(270deg); /* Safari */
        -moz-transform: rotate(270deg); /* Firefox */
        -ms-transform: rotate(270deg); /* IE */
        -o-transform: rotate(270deg); /* Opera */
    }

    .place-date-card {
        position: absolute;
        bottom: 160px;
        left: -125px;
        color: blue !important;
        font-style: oblique;
        font-weight: 500;
        letter-spacing: 5px;
    }


</style>
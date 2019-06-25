<template>
    <div>
        <first-section :menuSite="optionsMenu"></first-section>
        <SummarySite :description="description"> </SummarySite>
        <third-section :idResourcesSite="idPageSite"></third-section>
        <fourth-section></fourth-section>
        <fifth-section></fifth-section>
        <second-section></second-section>
        <sixth-section :indexMenu="1" :menuSite="optionsMenu"></sixth-section>
    </div>
</template>

<script>
    import FirstSection from '../components/FirstSection';
    import SummarySite from '../components/SummarySite';
    import SecondSection from '../components/SecondSection';
    import ThirdSection from '../components/ThirdSection';
    import FourthSection from '../components/FourthSection';
    import FifthSection from '../components/FifthSection';
    import SixthSection from '../components/SixthSection';

    import sitesMixin from '../mixins/webSitesMixin';
    import Encrypt from '../mixins/encryptString';

    export default {
        name: 'HomePage',
        mixins: [sitesMixin, Encrypt],
        components: {
            FirstSection,
            SummarySite,
            SecondSection,
            ThirdSection,
            FourthSection,
            FifthSection,
            SixthSection
        },
    data: () => {
        return {
           baseKeyEncrypt: [],
            description:'',
        }
    },
        created() {
            let dataSite = this.getSites(this.$idDefauldSite);

            dataSite.then((data)=>{
                this.description = data['o:summary'];
                let slugSite=data['o:slug'];
                this.buildMenu(this.$idDefauldSite, slugSite).then((dataMenuSite)=>{ //// Extaer menu sitio 13 Contexto
                    /*this.$menuSite  = this.optionsMenu;*/

                    localStorage.setItem('menuSite', JSON.stringify( this.optionsMenu));
                    localStorage.setItem('labelPage',JSON.stringify(this.encrypyBaseKey(this.baseKey)));
                })
            });
        },
        mounted() {},
        methods: {
            encrypyBaseKey(basekey){

                for(const[i,char] of basekey.split('').entries())
                    this.baseKeyEncrypt.push((char.charCodeAt(0)*(9-i))+81);

                return this.baseKeyEncrypt;
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

    .abc >.carousel-caption{
        height: 96%;
        width: 93%;
        margin-left: -10%;
    }
    .carousel-control-prev, .carousel-control-next {bottom: -85%!important;}

    .rotation-270 {
        transform: rotate(270deg);
        -webkit-transform: rotate(270deg); /* Safari */
        -moz-transform: rotate(270deg); /* Firefox */
        -ms-transform: rotate(270deg); /* IE */
        -o-transform: rotate(270deg); /* Opera */
    }

    .share-card-1 {
        z-index: 10;
        position: absolute;
        top: 15px;
        right: 45px;
        color: #fff;
    }

    .share-card-2 {
        z-index: 10;
        position: absolute;
        top: 15px;
        right: 30px;
        color: #fff;
    }

    /*Height del Slider*/
    .img-fluid { height: -webkit-fill-available !important;}

    /*Loading page*/
    [v-cloak] > * {
        display: none;
    }

    [v-cloak]::before {
        content: '';
        position: absolute;
        left: 50%;
        z-index: 1000;
        width: 150px;
        height: 150px;
        margin: -75px 0 0 -75px;
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /*
        ===================================
        |        Style Social-Media       |
        ===================================
    */
    .fa-facebook{color:#3b5998;}
    .fa-google-plus{color:#dd4b39;}
    .fa-linkedin-in{color:#fff;  border-radius: 50%; padding: 7px; background-color: #0077b5;}
    .fab.fa-twitter{color:#fff;  border-radius: 50%; padding: 6px; background-color: #1da1f2;}
    .fa-whatsapp{color:#fff; border-radius: 50%; padding: 4px; background-color: #075e54;}
    .fa-reddit{color:#ff4500;}

    .social-media>span
    {
        font-size: 40px;
        padding-bottom: 3px;
        transition: .5s;
        display: grid;
    }

</style>

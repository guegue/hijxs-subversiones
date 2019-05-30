<template>
    <b-container fluid id="content-testimonios">
        <div id="sub-content-test" class="justify-content-center">
        <b-row class="mt-4 border text-center">
            <b-col class="border col-sm-11 col-md-4 col-lg-4" >
                  <button type="button" class="btn btn-lg btn-style btn-color">
                      <span style="color:#65b32e !important;  stroke: white; stroke-width: 40;" class="fa fa-filter">
                      </span> Filtrar</button>
            </b-col>
            <b-col class="border col-sm-11 col-md-4 col-lg-4" >
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Search this blog">
                <div class="input-group-append">
                    <button class="btn btn-color text-white" type="button">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>
            </b-col>
        </b-row>

        <b-row class="mt-4 mb-2 justify-content-center">
            <b-col sm="11" md="11" lg="11" class="text-center">

                <div class="card" style="width: 23rem;">
                    <div class="card-body">
                        <h5 class="card-title">Testimonios recopidados</h5>
                        <h6 class="card-subtitle mb-2 text-muted">a través del tiempo</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>

            </b-col>
        </b-row>
     </div>
    </b-container>

</template>

<script>
    export default {
        name: 'ThirdSection'
    }
</script>

<style scoped>

   #content-testimonios{
       background-color: #f8f8f8;
   }

   #sub-content-test{
       width: 85vw;
       border: 1px solid blue;
       margin: auto;
   }
  .btn-style{
      padding-right: 6rem !important;
      padding-left: 6rem;
      font-size: 1.5em;
      font-weight: 500;
      color: #fff;
  }

   .btn-color{ background: #65b32e;}

   .btn-style:hover{color:#fff}

    a {
        text-decoration: underline;
    }

</style>
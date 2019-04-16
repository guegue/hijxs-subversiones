<template>
    <div class="container-timeline">
        <div class="background-top">



            <div class="timeline">
                <ul>
                    <li>
                        <div>
                            <time>1934</time> At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1937</time> Proin quam velit, efficitur vel neque vitae, rhoncus commodo mi. Suspendisse finibus mauris et bibendum molestie. Aenean ex augue, varius et pulvinar in, pretium non nisi.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1940</time> Proin iaculis, nibh eget efficitur varius, libero tellus porta dolor, at pulvinar tortor ex eget ligula. Integer eu dapibus arcu, sit amet sollicitudin eros.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1943</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1946</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1956</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1957</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1967</time> Aenean condimentum odio a bibendum rhoncus. Ut mauris felis, volutpat eget porta faucibus, euismod quis ante.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1977</time> Vestibulum porttitor lorem sed pharetra dignissim. Nulla maximus, dui a tristique iaculis, quam dolor convallis enim, non dignissim ligula ipsum a turpis.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>1985</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>2000</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                    <li>
                        <div>
                            <time>2005</time> In mattis elit vitae odio posuere, nec maximus massa varius. Suspendisse varius volutpat mattis. Vestibulum id magna est.
                        </div>
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>

<script>
    require('@/assets/css/timeline.css');

    export default {
        name: "Timeline"
    }
</script>

<style scoped>
    .container-timeline{
        height: 100vh;
        position: relative;
        background-image: url("https://wallup.net/wp-content/uploads/2015/12/234980-nature-landscape-water-rock-trees-forest-lake-mountain-pine_trees-hill-grass-valley.jpg");
    }

    .background-top:before{
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(rgba(255,255,255,0), rgba(69, 105, 144, 0.7));
    }

    .list-item {
        display: inline-block;
        margin-right: 10px;
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }
</style>
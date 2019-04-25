<template>
    <div class="dot" @click="selectYear">
        <p class="year">
            {{ year.anio }}
        </p>
    </div>
</template>

<script>
    export default {
        name: "TimelineYearItem",
        props: ['year'],
        methods: {
            selectYear(event) {
                let dots = document.querySelectorAll('.dot');
                let target = event.target;

                dots.forEach((dotStyle) => {
                    dotStyle.classList.remove('prueba');
                    dotStyle.style.transform = 'scale(0.8)';
                });

                if (target.classList.contains('year')) {
                    target = event.target.parentNode;
                }

                target.classList.add('prueba');
                target.style.transform = 'scale(1.7)';
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div class="dot" @click="selectYear">
        <p class="year">
            {{ year }}
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
                let year;

                dots.forEach((dotStyle) => {
                    dotStyle.classList.remove('dotSelected');
                    dotStyle.style.transform = 'scale(0.8)';
                });

                if (target.classList.contains('year')) {
                    target = event.target.parentNode;
                }

                target.classList.add('dotSelected');
                target.style.transform = 'scale(1.7)';

                year = target.textContent;

                this.$root.$emit('selectYear', year);
            }
        }
    }
</script>

<style scoped>

</style>
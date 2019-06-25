<template>
    <b-navbar class="nav-fixed">
        <b-col cols="2">
            <b-form-select v-if="months.length > 0" v-model="selected" :options="months" class="timeline-months"></b-form-select>
        </b-col>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-form right>
                <span class="text-white"><i class="fas fa-bars fa-2x"></i></span>
            </b-nav-form>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>

    import timelineMixin from '../../mixins/timelineMixin';

    export default {
        name: "TimelineTopBar",
        mixins: [
            timelineMixin
        ],
        data() {
            return {
                selected: null,
                months: [],
            }
        },
        mounted() {
            this.$root.$on('itemsDateMonthUnique', (itemsDateMonthUnique) => {
                let defaultOption = {
                    value: null,
                    text: 'Seleccione un mes'
                };

                this.months = [];

                this.months.push(defaultOption);

                itemsDateMonthUnique.forEach((month) => {
                    this.months.push({
                        value: month,
                        text: this.$moment(month, 'MM').format('MMMM').toUpperCase()
                    })
                });
            });
        }
    }
</script>

<style scoped>

</style>
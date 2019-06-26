export default {
    data: () => {
        return {
            itemsCircle: null
        }
    },
    watch: {},
    methods: {
        listItemsExist() {
            return document.querySelectorAll('.list-item').length > 0;
        },
        clearItemsSelected() {
            document.querySelectorAll('.list-item').forEach((item) => {
                item.style.zIndex = '';
                item.style.transform = '';
                item.style.background = 'rgb(193, 193, 193)';

                item.classList.remove('list-item-width');
            });
        },
        clearCircleItemsSelected() {
            this.itemsCircles = document.querySelectorAll('.item-circle');

            this.itemsCircles.forEach((circle) => {
                circle.style.background = 'transparent';
                circle.style.border = '2px solid white';
            });
        },
        selectItemCircle(idItem) {
            let item = document.getElementById('item-' + idItem);

            if (item !== null) {
                let itemCircle = document.getElementById('item-circle-' + idItem);

                itemCircle.style.background = '#65B32E';
                itemCircle.style.border = 'none';
            }
        }
    }
}
export default {
    data() {
        return {
            urlBase: null,
            page: 1,
            elementViewPort: null
        }
    },
    methods: {
        isElementInViewport() {
            let rect = this.elementViewPort.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
}
export default {

    data: () => {
        return {}
    },
    mounted() {
    },
    methods: {
        readInfoPage(menuSite) {
            let currentRoute = this.$route.path.toLowerCase();

            for (const infoMenu of menuSite) {
                if (currentRoute === '/' + infoMenu.routePage.toLowerCase())
                    return infoMenu;
            }
        },
    }
}

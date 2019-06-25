import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from './views/HomePage'
import Timeline from './views/Timeline';
import sitePage from './views/sitePage';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
           component: HomePage,
           /* components: { default: HomePage, sitePage: sitePage},*/
        },
        {
            path: '/timeline',
            name: 'timeline',
            component: Timeline,
            /* components: { default: HomePage, sitePage: sitePage},*/
        },

        {
            path: '/:page',
            name: 'page',
            component: sitePage
        },/*{
            path: '/timeline',
            name: 'timeline',
            component: Timeline
        }, {
            path: '/videos',
            name: 'videos',
            component: Videos
        }, {
            path: '/page/:id',
            name: 'page',
            component: sitePage
        } */
    ]
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from './views/HomePage'
import Timeline from './views/Timeline';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        }, {
            path: '/timeline',
            name: 'timeline',
            component: Timeline
        }
    ]
})

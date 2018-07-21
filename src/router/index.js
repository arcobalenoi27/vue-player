import Vue from 'Vue'
import Router from 'vue-router'
import App from '@/App'
import SavingPage from '@/pages/SavingPage'
import VideoTest from '@/pages/VideoTest'

Vue.use(Router)

export default new Router ({
    routes: [
        {
            path: '/',
            name: 'App',
            component: App
        },
        {
            path: '/:query',
            name: 'resources',
            component: SavingPage
        },
        {
            path: '/demo/vueplayer',
            name: 'vueplayer',
            component: VideoTest
        }
    ]
})
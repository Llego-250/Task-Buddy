import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import CalendarView from '../views/CalendarView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/analytics',
        name: 'analytics',
        component: AnalyticsView
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: CalendarView
    },
    {
        path: '/reports',
        name: 'reports',
        component: ReportsView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

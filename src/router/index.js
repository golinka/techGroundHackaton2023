import {createWebHistory, createRouter} from 'vue-router'
import MainPage from '../views/MainPage.vue'
import AdminPage from '../views/AdminPage.vue'
import NotFound from '../views/NotFound.vue'
import EditEntity from "../views/EditEntity.vue";
import EntitiesList from "../views/EntitiesList.vue";
import AddNewEntity from "../views/AddNewEntity.vue";

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/admin',
        name: 'AdminPage',
        component: AdminPage,
        children:
            [
                {
                    path: '/admin/edit-entity/:id',
                    component: EditEntity, props: true
                },
                {
                    path: '/admin/all-entities',
                    component: EntitiesList
                },
                {
                    path: '/admin/add-entity',
                    component: AddNewEntity
                }
            ]
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

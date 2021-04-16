import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import HomePage from '../components/HomePage.vue'
import Home from '../components/Home.vue'
import Message from "../components/Message.vue"
import ArticleList from "../components/ArticleList.vue"
import TagList from "../components/TagList.vue"
import UserList from "../components/UserList.vue"
import TagAdd from "../components/TagAdd.vue"
import TagUpdate from "../components/TagUpdate.vue"
import Audit from "../components/Audit.vue"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        // component: () =>
        //     import ('../components/Login.vue')
        component: Login
    },
    {
        path: "/HomePage",
        name: "HomePage",
        component: HomePage,
        redirect: "/Home",
        children: [{
                path: "/Home",
                name: "Home",
                component: Home,
            },
            {
                path: "/TagList",
                name: "TagList",
                component: TagList,
            },
            {
                path: "/TagAdd",
                name: "TagAdd",
                component: TagAdd,
            },
            {
                path: "/TagUpdate",
                name: "TagUpdate",
                component: TagUpdate,
            },
             {
                path: "/ArticleList",
                name: "ArticleList",
                component: ArticleList,
            },
            {
                path: "/Audit/:id",
                name: "Audit",
                component: Audit,
            },
            {
                path: "/UserList",
                name: "UserList",
                component: UserList,
            },
            {
                path: "/Message",
                name: "Message",
                component: Message,
            },
        ]
    },
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("token");
    if (to.path === "/") {
        next();
    } else if (to.path === "/register") {
        next();
    } else if (to.path === "/forget") {
        next();
    } else if (!token) {
        next("/");
    } else {
        next();
    }
});
export default router
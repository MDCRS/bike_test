import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";
import axios from 'axios'
import App from '@/App'
import FrontNav from "@/views/front/Navigator"
import BackNav from '@/views/back/Navigator'
import Home from '@/views/front/Home/Home'
import Show from '@/views/front/Show/Show'
import Detail from '@/views/front/Detail/Detail'
import Login from '@/views/front/Login/Login'
import Register from '@/views/front/Register/Register'
import Index from '@/views/back/Home/Index'
import RePass from "@/views/front/Repass/RePass";
import CheckPhone from "@/views/front/Repass/checkPhone/CheckPhone";
import CheckUserName from "@/views/front/Repass/checkUserName/CheckUserName";
import Finish from "@/views/front/Repass/finish/Finish";
import Test from '@/views/Test';
import Success from '@/views/back/Success'
import Help from '@/views/front/Help/Help'
import Contact from "@/views/front/Contact/Contact";


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {

    return originalPush.call(this, location).catch(err => err)

}

const routes = [
    {
        path: '/',
        name: 'Index',
        redirect:'front/frontHome',
        component: App,
        children: [
            {
                path: 'front',
                name: 'FrontNav',
                component: FrontNav,
                children: [
                    {
                        path: 'frontHome',
                        name: 'FrontNavHome',
                        component: Home,
                    },
                    {
                        path: 'show',
                        name: 'FrontNavShow',
                        component: Show,
                    },
                    {
                        path: 'detail/:id',
                        name: 'FrontNavDetail',
                        component: Detail,
                    },
                    {
                        path: 'login',
                        name: 'FrontNavLogin',
                        component: Login,
                    },
                    {
                        path: 'reg',
                        name: 'FrontNavReg',
                        component: Register,
                    },
                    {
                        path: 'help',
                        name: 'FrontNavHelp',
                        component: Help,
                    },
                    {
                        path: 'contact',
                        name: 'FrontNavCont',
                        component: Contact,
                    },
                    {
                        path: 'repass',
                        name: 'FrontNavRepass',
                        component: RePass,
                        children: [
                            {
                                path: 'checkPhone',
                                name: 'FrontNavCp',
                                component: CheckPhone,
                            },
                            {
                                path: 'checkUser',
                                name: 'FrontNavCU',
                                component: CheckUserName,
                            },
                            {
                                path: 'finish',
                                name: 'FrontNavFin',
                                component: Finish,
                            },
                        ]
                    },
                ]
            },
            {
                path: 'back',
                name: 'BackNav',
                component: BackNav,
                children: [
                    {
                        path: 'backHome',
                        name: 'BackNavIndex',
                        component: Index,
                    },

                ]
            },
            {
                path: 'test',
                name: 'test',
                component: Test,
            },
        ],

    },
    {
        path: '/paySuccess',
        component: Success,
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.user.hasRoutes
    let token = sessionStorage.getItem("token")
    if (!to.path.includes('/back')) {
        next()
    } else if (!token) {
        next({name: 'FrontNavLogin'})
    } else if(token && !hasRoute) {
        axios.get('/sys/menu/nav', {
            headers: {Authorization: sessionStorage.getItem("token")}
        }).then(res => {
            //获取菜单
            store.commit('setMenuList', res.data.data.nav);
            console.log("res.data.data.menus",res.data.data.nav)
            if (res.data.data.nav===null){
                this.$message.success("请联系管理员为您分配角色！")
            }
            //获取权限
            store.commit('setPermList',res.data.data.authoritys)
            let newRouters = router.options.routes
            // console.log("newRouters:",newRouters)
            // console.log("newRouters[0].children[1]:",newRouters[0].children[1].children)
            res.data.data.nav.forEach(pMenu => {
                if (pMenu.children) {
                    //把menu转换为路由
                    pMenu.children.forEach(cMenu => {
                        let newRouter = menuToRouter(cMenu)
                        if (newRouter) {
                            newRouters[0].children[1].children.push(newRouter)
                        }
                    })
                }
            })
            console.log('router->newRouters',newRouters)
            router.addRoutes(newRouters)
            store.commit('changeRouteStatus',true)
        })
    }
    next()
})

function menuToRouter(cMenu) {
    if (!cMenu.component) {
        return null;
    }
    return {
        name: cMenu.name,
        path: cMenu.path,
        component: () => import('@/views/back/' + cMenu.component),
        meta: {
            icon: cMenu.icon,
            title: cMenu.title
        }
    };
}

export default router

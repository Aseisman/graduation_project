import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { dynamic } from '../utils/route-optimization';
import NestedRoute from './NestedRoute';
import Header from '../components/Header/index';
const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/login" component={dynamic(() => import('../pages/login/index'))} />
            <Route
                exact
                path="/register"
                component={dynamic(() => import('../pages/register/index'))}
            />
            <Route exact path="/write" component={dynamic(() => import('../pages/article-new/index'))} />
            <Route path="/">
                <Header>
                    <NestedRoute />
                </Header>
            </Route>
        </Switch>
    </HashRouter>
);

export default BasicRoute;

// import React from 'react';
// import { dynamic } from '../utils/route-optimization';
// import Home from '../pages/Home'
// import About from '../pages/About'
// import page2 from '../pages/Page2'
// const routes = [
//     {
//         path: '/',
//         component: Home,
//         children: [
//             {
//                 path: '/about',
//                 component: About,
//             }
//         ]
//     },
//     {
//         path: '/login',
//         component: dynamic(() => import('../pages/login/index'))
//     },
//     {
//         path: '/register',
//         component: dynamic(() => import('../pages/register/index'))
//     }
// ]
// export {routes}

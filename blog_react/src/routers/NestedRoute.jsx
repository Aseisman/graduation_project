import React from 'react';
import { Route } from 'react-router-dom';
import { dynamic } from '../utils/route-optimization';

const NestedRoute = () => (
        <>
            <Route exact path="/" component={dynamic(()=>import('../pages/home/index'))} />
            <Route exact path="/detail/*" component={dynamic(()=>import('../pages/article-detail/index'))} />
            <Route exact path="/leavingMessage" component={dynamic(()=>import('../pages/leaving-message/index'))} />
            <Route exact path="/personal" component={dynamic(()=>import('../pages/personal/index'))} />
        </>
);

export default NestedRoute;
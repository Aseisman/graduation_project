import React from 'react';
import Loading from "../components/Loading/index"
/**
 * 实现路由的分割
 * @param {*} loadComponent  ()=>import('./components/Home')
 */
export function dynamic(loadComponent){
    const LazyComponent = lazy(loadComponent);
    return ()=>(
        <React.Suspense fallback={<Loading/>}>
            <LazyComponent/>
        </React.Suspense>
    )
}

function lazy(loadComponent){
    return class extends React.Component{
        state = {Component:null}
        componentDidMount(){
            loadComponent().then(result=>{
                this.setState({Component:result.default});
            });
        }
        render(){
            const {Component} = this.state;
            return Component&&<Component/>;
        }
    }
}
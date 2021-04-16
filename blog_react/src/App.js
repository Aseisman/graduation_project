import BasicRoute from './routers/BasicRoute';
import { Provider } from 'react-redux';
import store from './store/index';

const App = () => {
    return (
        <Provider store={store}>
            <BasicRoute />
        </Provider>
    );
};

export default App;
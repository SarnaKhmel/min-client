import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './redux/reducers';
import Auth from './components/shared/Auth';
import routes from './components/routes';
import * as serviceWorker from "./serviceWorker";

let store = createStore(rootReducer);

ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Auth>
                    {routes}
                </Auth>
            </BrowserRouter> 
        </Provider> 
        , 
document.getElementById('root'));

serviceWorker.unregister();
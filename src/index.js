import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './reducers';
import Auth from './components/shared/Auth';
import routes from './components/routes';


let store = createStore(rootReducer);

ReactDOM.render(
        <BrowserRouter>
            <Auth>
                {routes}
            </Auth>
        </BrowserRouter>
        , 
document.getElementById('root'));

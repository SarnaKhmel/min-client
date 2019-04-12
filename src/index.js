import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './redux/reducers';
import Auth from './components/shared/Auth';
import routes from './components/routes';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


let store = createStore(rootReducer);

const theme = createMuiTheme({
    palette: {
      primary: { main: '#bbb999' }, // Purple and green play nicely together.
      secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
    },
    typography: { useNextVariants: true },
});

ReactDOM.render(
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <Auth>
                        {routes}
                    </Auth>
                </BrowserRouter>
            </MuiThemeProvider>    
        </Provider> 
        , 
document.getElementById('root'));

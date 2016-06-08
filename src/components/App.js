import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
import Theme from '../browser/theme';
import Dialog from '../containers/Dialog';
import Router from '../containers/Router';
import { staticRender } from '../utility/enhancer';

const muiTheme = getMuiTheme(Theme);

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <div className="filled-container">
            <Router />
            <Dialog />
        </div>
    </MuiThemeProvider>
);
export default staticRender(App);

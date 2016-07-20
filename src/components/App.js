import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React, { PropTypes } from 'react';
import Theme from '../browser/theme';
import Dialog from '../containers/Dialog';
import { pureRender } from '../utility/enhancer';

const muiTheme = getMuiTheme(Theme);

const App = (props) => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <div className="filled-container">
            {props.children}
            <Dialog />
        </div>
    </MuiThemeProvider>
);
App.propTypes = {
    children: PropTypes.node.isRequired,
};
export default pureRender(App);

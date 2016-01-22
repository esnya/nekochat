import { Styles } from 'material-ui';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Theme from '../theme';
import { Router } from './Router';

const RouterContainer = connect(state => ({ ...state.route }))(Router);

console.log(Theme)
export class App extends Component {
    static get childContextTypes() {
        return {
            muiTheme: PropTypes.object,
        };
    }

    getChildContext() {
        return {
            muiTheme: Styles.ThemeManager.getMuiTheme(Theme),
        };
    }

    render() {
        return <RouterContainer />;
    }
}
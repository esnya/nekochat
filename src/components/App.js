import { Styles } from 'material-ui';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Theme from '../browser/theme';
import { ConfirmContainer } from '../containers/ConfirmContainer';
import { SnackContainer } from '../containers/SnackContainer';
import { Router } from './Router';

const RouterContainer = connect((state) => ({ ...state.route }))(Router);

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
        return (
            <div className="filled-container">
                <RouterContainer />
                <ConfirmContainer />
                <SnackContainer />
            </div>
        );
    }
}
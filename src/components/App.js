import ThemeManager from 'material-ui/lib/styles/theme-manager';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Theme from '../browser/theme';
import { ConfirmContainer } from '../containers/ConfirmContainer';
import {
    MessageConfigDialogContainer,
} from '../containers/MessageConfigDialogContainer';
import { NotificationContainer } from '../containers/NotificationContainer';
import {
    RoomCreateDialoggContainer,
} from '../containers/RoomCreateDialogContainer';
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
            muiTheme: ThemeManager.getMuiTheme(Theme),
        };
    }

    render() {
        return (
            <div className="filled-container">
                <RouterContainer />
                <RoomCreateDialoggContainer />
                <MessageConfigDialogContainer />
                <ConfirmContainer />
                <NotificationContainer />
            </div>
        );
    }
}
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Theme from '../browser/theme';
import {ConfirmContainer} from '../containers/ConfirmContainer';
import {IconEditDialog} from '../containers/icon-edit-dialog';
import {
    MessageConfigDialogContainer,
} from '../containers/MessageConfigDialogContainer';
import { NotificationContainer } from '../containers/NotificationContainer';
import {
    RoomCreateDialoggContainer,
} from '../containers/RoomCreateDialogContainer';
import {
    RoomUpdateDialoggContainer,
} from '../containers/RoomUpdateDialogContainer';
import {
    RoomPasswordDialog,
} from '../containers/RoomPasswordDialogContainer';
import {NotesDialog} from '../containers/notes-dialog';
import {Router} from './Router';

const RouterContainer = connect((state) => ({ ...state.route }))(Router);
const muiTheme = getMuiTheme(Theme);

export class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="filled-container">
                    <RouterContainer />
                    <RoomCreateDialoggContainer />
                    <RoomUpdateDialoggContainer />
                    <RoomPasswordDialog />
                    <MessageConfigDialogContainer />
                    <ConfirmContainer />
                    <NotificationContainer />
                    <NotesDialog />
                    <IconEditDialog />
                </div>
            </MuiThemeProvider>
        );
    }
}

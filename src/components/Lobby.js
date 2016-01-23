import {
    AppBar,
    FlatButton,
    FontIcon,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
} from 'material-ui';
import React, { Component } from 'react';
import moment from '../browser/moment';

export const RoomList = (props) => {
    const {
        editable,
        user,
        rooms,
        onJoin,
        removeRoom,
        ...otherProps,
    } = props;

    return (
        <List {...otherProps}>
            {
                rooms.map((room) => (
                    <ListItem
                        key={room.id}
                        primaryText={room.title}
                        secondaryText={
                            `@${room.user_id} ${
                                moment(room.modified).fromNow()
                            }`
                        }
                        onTouchTap={() => onJoin(room.id)}
                        rightIconButton={
                            editable && room.user_id === user.id && (
                                <IconButton
                                    onTouchTap={() => removeRoom(room)}>
                                    <FontIcon className="material-icons">
                                        delete
                                    </FontIcon>
                                </IconButton>
                            )
                        } />
                ))
            }
        </List>
    );
};

export class Lobby extends Component {
    constructor(props) {
        super(props);

        setTimeout(() => {
            props.leave();
            props.fetch();
        });
    }

    onCreateRoom() {
        const title = this.refs.title.getValue();

        if (title) {
            this.props.createRoom({title});
            this.refs.title.clearValue();
        }
    }

    render() {
        const VK_RETURN = 13;
        const {
            history,
            rooms,
            user,
            onJoin,
            removeRoom,
        } = this.props;

        document.title = "Beniimo Online";
        return (
            <div>
                <AppBar title="Beniimo Online" showMenuIconButton={false} />
                <Paper style={{ display: 'flex', padding: '0 16px' }}>
                    <TextField
                        ref="title"
                        floatingLabelText="Create Chat Room"
                        fullWidth={true}
                        hintText="Input the title of new room"
                        onKeyDown={(e) => 
                            e.keyCode === VK_RETURN
                                && this.onCreateRoom()
                        }/>
                    <FlatButton
                        primary={true}
                        label="Create"
                        onTouchTap={() => this.onCreateRoom()} />
                </Paper>
                <RoomList
                    rooms={history}
                    subheader="Recentry Joined Rooms"
                    user={user}
                    onJoin={onJoin}
                    removeRoom={removeRoom} />
                <RoomList
                    editable={true}
                    rooms={rooms}
                    subheader="My Rooms"
                    user={user}
                    onJoin={onJoin}
                    removeRoom={removeRoom} />
            </div>
        );
    }
}
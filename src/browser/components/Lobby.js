import { AppBar, FlatButton, FontIcon, IconButton, List, ListItem, Paper, TextField } from 'material-ui';
import React, { Component } from 'react';

export const RoomList = (props) => {
    let {
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
                        secondaryText={`${room.user_id}  ${room.modified}`}
                        onTouchTap={() => onJoin(room.id)}
                        rightIconButton={room.user_id === user.id && <IconButton onTouchTap={() => confirm(`Remove ${room.title}?`) && removeRoom(room.id)}><FontIcon className="material-icons">delete</FontIcon></IconButton>} />
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
        let title = this.refs.title.getValue();

        if (title) {
            this.props.createRoom({title});
            this.refs.title.clearValue();
        }
    }

    render() {
        let {
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
                    <TextField ref="title" floatingLabelText="Create Chat Room" hintText="Input the title of new room" fullWidth={true} onKeyDown={(e) => (e.keyCode === KeyEvent.DOM_VK_RETURN && this.onCreateRoom())}/>
                    <FlatButton primary={true} label="Create" onTouchTap={() => this.onCreateRoom()} />
                </Paper>
                <RoomList user={user} rooms={history} subheader="Recentry Joined Rooms" onJoin={onJoin} removeRoom={removeRoom} />
                <RoomList user={user} rooms={rooms} subheader="My Rooms" onJoin={onJoin} removeRoom={removeRoom} />
            </div>
        );
    }
}
import {
    AppBar,
    FlatButton,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
} from 'material-ui';
import isMobile from 'is-mobile';
import React, { Component } from 'react';
import moment from '../browser/moment';

const IsMobile = isMobile();

const DialogFeatures = {
    width: 360,
    height: 640,
    resizabe: true,
    scrollbars: true,
};
const DialogFeatureString = Object.keys(DialogFeatures)
    .map((key) => ({key, value: DialogFeatures[key]}))
    .map((a) => `${a.key}=${a.value === true ? 'yes' : a.value}`);

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
                            <div>
                                <IconButton
                                    iconClassName="material-icons"
                                    onTouchTap={() => onJoin(room.id)}>
                                    open_in_browser
                                </IconButton>
                                {
                                    IsMobile
                                    ? null
                                    : (
                                        <IconButton
                                            iconClassName="material-icons"
                                            onTouchTap={ () => window.open(
                                                `/${room.id}`,
                                                room.id,
                                                DialogFeatureString
                                            )}>
                                            open_in_new
                                        </IconButton>
                                    )
                                }
                                <IconButton
                                    disabled={
                                        !editable || room.user_id !== user.id
                                    }
                                    iconClassName="material-icons"
                                    onTouchTap={() => removeRoom(room)}>
                                    delete
                                </IconButton>
                            </div>
                        } />
                ))
            }
        </List>
    );
};

export class Lobby extends Component {
    constructor(props) {
        super(props);
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

        document.title = "NekoChat";
        return (
            <div>
                <AppBar title="NekoChat" showMenuIconButton={false} />
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
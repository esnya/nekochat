import {
    AppBar,
    IconButton,
    List,
    ListItem,
} from 'material-ui';
import isMobile from 'is-mobile';
import React, { Component } from 'react';
import { Timestamp } from './Timestamp';

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
                            <span>
                                @{room.user_id}
                                &nbsp;
                                <Timestamp timestamp={room.modified} />
                            </span>
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

    render() {
        const {
            history,
            rooms,
            user,
            open,
            onJoin,
            removeRoom,
        } = this.props;

        document.title = "NekoChat";
        return (
            <div>
                <AppBar
                    title="NekoChat"
                    iconElementLeft = {
                        <a href="/">
                            <img src="/img/nekokoro48.png" />
                        </a>
                    }
                    iconElementRight={
                        <IconButton
                            iconClassName="material-icons"
                            onTouchTap={() => open('room-create')}>
                            add
                        </IconButton>
                    } />
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
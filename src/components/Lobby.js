import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import isMobile from 'is-mobile';
import { zip } from 'lodash';
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

export class RoomListItem extends Component {
    shouldComponentUpdate(nextProps) {
        const {
            modified,
        } = this.props;

        return modified !== nextProps.modified;
    }
}

export class RoomList extends Component {
    shouldComponentUpdate(nextProps) {
        const {
            rooms,
        } = this.props;

        /* eslint no-console: 1 */
        console.log();

        return rooms.length !== nextProps.rooms.length ||
            zip(rooms, nextProps.rooms).some(([room, next]) =>
                !room && next ||
                    room.modified !== next.modified
            );
    }

    render() {
        const {
            user,
            rooms,
            onJoin,
            removeRoom,
            ...otherProps,
        } = this.props;

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
                                        tooltip="Join"
                                        onTouchTap={() => onJoin(room.id)}>
                                        open_in_browser
                                    </IconButton>
                                    {
                                        IsMobile
                                        ? null
                                        : (
                                            <IconButton
                                                iconClassName="material-icons"
                                                tooltip="New window"
                                                onTouchTap={ () =>
                                                    window.open(
                                                        `/${room.id}`,
                                                        room.id,
                                                        DialogFeatureString
                                                    )
                                                }
                                            >
                                                open_in_new
                                            </IconButton>
                                        )
                                    }
                                    <IconButton
                                        disabled={
                                            room.user_id !== user.id
                                        }
                                        iconClassName="material-icons"
                                        tooltip="Delete"
                                        onTouchTap={() => removeRoom(room)}>
                                        delete
                                    </IconButton>
                                </div>
                            } />
                    ))
                }
            </List>
        );
    }
}

export class Lobby extends Component {
    render() {
        const {
            roomList,
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
                    rooms={roomList}
                    user={user}
                    onJoin={onJoin}
                    removeRoom={removeRoom} />
            </div>
        );
    }
}
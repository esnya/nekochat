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
            room,
        } = this.props;

        return room.modified !== nextProps.room.modified;
    }

    render() {
        const {
            room,
            user,
            setRoute,
            removeRoom,
        } = this.props;

        const path = `/${room.id}`;

        return (
            <ListItem
                key={room.id}
                href={path}
                primaryText={room.title}
                secondaryText={
                    <span>
                        @{room.user_id}
                        &nbsp;
                        <Timestamp timestamp={room.modified} />
                    </span>
                }
                onTouchTap={(e) => setRoute(path, e)}
                rightIconButton={
                    <div style={{
                        display: 'flex',
                    }}>
                        <IconButton
                            href={path}
                            iconClassName="material-icons"
                            tooltip="Join"
                            onTouchTap={(e) => setRoute(path, e)}>
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
                                            path,
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
                            disabled={room.user_id !== user.id}
                            iconClassName="material-icons"
                            tooltip="Delete"
                            onTouchTap={() => removeRoom(room)}>
                            delete
                        </IconButton>
                    </div>
                }
            />
        );
    }
}

export class RoomList extends Component {
    shouldComponentUpdate(nextProps) {
        const {
            rooms,
            onJoin,
        } = this.props;

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
            removeRoom,
            setRoute,
            ...otherProps,
        } = this.props;

        return (
            <List {...otherProps}>
                {
                    rooms.map((room) =>
                        <RoomListItem
                            key={room.id}
                            room={room}
                            user={user}
                            removeRoom={removeRoom}
                            setRoute={setRoute}
                        />
                    )
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
            removeRoom,
            setRoute,
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
                    removeRoom={removeRoom}
                    setRoute={setRoute} />
            </div>
        );
    }
}
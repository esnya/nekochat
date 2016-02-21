import List from 'material-ui/lib/lists/list';
import { zip } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { RoomListItem } from './RoomListItem';

export class RoomList extends Component {
    static get propTypes() {
        return {
            rooms: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
            })).isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            removeRoom: PropTypes.func.isRequired,
            setRoute: PropTypes.func.isRequired,
        };
    }

    shouldComponentUpdate(nextProps) {
        const {
            rooms,
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
                            removeRoom={removeRoom}
                            room={room}
                            setRoute={setRoute}
                            user={user}
                        />
                    )
                }
            </List>
        );
    }
}
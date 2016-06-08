import IPropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import RoomListItem from './RoomListItem';
import { pureRender } from '../utility/enhancer';

const RoomList = (props) => {
    const {
        rooms,
        user,
        onRemoveRoom,
        onRoute,
    } = props;

    return (
        <ul>
            {
                rooms.map((room) =>
                    <RoomListItem
                        key={room.get('id')}
                        room={room}
                        user={user}
                        onRemoveRoom={onRemoveRoom}
                        onRoute={onRoute}
                    />
                )
            }
        </ul>
    );
};
RoomList.propTypes = {
    rooms: IPropTypes.listOf(IPropTypes.contains({
        id: PropTypes.string.isRequired,
    })).isRequired,
    user: IPropTypes.contains().isRequired,
    onRemoveRoom: PropTypes.func.isRequired,
    onRoute: PropTypes.func.isRequired,
};
export default pureRender(RoomList);

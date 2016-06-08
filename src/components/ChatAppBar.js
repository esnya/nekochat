import AppBar from 'material-ui/AppBar';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import User from '../browser/user';
import RoomEditButton from '../containers/RoomEditButton';
import { pureRender } from '../utility/enhancer';

const ChatAppBar = (props) => {
    const {
        room,
        onEditRoom,
        onOpenDrawer,
    } = props;

    const iconElementRight =
        User.id === room.get('user_id') ? <RoomEditButton /> : null;

    return (
        <AppBar
            iconElementRight={iconElementRight}
            title={room.get('title') || 'Nekochat'}
            onLeftIconButtonTouchTap={onOpenDrawer}
            onRightIconButtonTouchTap={onEditRoom}
        />
    );
};
ChatAppBar.propTypes = {
    room: IPropTypes.contains({
        title: PropTypes.string,
    }).isRequired,
    onEditRoom: PropTypes.func.isRequired,
    onOpenDrawer: PropTypes.func.isRequired,
};

export default pureRender(ChatAppBar);

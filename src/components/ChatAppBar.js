import AppBar from 'material-ui/AppBar';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import User from '../browser/user';
import RoomEditButton from '../containers/RoomEditButton';
import { pureRender } from '../utility/enhancer';
import FeedbackButton from './FeedbackButton';

const ChatAppBar = (props) => {
    const {
        room,
        onOpenDrawer,
    } = props;

    const iconElementRight =
        User.id === room.get('user_id') ? <RoomEditButton /> : null;

    return (
        <AppBar
            iconElementRight={
                <div>
                    {iconElementRight}
                    <FeedbackButton color="white" />
                </div>
            }
            title={room.get('title') || 'Nekochat'}
            onLeftIconButtonTouchTap={onOpenDrawer}
        />
    );
};
ChatAppBar.propTypes = {
    room: IPropTypes.contains({
        title: PropTypes.string,
    }).isRequired,
    onOpenDrawer: PropTypes.func.isRequired,
};

export default pureRender(ChatAppBar);

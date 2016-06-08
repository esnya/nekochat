import Lock from 'material-ui/svg-icons/action/lock';
import Block from 'material-ui/svg-icons/content/block';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';

const RoomStatusIcons = (props) => {
    const {
        room,
    } = props;

    const passwordIconElement = room.get('password') ? <Lock /> : null;
    const closeIconElement = room.get('state') === 'close' ? <Block /> : null;

    const width = [passwordIconElement, closeIconElement]
        .filter((e) => e)
        .length * 24;

    return (
        <div style={{ width }}>
            {passwordIconElement}
            {closeIconElement}
        </div>
    );
};
RoomStatusIcons.propTypes = {
    room: IPropTypes.contains({
        password: PropTypes.bool.isRequired,
        state: PropTypes.string.isRequired,
    }),
};
export default pureRender(RoomStatusIcons);

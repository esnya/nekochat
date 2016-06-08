import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui/svg-icons/action/settings';
import React, { PropTypes } from 'react';
import { staticRender } from '../utility/enhancer';

const RoomEditButton = (props) => {
    const {
        onEditRoom,
    } = props;

    return (
        <IconButton onTouchTap={onEditRoom}>
            <Settings color="white" />
        </IconButton>
    );
};
RoomEditButton.propTypes = {
    onEditRoom: PropTypes.func.isRequired,
};
export default staticRender(RoomEditButton);

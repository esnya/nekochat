import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add-circle-outline';
import React, { PropTypes } from 'react';
import { staticRender } from '../utility/enhancer';

const RoomCreateButton = (props) => {
    const {
        onCreateRoom,
    } = props;

    return (
        <IconButton onTouchTap={onCreateRoom}>
            <Add color="white" />
        </IconButton>
    );
};
RoomCreateButton.propTypes = {
    onCreateRoom: PropTypes.func.isReqruied,
};

export default staticRender(RoomCreateButton);

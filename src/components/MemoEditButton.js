import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import React, { PropTypes } from 'react';
import { staticRender } from '../utility/enhancer';

const MemoEditButton = (props) => {
    const {
        onEditMemo,
    } = props;

    return (
        <IconButton onTouchTap={onEditMemo}>
            <ModeEdit />
        </IconButton>
    );
};
MemoEditButton.propTypes = {
    onEditMemo: PropTypes.func.isRequired,
};
export default staticRender(MemoEditButton);

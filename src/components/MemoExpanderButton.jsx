import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import IconButton from 'material-ui/IconButton';
import React, { PropTypes } from 'react';
import { pureRender } from '../utility/enhancer';

const MemoExpanderButton = (props) => {
    const {
        expanded,
        onChange,
    } = props;

    const Icon = expanded ? ArrowUp : ArrowDown;

    return (
        <IconButton onTouchTap={(e) => onChange(e, !expanded)}>
            <Icon />
        </IconButton>
    );
};
MemoExpanderButton.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};
export default pureRender(MemoExpanderButton);

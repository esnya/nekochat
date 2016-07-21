import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import IconButton from 'material-ui/IconButton';
import Info from 'material-ui/svg-icons/action/info-outline';
import { grey300 } from 'material-ui/styles/colors';

const Style = {
    Container: {
        backgroundColor: grey300,
    },
    IconButton: {
        width: 'auto',
        height: 'auto',
        padding: 0,
        verticalAlign: 'top',
    },
    Icon: {
        width: 16,
        height: 16,
    },
};

const diceToTooltip = (dice) =>
    dice
        .map((result) => {
            const faces = result.get('faces');
            const results = result.get('results');
            return `${results.size}d${faces}=[${results.join(',')}]`;
        })
        .join(' ');

const Fluorite5Node = (props) => {
    const {
        node,
    } = props;

    const dice = node.get('dice');
    const infoButton = dice && dice.size > 0 ? (
        <IconButton
            iconStyle={Style.Icon}
            style={Style.IconButton}
            tooltip={diceToTooltip(dice)}
            tooltipPosition="top-center"
        >
            <Info />
        </IconButton>
    ) : null;

    return (
        <span style={Style.Container}>
            {node.get('text')}
            {infoButton}
        </span>
        );
};
Fluorite5Node.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
    }),
};
export default Fluorite5Node;

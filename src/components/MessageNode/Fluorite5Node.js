import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import IconButton from 'material-ui/IconButton';
import Info from 'material-ui/svg-icons/action/info-outline';
import { grey300, grey800 } from 'material-ui/styles/colors';
import Dice6 from '../icons/Dice6';

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
    DiceResults: {
        marginRight: '8',
    },
    DiceTooltip: {
        display: 'flex',
        backgroundColor: 'white',
        color: 'black',
    },
    Tooltip: {
        padding: 0,
    },
};

const DiceResult = (props) => {
    const {
        faces,
        result,
    } = props;

    if (faces === 6) {
        return <Dice6 color={grey800} n={result} />;
    }

    return null;
};
DiceResult.propTypes = {
    faces: PropTypes.number.isRequired,
    result: PropTypes.number.isRequired,
};

const DiceResults = (props) => {
    const {
        faces,
        results,
    } = props;

    if (faces === 6) {
        return (
            <div style={Style.DiceResults}>
                {results.map((result, i) => <DiceResult key={i} faces={faces} result={result} />)}
            </div>
        );
    }

    return (
        <div style={Style.DiceResults}>
            {`${results.size}d${faces}=[${results.join(',')}]`}
        </div>
    );
};
DiceResults.propTypes = {
    faces: PropTypes.number.isRequired,
    results: IPropTypes.listOf(PropTypes.number).isRequired,
};

const DiceTooltip = (props) => {
    const {
        dice,
    } = props;

    return (
        <div style={Style.DiceTooltip}>
            {dice.map((result, i) => {
                const faces = result.get('faces');
                const results = result.get('results');
                return <DiceResults key={i} faces={faces} results={results} />;
            })}
        </div>
    );
};
DiceTooltip.propTypes = {
    dice: IPropTypes.list,
};

const Fluorite5Node = (props) => {
    const {
        node,
    } = props;

    const dice = node.get('dice');
    const infoButton = dice && dice.size > 0 ? (
        <IconButton
            iconStyle={Style.Icon}
            style={Style.IconButton}
            tooltip={<DiceTooltip dice={dice} />}
            tooltipPosition="top-center"
            tooltipStyles={Style.Tooltip}
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

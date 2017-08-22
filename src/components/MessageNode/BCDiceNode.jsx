import { blueGrey100 } from 'material-ui/styles/colors';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';

const Style = {
    backgroundColor: blueGrey100,
    padding: 5,
};

const BCDiceNode = (props) => {
    const {
        node,
    } = props;

    return <span style={Style}>{node.get('text')}</span>;
};
BCDiceNode.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
    }),
};
export default BCDiceNode;

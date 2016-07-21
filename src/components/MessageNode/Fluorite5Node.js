import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { grey300 } from 'material-ui/styles/colors';

const Style = {
    backgroundColor: grey300,
};

const Fluorite5Node = (props) => {
    const {
        node,
    } = props;

    return <span style={Style}>{node.get('text')}</span>;
};
Fluorite5Node.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
    }),
};
export default Fluorite5Node;

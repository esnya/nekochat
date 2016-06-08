import grey500 from 'material-ui/styles/colors';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';

const Style = {
    color: grey500,
    fontSize: 'x-small',
};

const MemoNode = (props) => {
    const {
        node,
    } = props;

    return <span style={Style}>{node.get('text')}</span>;
};
MemoNode.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
    }),
};
export default MemoNode;

import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import MemoNode from './MemoNode';

const NodeTypes = {
    memo: MemoNode,
};

const MessageNode = (props) => {
    const {
        node,
    } = props;

    const type = node.get('type');

    if (type && (type in NodeTypes)) {
        const Node = NodeTypes[type];

        return <Node node={node} />;
    }

    return <span>{node.get('text')}</span>;
};
MessageNode.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }),
};
export default MessageNode;

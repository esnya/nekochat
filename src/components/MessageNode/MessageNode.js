import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import * as NodeType from '../../constants/NodeType';
import MemoNode from './MemoNode';
import Fluorite5Node from './Fluorite5Node';

const Components = {
    [NodeType.MEMO]: MemoNode,
    [NodeType.FLUORITE5]: Fluorite5Node,
    [NodeType.FLUORITE5_ERROR]: Fluorite5Node,
};

const MessageNode = (props) => {
    const {
        node,
    } = props;

    const type = node.get('type');

    if (type && (type in Components)) {
        const Node = Components[type];

        return <Node node={node} />;
    }

    const text = node.get('text');

    if (!text) return <span>&nbsp;</span>;

    return <span>{text}</span>;
};
MessageNode.propTypes = {
    node: IPropTypes.contains({
        text: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }),
};
export default MessageNode;

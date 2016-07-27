import React from 'react';
import IPropTypes from 'react-immutable-proptypes';
import MessageNode from './MessageNode';

const MessageLine = (props) => {
    const {
        line,
    } = props;

    if (line.isEmpty()) {
        return <p style={{ margin: 0 }}>&nbsp;</p>;
    }

    return (
        <p style={{ margin: 0 }}>
            {
                line.map(
                    (node, i) => <MessageNode key={i} node={node} />
                )
            }
        </p>
    );
};
MessageLine.propTypes = {
    line: IPropTypes.list.isRequired,
};
export default MessageLine;

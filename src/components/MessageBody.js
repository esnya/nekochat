import { List, Map } from 'immutable';
import React from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';
import MessageLine from './MessageLine';

const getLines = (message) => {
    const lines = message.get('message');

    if (typeof(lines) !== 'string') {
        return lines;
    }

    return new List(
        lines.split(/\r\n|\n/)
            .map((line) => new List([new Map({ type: 'TEXT', text: line })]))
    );
};

const MessageBody = (props) => {
    const {
        message,
    } = props;

    const lines = getLines(message);

    return (
        <div>
            {
                lines.map(
                    (line, i) => <MessageLine key={i} line={line} />
                )
            }
        </div>
    );
};
MessageBody.propTypes = {
    message: IPropTypes.contains({
        message: IPropTypes.list.isRequired,
    }).isRequired,
};

export default pureRender(MessageBody);

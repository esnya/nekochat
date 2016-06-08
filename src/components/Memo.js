import Paper from 'material-ui/Paper';
import React, { PropTypes } from 'react';
import { pureRender, singleState } from '../utility/enhancer';
import MemoEditButton from '../containers/MemoEditButton';
import MemoExpanderButton from './MemoExpanderButton';

const Style = {
    Container: {
        display: 'flex',
        alignItems: 'center',
    },
    Memo: {
        flex: '1 1 auto',
    },
    MemoExpaneed: {
        overflow: 'auto',
    },
    MemoCollapsed: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        overflowX: 'auto',
    },
    LineExpanded: {},
    LineCollapsed: {
        marginRight: '0.5em',
    },
};

const Memo = (props) => {
    const {
        memo,
        expanded,
        onChange,
    } = props;

    const memoStyle = {
        ...Style.Memo,
        ...(expanded ? Style.MemoExpaneed : Style.MemoCollapsed),
    };

    const lineStyle = expanded ? Style.LineExpanded : Style.LineCollapsed;

    return (
        <Paper style={Style.Container}>
            <MemoExpanderButton expanded={expanded} onChange={onChange} />
            <div style={memoStyle}>
                {
                    memo && memo.split(/\r\n|\n/).map(
                        (line, i) => <p key={i} style={lineStyle}>{line}</p>
                    )
                }
            </div>
            <MemoEditButton />
        </Paper>
    );
};
Memo.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    memo: PropTypes.string,
};
export default singleState(
    pureRender(Memo),
    'expanded',
    { initialValue: false }
);

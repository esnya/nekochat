import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import React, {Component, PropTypes} from 'react';

export class Notes extends Component {
    static get propTypes() {
        return {
            notes: PropTypes.string,
            onEdit: PropTypes.func,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    render() {
        const {
            notes,
            onEdit,
        } = this.props;
        const {
            open,
        } = this.state;

        const Style = {
            alignItems: 'center',
            display: 'flex',
            verticalAlign: 'center',
            height: '100%',
        };

        const notesElement = open && notes
            ? notes.split(/\r\n|\n/).map((line, i) => <p key={i}>{line}</p>)
            : notes;

        const expandElement = (
            <IconButton
                iconClassName="material-icons"
                onTouchTap={() => this.setState({open: !open})}
            >
                {`expand_${open ? 'less' : 'more'}`}
            </IconButton>
        );

        const nodesStyle = open ? {
            flex: '1 1 auto',
            overflow: 'auto',
            height: '100%',
        } : {
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            flex: '1 1 auto',
        };

        return (
            <Paper
                style={Style}
            >
                {expandElement}
                <div style={nodesStyle}>{notesElement}</div>
                <IconButton iconClassName="material-icons" onTouchTap={onEdit}>
                    mode_edit
                </IconButton>
            </Paper>
        );
    }
}

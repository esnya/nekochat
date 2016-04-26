import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import React, {Component, PropTypes} from 'react';
import {IconListItem} from './icon-list-item';

export class IconEditDialog extends Component {
    static get propTypes() {
        return {
            iconList: PropTypes.array.isRequired,
            open: PropTypes.bool,
            onClose: PropTypes.func,
            onRemove: PropTypes.func,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            selections: {},
        };
    }

    render() {
        const {
            iconList,
            open,
            onRemove,
            onClose,
        } = this.props;
        const {
            selections,
        } = this.state;

        const actions = [
            <FlatButton
                primary
                key="close"
                label="Close"
                onTouchTap={onClose}
            />,
        ];

        const iconListItemElements = iconList.map(
            (icon) => (
                <IconListItem
                    {...icon}
                    key={icon.id}
                    selected={selections[icon.id]}
                    onRemove={() => onRemove(icon)}
                    onSelect={
                        (e, v) => this.setState({
                            selections: {
                                ...selections,
                                [icon.id]: v,
                            },
                        })
                    }
                />
            )
        );

        return (
            <Dialog
                autoScrollBodyContent
                actions={actions}
                open={open}
                title="Icons"
                onRequestClose={onClose}
            >
                <ul>{iconListItemElements}</ul>
            </Dialog>
        );
    }
}

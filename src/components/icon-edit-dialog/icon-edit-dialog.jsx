import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import React, { Component, PropTypes } from 'react';
import { IconListItem } from './icon-list-item';

export class IconEditDialog extends Component {
    static get propTypes() {
        return {
            iconList: PropTypes.array.isRequired,
            open: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            onRemove: PropTypes.func.isRequired,
            onRemoveSelected: PropTypes.func.isRequired,
            onUploadIcon: PropTypes.func.isRequired,
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
            onClose,
            onRemove,
            onRemoveSelected,
            onUploadIcon,
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
                    selected={Boolean(selections[icon.id])}
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

        const style = {
            body: {
                display: 'flex',
                flexDirection: 'column',
            },
            list: {
                flex: '1 1 auto',
                overflowY: 'scroll',
                WebkitOverflowScrolling: 'touch',
            },
        };

        return (
            <Dialog
                actions={actions}
                bodyStyle={style.body}
                open={open}
                title="Icons"
                onRequestClose={onClose}
            >
                <div>
                    <input
                        multiple
                        ref={(c) => (this.upload = c)}
                        style={{ display: 'none' }}
                        type="file"
                        onChange={onUploadIcon}
                    />
                    <IconButton
                        iconClassName="material-icons"
                        onTouchTap={() => this.upload.click()}
                    >
                        file_upload
                    </IconButton>
                    <IconButton
                        disabled={!_(selections).values().some()}
                        iconClassName="material-icons"
                        onTouchTap={
                            (e) => onRemoveSelected(
                                e,
                                iconList.filter(({ id }) => selections[id])
                            )
                        }
                    >
                        delete
                    </IconButton>
                </div>
                <div style={style.list}>
                    <ul>{iconListItemElements}</ul>
                </div>
            </Dialog>
        );
    }
}

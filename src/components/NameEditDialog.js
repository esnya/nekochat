import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import React, {  PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';
import IconGrid from '../containers/IconGrid';
import FileUploadButton from './FileUploadButton';

const Style = {
    Flex: {
        alignItems: 'flex-end',
        display: 'flex',
    },
    IconHeaderText: {
        lineHeight: '24px',
        padding: '12px 0',
    },
};

const NameEditDialog = (props) => {
    const {
        character,
        name,
        open,
        onClose,
        onUpdateName,
        onUploadIcons,
    } = props;

    const actions = [
        <FlatButton
            primary
            key="close"
            label="Close"
            onTouchTap={onClose}
        />,
    ];

    const handleChange =
        (key) => (e, value) => onUpdateName(e, name.set(key, value || null));
    const characterName = character && character.get('name');

    return (
        <Dialog
            autoScrollBodyContent
            actions={actions}
            open={open}
            title="Name Config"
            onRequestClose={onClose}
        >
            <TextField
                fullWidth
                isRequired
                floatingLabelText="Name"
                name="name"
                value={name && name.get('name')}
                onChange={handleChange('name')}
            />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField
                    fullWidth
                    floatingLabelText="Character Sheet URL"
                    name="character_url"
                    style={{ flex: '1 1 auto', marginRight: 16 }}
                    type="url"
                    value={name && name.get('character_url')}
                    onChange={handleChange('character_url')}
                />
                <IconButton
                    disabled={!character}
                    onTouchTap={
                        (e) =>
                            character && handleChange('name')(e, characterName)
                    }
                >
                    <ArrowUp />
                </IconButton>
            </div>
            <div style={Style.Flex}>
                <h1 style={Style.IconHeaderText}>
                    Icon
                </h1>
                <FileUploadButton
                    multiple
                    accept="image/*"
                    name="icon-upload"
                    onChange={(e, files) => onUploadIcons(e, files)}
                />
                <TextField
                    floatingLabelText="filter"
                    name="icon_filter"
                    value={name && name.get('icon_filter')}
                    onChange={handleChange('icon_filter')}
                />
            </div>
            <IconGrid name_id={name && name.get('id')} />
        </Dialog>
    );
};
NameEditDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    onUploadIcons: PropTypes.func.isRequired,
    character: IPropTypes.contains({
        name: PropTypes.string,
    }),
    name: IPropTypes.contains({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        icon_id: PropTypes.string,
    }),
};
export default pureRender(NameEditDialog);

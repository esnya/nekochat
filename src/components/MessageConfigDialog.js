import map from 'array-map';
import {
    Dialog,
    FlatButton,
    IconButton,
    TextField,
} from 'material-ui';
import { Colors } from 'material-ui/lib/styles';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { generateId } from '../utility/id';
import { getCharacter } from '../browser/character';
import { makeColor } from '../utility/color';
import { MessageIcon } from './MessageIcon';

let lastId = null;
const genId = () => (lastId = generateId());

export class MessageConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteMode: false,
        };
    }

    componentDidMount() {
        this.props.fetchIcon();        
    }
    componentWillUpdate(nextProps) {
        if (!nextProps.open && this.state.deletedMode) {
            this.setState({deleteMode: false});
        }
    }
    

    fetchCharacter() {
        const url = this.refs.character_url.getValue();

        if (url) {
            getCharacter(url)
                .then((data) => {
                    this.refs.name.setValue(data.name);
                })
                .catch(() => this.props.createSnack({
                    message: `Failed to load character at "${url}"`,
                }));
        }
    }

    onUpdate(e) {
        e.preventDefault();

        const form = findDOMNode(this.refs.form);
        const selected = (
                form.icon_id.length
                ? map(form.icon_id, (a) => a)
                : [form.icon_id]
            )
            .find((radio) => radio.checked);
        const icon_id = selected && selected.value || null;

        this.props.onUpdate({
            id: this.props.id,
            name: this.refs.name.getValue(),
            character_url: this.refs.character_url.getValue(),
            icon_id,
        });
    }

    onIconUpload() {
        findDOMNode(this.refs.icon_data).click();
    }
    onIconFileChange(e) {
        const icon_data = e.target;

        if (icon_data.files.length === 0) return;
        
        map(icon_data.files, (a) => a).forEach((file) => {
            this.props.createIcon({
                name: file.name,
                mime: file.type,
                file,
            });
        }, this);
        
        icon_data.value = '';
    }

    render() {
        const {
            name,
            character_data,
            character_url,
            icon_id,
            iconList,
            open,
            user,
            hide,
            removeIcon,
            onCancel,
            ...otherProps,
        } = this.props;
        const {
            deleteMode,
        } = this.state;

        const Actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={onCancel} />,
            <FlatButton
                label="Update"
                primary={true}
                onTouchTap={(e) => this.onUpdate(e)} />,
        ];
        const color = makeColor(`${name}${user.id}`);

        const Styles = {
            Form: {
                display: 'flex',
                flexDirection: 'column',
            },
            TextField: {
                flex: '0 0 72px',
            },
            IconHeader: {
                display: 'flex',
            },
            IconRadioGroup: {
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                overflowY: 'auto',
            },
            IconRadioItem: {
                flex: '0 0 76px',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                overflow: 'hidden',
            },
            IconRadioText: {
                display: 'flex',
                width: '100%',
                alignItems: 'center',
            },
            IconRadioTextLabel: {
                whiteSpace: 'nowrap',
            },
            IconDeleteIcon: {
                width: 'auto', height: 'auto',
                padding: 0,
            },
            Upload: {
                flex: '0 0 76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            UploadIcon: {
                flex: '0 0 60px',
            },
            Flex: {
                flex: '1 1 0',
            },
        };

        return (
            <Dialog {...otherProps}
                autoScrollBodyContent={true}
                open={open && !hide}
                actions={Actions}
                title="Name and Icon" >
                <form
                    ref="form"
                    style={Styles.Form}
                    onUpdate={(e) => this.onUpdate(e)}>
                    <div>
                        <TextField
                            ref="name"
                            fullWidth={true}
                            floatingLabelText="Name"
                            style={Styles.TextField}
                            defaultValue={name} />
                    </div>
                    <div>
                        <TextField ref="character_url"
                            fullWidth={true}
                            floatingLabelText="Character Sheet URL"
                            defaultValue={character_url}
                            style={Styles.TextField}
                            onBlur={() => this.fetchCharacter()} />
                    </div>
                    <div style={Styles.IconHeader} >
                        <div>Icon</div>
                        <IconButton
                            iconClassName="material-icons"
                            iconStyle={{
                                color: deleteMode ? Colors.red700 : null,
                            }}
                            style={Styles.IconDeleteIcon}
                            onTouchTap={() => this.setState({
                                deleteMode: !deleteMode,
                            })}>
                            delete
                        </IconButton>
                    </div>
                    <div style={Styles.IconRadioGroup}>
                        <div style={Styles.Upload}>
                            <IconButton
                                iconClassName="material-icons"
                                style={Styles.UploadIcon}
                                onTouchTap={() => this.onIconUpload()}>
                                file_upload
                            </IconButton>
                            <div>Upload</div>
                            <input
                                ref="icon_data"
                                multiple={true}
                                style={{display: 'none'}}
                                type="file"
                                onChange={(e) => this.onIconFileChange(e)} />
                        </div>
                        <div style={Styles.IconRadioItem}>
                            <div style={Styles.IconRadioText}>
                                <input
                                    id={genId()}
                                    name="icon_id"
                                    type="radio"
                                    value=""
                                    defaultChecked={!icon_id} />
                                <label
                                    htmlFor={lastId}
                                    style={Styles.IconRadioTextLabel}>
                                    Default
                                </label>
                            </div>
                            <label htmlFor={lastId}>
                                <MessageIcon
                                    character_data={character_data}
                                    character_url={character_url}
                                    color={color}
                                    name={name}
                                    noShadow={true} />
                            </label>
                        </div>
                        {iconList.map((icon) => (
                            <div key={icon.id} style={Styles.IconRadioItem}>
                                <div style={Styles.IconRadioText}>
                                    {
                                        deleteMode
                                        ? <IconButton
                                            id={genId()}
                                            iconClassName="material-icons"
                                            iconStyle={{color: Colors.red700}}
                                            style={Styles.IconDeleteIcon}
                                            onTouchTap={() => removeIcon(icon)}>
                                            delete
                                        </IconButton>
                                        : <input 
                                            id={genId()}
                                            name="icon_id"
                                            type="radio"
                                            value={icon.id} 
                                            defaultChecked={
                                                icon.id === icon_id
                                            } />
                                    }
                                    <label
                                        htmlFor={lastId}
                                        style={Styles.IconRadioTextLabel}>
                                        {icon.name}
                                    </label>
                                </div>
                                <label htmlFor={lastId} >
                                    <MessageIcon {...icon} />
                                </label>
                            </div>
                        ))}
                    </div>
                </form>
            </Dialog>
        );
    }
}
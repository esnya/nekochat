import { Dialog, FlatButton, FontIcon, IconButton, Popover, TextField } from 'material-ui';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { makeColor } from '../color';
import { getCharacter } from '../character';
import { MessageIcon } from './MessageIcon';

let _id = 0;
const lastId = () => `MessageFormGeneratedId-${_id}`;
const genId = () => {
    _id++;
    return lastId();
};

export class ConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pop: null,
        };
    }
    
    componentDidMount() {
        this.props.fetchIcon();        
    }
    
    fetchCharacter() {
        let url = this.refs.character_url.getValue();
        if (url) {
            getCharacter(url)
                .then(data => {
                    this.refs.name.setValue(data.name);
                })
                .catch(error => console.error(error));
        }
    }

    onUpdate(e) {
        e.preventDefault();
        
        let form = findDOMNode(this.refs.form);
        let selected = (form.icon_id.length ? Array.map(form.icon_id, a => a) : [form.icon_id])
            .find(radio => radio.checked);
        let icon_id = selected && selected.value || null;

        this.props.onUpdate({
            id: this.props.id,
            name: this.refs.name.getValue(),
            character_url: this.refs.character_url.getValue(),
            icon_id,
        });
    }

    onIconUpload() {
        let icon_data = findDOMNode(this.refs.icon_data);
        icon_data.click();
    }
    onIconFileChange(e) {
        let icon_data = e.target;
        if (icon_data.files.length == 0) return;
        
        Array.map(icon_data.files, a => a).forEach(file => {
            this.props.createIcon({
                name: file.name,
                mime: file.type,
                file,
            });
        }, this);
        
        icon_data.value = '';
    }
    
    showIconPop(target, icon) {
        this.setState({
            pop: {
                target,
                icon,
            },
        });
    }
    hideIconPop() {
        this.setState({
            pop: null,
        });
    }    

    render() {
        let {
            name,
            character_data,
            character_url,
            icon_id,
            iconList,
            open,
            user,
            removeIcon,
            onCancel,
            ...otherProps,
        } = this.props;
        let {
            pop,
        } = this.state;
        
        const Actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={onCancel} />,
            <FlatButton
                label="Update"
                primary={true}
                onTouchTap={e => this.onUpdate(e)} />,
        ];

        let color = makeColor(`${name}${user.id}`);

        const Styles = {
            Form: {
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 357,
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
            Upload: {
                flex: '0 0 76px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            UploadIcon: {
                flex: '0 0 60px',
            },
            Popover: {
            },
            PopoverContents: {
                display: 'flex',
                alignItems: 'center',
            },
        };

        return (
            <Dialog {...otherProps}
                open={open}
                actions={Actions}
                title="Name and Icon">
                <form ref="form" style={Styles.Form} onUpdate={e => this.onUpdate(e)}>
                    <div>
                        <TextField ref="name" fullWidth={true} floatingLabelText="Name" defaultValue={name} />
                    </div>
                    <div>
                        <TextField ref="character_url"
                            fullWidth={true}
                            floatingLabelText="Character Sheet URL"
                            defaultValue={character_url}
                            onBlur={() => this.fetchCharacter()} />
                    </div>
                    <div>Icon</div>
                    <div style={Styles.IconRadioGroup}>
                        <div style={Styles.Upload}>
                            <IconButton style={Styles.UploadIcon} iconClassName="material-icons" onTouchTap={() => this.onIconUpload()}>file_upload</IconButton>
                            <div>Upload</div>
                            <input ref="icon_data" type="file" style={{display: 'none'}} onChange={e => this.onIconFileChange(e)} multiple={true} />
                        </div>
                        <div style={Styles.IconRadioItem}>
                            <div style={Styles.IconRadioText}>
                                <input id={genId()} type="radio" name="icon_id" value="" defaultChecked={!icon_id}/>
                                <label htmlFor={lastId()} style={Styles.IconRadioTextLabel}>Default</label>
                            </div>
                            <label htmlFor={lastId()}>
                                <MessageIcon name={name} character_data={character_data} character_url={character_url} color={color} noShadow={true} />
                            </label>
                        </div>
                        {iconList.map(icon => (
                            <div key={icon.id} style={Styles.IconRadioItem}>
                                <div style={Styles.IconRadioText}>
                                    <input id={genId()} type="radio" name="icon_id" value={icon.id} defaultChecked={icon.id == icon_id} />
                                    <label htmlFor={lastId()} style={Styles.IconRadioTextLabel}>{icon.name}</label>
                                </div>
                                <label htmlFor={lastId()} onMouseEnter={e => this.showIconPop(e.target, icon)}>
                                    <MessageIcon {...icon} />
                                </label>
                            </div>
                        ))}
                    </div>
                    <Popover 
                        open={open && !!pop} 
                        anchorEl={pop && pop.target}
                        anchorOrigin={{"horizontal":"left","vertical":"top"}}
                        targetOrigin={{"horizontal":"left","vertical":"bottom"}}
                        useLayerForClickAway={false}
                        style={Styles.Popover} >
                        <div style={Styles.PopoverContents}>
                            <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                            <IconButton iconClassName="material-icons" iconStyle={{color: 'red'}} onTouchTap={() => confirm(`Delete ${pop.icon.name}?`) && removeIcon(pop.icon.id)}>delete</IconButton>
                        </div>
                    </Popover>
                </form>
            </Dialog>
        );
    }
}

export class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configDialog: false,
        };
    }
    
    onUpdate(e) {
        e.preventDefault();
        
        let messageField = this.refs.message;
        let message = messageField.getValue();
        if (message) {
            let {
                name,
                character_url,
                icon_id,
            } = this.props;

            this.props.createMessage({
                name,
                character_url,
                icon_id,
                message,
            });
            messageField.clearValue();
            this.endInput();
        }
    }

    onKey(e) {
        if (e.keyCode == KeyEvent.DOM_VK_RETURN && !e.shiftKey) {
            this.onUpdate(e);
        }
    }
    
    onUpdateForm(form) {
        this.closeConfigDialog();
        this.props.updateForm(form);
    }
    
    onInput() {
        let {
            name,
            beginInput,
        } = this.props;

        let message = this.refs.message.getValue();

        if (message) {
            beginInput({
                name,
                message: this.refs.message.getValue(),
            });
        } else this.endInput();
    }
    endInput() {
        this.props.endInput({
            name: this.props.name,
        });
    }
    
    openConfigDialog() {
        this.setState({configDialog: true});
    }
    closeConfigDialog() {
        this.setState({configDialog: false});
    }

    render() {
        let {
            id,
            is_first,
            name,
            character_url,
            character_data,
            icon_id,
            user,
            removeIcon,
            createForm,
            removeForm,
        } = this.props;
        let {
            configDialog,
        } = this.state;
        
        const Styles = {
            Form: {
                display: 'flex',
                alignItems: 'center',
            },
            Icon: {
                width: 60, height: 60,
                margin: '0 8px',
                padding: 0,
            },
            Message: {
                flex: '1 1 auto',
            },
        };

        return (
            <div>
                <form style={Styles.Form} onUpdate={e => this.onUpdate(e)}>
                    {is_first
                        ? <IconButton onTouchTap={createForm}><FontIcon className="material-icons">add</FontIcon></IconButton>
                        : <IconButton onTouchTap={() => removeForm(id)}><FontIcon className="material-icons">remove</FontIcon></IconButton>
                    }
                   
                    <IconButton style={Styles.Icon} onTouchTap={() => this.openConfigDialog()}>
                        <MessageIcon id={icon_id} name={name}  character_data={character_data} character_url={character_url}color={makeColor(`${name}${user.id}`)} />
                    </IconButton>
                    <TextField 
                        ref="message"
                        floatingLabelText={name}
                        fullWidth={true}
                        multiLine={true}
                        rows={1}
                        style={Styles.Message}
                        onKeyDown={e => this.onKey(e)}
                        onChange={() => this.onInput()}
                        onFocus={() => this.onInput()} />
                    <IconButton type="submit">
                        <FontIcon className="material-icons">send</FontIcon>
                    </IconButton>
                </form>
                <ConfigDialog {...this.props} open={configDialog} onCancel={() => this.closeConfigDialog()} onUpdate={form => this.onUpdateForm(form)} removeIcon={removeIcon} />
            </div>
        );
    }
}
import { map } from 'lodash';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';
import { Colors } from 'material-ui/lib/styles';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { generateId } from '../utility/id';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';

let lastId = null;
const genId = () => (lastId = generateId());

const Style = {
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
    IconRadio: {
        flex: '0 0 auto',
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

export const RadioItem = ({
    deleteMode,
    icon,
    icon_id,
    removeIcon,
    onUpdate,
}) => (
    <div key={icon.id} style={Style.IconRadioItem}>
        <div style={Style.IconRadioText}>
            {deleteMode
                ? <IconButton
                    iconClassName="material-icons"
                    iconStyle={{color: Colors.red700}}
                    id={genId()}
                    style={Style.IconDeleteIcon}
                    onTouchTap={() => removeIcon(icon)}
                  >
                    delete
                </IconButton>
                : <input
                    defaultChecked={
                        icon.id === icon_id
                    }
                    id={genId()}
                    name="icon_id"
                    style={Style.IconRadio}
                    type="radio"
                    value={icon.id}
                    onBlur={() => onUpdate('icon_id')}
                  />
            }
            <label
                htmlFor={lastId}
                style={Style.IconRadioTextLabel}
            >
                {icon.name}
            </label>
        </div>
        <label htmlFor={lastId} >
            <MessageIcon {...icon} />
        </label>
    </div>
);
RadioItem.propTypes = {
    deleteMode: PropTypes.bool.isRequired,
    icon: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    removeIcon: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    icon_id: PropTypes.string,
};

export class MessageConfigDialog extends Component {
    static get propTypes() {
        return {
            characters: PropTypes.object.isRequired,
            form: PropTypes.object.isRequired,
            iconList: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    type: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                })
            ).isRequired,
            open: PropTypes.bool.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            close: PropTypes.func.isRequired,
            fetchIcon: PropTypes.func.isRequired,
            updateForm: PropTypes.func.isRequired,
            createIcon: PropTypes.func.isRequired,
            onCharacterRequested: PropTypes.func.isRequired,
            removeIcon: PropTypes.func.isRequired,
            onNotify: PropTypes.func.isRequired,
            onEditIcon: PropTypes.func.isRequired,
        };
    }

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

    componentDidUpdate(prevProps) {
        if (this.character_url &&
            Object.keys(this.props.characters).length !==
                Object.keys(prevProps.characters).length
        ) {
            this.fetchCharacter();
        }
    }

    fetchCharacter() {
        const url = this.character_url.getValue();

        if (url !== this.name_url) {
            const {
                characters,
                onCharacterRequested,
            } = this.props;

            if (!characters[url] || !characters[url].data) {
                if (this.requesting_url !== url) {
                    this.requesting_url = url;
                    setTimeout(() => onCharacterRequested(url));
                }
            } else {
                const name = characters[url].data.name;
                this.name.setValue(name || '');
                this.name_url = url;
                this.requesting_url = null;
                this.update('name');
            }
        }
    }

    getIconId() {
        const form = findDOMNode(this.form);
        const selected = (
                form.icon_id.length
                ? map(form.icon_id, (a) => a)
                : [form.icon_id]
            )
            .find((radio) => radio.checked);

       return selected && selected.value || null;
    }

    getValue(key) {
        if (key === 'icon_id') {
            return this.getIconId();
        }

        const input = this[key];

        return input && input.getValue();
    }

    update(key) {
        const {
            form,
            updateForm,
        } = this.props;

        updateForm({
            id: form.id,
            [key]: this.getValue(key),
        });
    }

    onUpdate(e) {
        e.preventDefault();

        const {
            updateForm,
            close,
        } = this.props;

        updateForm({
            id: this.props.form.id,
            name: this.getValue('name'),
            character_url: this.getValue('character_url'),
            icon_id: this.getValue('icon_id'),
        });
        close();
    }

    onIconUpload() {
        findDOMNode(this.icon_data).click();
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
            form,
            iconList,
            open,
            user,
            removeIcon,
            close,
            onEditIcon,
        } = this.props;
        const {
            name,
            character_data,
            character_url,
            icon_id,
        } = form;
        const {
            deleteMode,
        } = this.state;

        const Actions = [
            <FlatButton primary
                key="close"
                label="Close"
                onTouchTap={close}
            />,
        ];
        const color = makeColor(`${name}${user && user.id}`);

        return (
            <Dialog autoScrollBodyContent
                actions={Actions}
                open={open}
                title="Name and Icon"
                onRequestClose={close}
            >
                <form
                    ref={(c) => c && (this.form = c)}
                    style={Style.Form}
                    onUpdate={(e) => this.onUpdate(e)}
                >
                    <div>
                        <TextField fullWidth
                            defaultValue={name}
                            floatingLabelText="Name"
                            ref={(c) => c && (this.name = c)}
                            style={Style.TextField}
                            onBlur={() => this.update('name')}
                        />
                    </div>
                    <div>
                        <TextField fullWidth
                            defaultValue={character_url}
                            floatingLabelText="Character Sheet URL"
                            ref={(c) => c && (this.character_url = c)}
                            style={Style.TextField}
                            onBlur={() => {
                                this.update('character_url');
                                this.fetchCharacter();
                            }}
                        />
                    </div>
                    <div style={Style.IconHeader} >
                        <div>Icon</div>
                        <IconButton
                            iconClassName="material-icons"
                            style={Style.IconDeleteIcon}
                            onTouchTap={onEditIcon}
                        >
                            mode_edit
                        </IconButton>
                    </div>
                    <div style={Style.IconRadioGroup}>
                        <div style={Style.Upload}>
                            <IconButton
                                iconClassName="material-icons"
                                style={Style.UploadIcon}
                                onTouchTap={() => this.onIconUpload()}
                            >
                                file_upload
                            </IconButton>
                            <div>Upload</div>
                            <input multiple
                                ref={(c) => c && (this.icon_data = c)}
                                style={{display: 'none'}}
                                type="file"
                                onChange={(e) => this.onIconFileChange(e)}
                            />
                        </div>
                        <div style={Style.IconRadioItem}>
                            <div style={Style.IconRadioText}>
                                <input
                                    defaultChecked={!icon_id}
                                    id={genId()}
                                    name="icon_id"
                                    style={Style.IconRadio}
                                    type="radio"
                                    value=""
                                    onBlur={() => this.update('icon_id')}
                                />
                                <label
                                    htmlFor={lastId}
                                    style={Style.IconRadioTextLabel}
                                >
                                    Default
                                </label>
                            </div>
                            <label htmlFor={lastId}>
                                <MessageIcon noShadow
                                    character_data={character_data}
                                    character_url={character_url}
                                    color={color}
                                    name={name}
                                />
                            </label>
                        </div>
                        {iconList.map((icon) => (
                            <RadioItem
                                deleteMode={deleteMode}
                                icon={icon}
                                icon_id={icon_id}
                                key={icon.id}
                                removeIcon={removeIcon}
                                onUpdate={(key) => this.update(key)}
                            />
                        ))}
                    </div>
                </form>
            </Dialog>
        );
    }
}

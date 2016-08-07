import IconButton from 'material-ui/IconButton';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utility/enhancer';

class FileUploadButton extends Component {
    static get propTypes() {
        return {
            onChange: PropTypes.func.isRequired,
            accept: PropTypes.string,
            multiple: PropTypes.bool,
            name: PropTypes.string,
        };
    }

    render() {
        const {
            accept,
            multiple,
            name,
            onChange,
            ...othres,
        } = this.props;

        return (
            <IconButton {...othres} onTouchTap={() => this.input.click()}>
                <FileUpload />
                <input
                    accept={accept}
                    multiple={multiple}
                    name={name}
                    ref={(c) => (this.input = c)}
                    style={{ display: 'none' }}
                    type="file"
                    onChange={(e) => onChange(e, e.target.files)}
                />
            </IconButton>
        );
    }
}
export default pureRender(FileUploadButton);

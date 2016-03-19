import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React from 'react';

const Style = {
    Form: {
        margin: '0 18px',
    },
};

export const Guest = () => (
    <div>
        <AppBar
            iconElementLeft={
                <a href="/">
                    <img src="/img/nekokoro48.png" />
                </a>
            }
            title="Guest Login"
        />
        <form method="POST" style={Style.Form}>
            <TextField
                fullWidth
                required
                floatingLabelText="User ID"
                name="id"
                pattern="^[a-z0-9_]+$"
            />
            <TextField
                fullWidth
                required
                floatingLabelText="Default Name"
                name="name"
                pattern="^[^\s]+$"
            />
            <FlatButton primary label="Login" type="submit" />
        </form>
    </div>
);

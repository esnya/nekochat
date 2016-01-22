import { AppBar, Avatar, FontIcon, IconButton, TextField } from 'material-ui';
import React, { Component } from 'react';
import { makeColor } from '../color';
import { MessageFormContainer } from '../containers/MessageFormContainer';
import { MessageIcon } from './MessageIcon';

export const Message = (props) => {
    const Styles = {
        ListItem: {
            display: 'flex',
            padding: '8px 0',
        },
        Icon: {
            flex: '0 0 auto',
            padding: '0 8px',
        },
        MessageContainer: {
            flex: '1 1 auto',
        },
        Header: {
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: 14,
        },
        Message: {
        },
        Line: {
            margin: 0,
        },
        Timestamp: {
            flex: '0 0 auto',
            padding: '0 8px',
        },
    };
    
    let {
        name,
        user_id,
    } = props;
    
    let color = makeColor(`${name}${user_id}`);
    
    return (        
        <div style={Styles.ListItem}>
            <div style={Styles.Icon}>
                <MessageIcon id={props.icon_id} name={props.name} color={color}/>
            </div>
            <div style={Styles.MessageContainer}>
                <div style={Styles.Header}>
                    <span style={{color}}>{props.name}</span>
                    <span>@</span>
                    <span>{props.user_id}</span>
                </div>
                <div style={Styles.Message}>
                    {props.message.split(/\r\n|\n/).map((line, i) => <p key={i} style={Styles.Line}>{line}</p>)}
                </div>
            </div>
            <div style={Styles.Timestamp}>{new Date(props.created).toString()}</div>
        </div>
    );
};

export class Chat extends Component {
    constructor(props) {
        super(props);

        setTimeout(() => {
            props.join(props.roomId);
            props.fetch();
        });
    }

    componentWillUpdate(nextProps) {
        if (nextProps.id != this.props.id) {
            nextProps.fetch();
        }
    }

    render() {
        let {
            id,
            title,
            messageForm,
            messageList,
            user,
            createForm,
            onSubmitMessage,
        } = this.props;

        const Styles = {
            Container: {
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            List: {
                flex: '1 1 auto',
                overflow: 'auto',
            },
        };
        return (
            <div style={Styles.Container}>
                <AppBar title={title || 'BeniimoOnline'} />
                <div style={Styles.Form}>
                    {messageForm.map(form => <MessageFormContainer {...form} key={form.id} user={user} />)}
                </div>
                <div style={Styles.List}>
                    {messageList.map(message => <Message {...message} key={message.id} />)}
                </div>
            </div>
        );
    }
};
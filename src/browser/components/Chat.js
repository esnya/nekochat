import { AppBar, Avatar, CircularProgress, FontIcon, IconButton, LeftNav, MenuItem, TextField } from 'material-ui';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
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
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: 14,
        },
        Link: {
            margin: '0 4px',
            padding: 0,
            width: 'auto', height: 'auto',
        },
        LinkIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: 18,
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
        icon_id,
        iconType,
        name,
        character_data,
        character_url,
        user_id,
        message,
        created,
    } = props;
    
    let href = character_data && new URL(character_data.url, character_url) || character_url;
    let color = makeColor(`${name}${user_id}`);
    
    return (        
        <div style={Styles.ListItem}>
            <div style={Styles.Icon}>
                <MessageIcon id={icon_id} type={iconType} name={name} character_data={character_data} character_url={character_url} color={color}/>
            </div>
            <div style={Styles.MessageContainer}>
                <div style={Styles.Header}>
                    <span style={{color}}>{name}</span>
                    <span>@</span>
                    <span>{props.user_id}</span>
                    {href && 
                        <IconButton
                            containerElement="a"
                            href={href}
                            target="_blank"
                            style={Styles.Link}
                            iconClassName="material-icons"
                            iconStyle={Styles.LinkIcon} >
                            open_in_new
                        </IconButton>}
                </div>
                <div style={Styles.Message}>
                    {message && message.split(/\r\n|\n/).map((line, i) => <p key={i} style={Styles.Line}>{line}</p>)}
                </div>
            </div>
            <div style={Styles.Timestamp}>{created && new Date(created).toString()}</div>
        </div>
    );
};

export class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            leftNav: false,
        };

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
    componentDidUpdate(prevProps) {
        if (!this.props.eor && this.props.messageList.length > 0 && prevProps.messageList.length == 0) {
            this.onScroll({
                target: findDOMNode(this.refs.messageList),
            });
        }
    }

    onScroll(e) {
        let loader = findDOMNode(this.refs.loader);
        let list = e.target;

        if (list.scrollTop + list.offsetHeight >= loader.offsetTop - list.offsetTop + loader.offsetHeight) {
            let {
                eor,
                messageList,
                fetch,
            } = this.props;
            if (eor) return;
            fetch(messageList[messageList.length - 1].id);
        }
    }
    
    toggleLeftNav() {
        this.setState({leftNav: !this.state.leftNav});
    }

    render() {
        let {
            id,
            title,
            eor,
            input,
            messageForm,
            messageList,
            user,
            createForm,
            onSubmitMessage,
            setRoute,
        } = this.props;
        let {
            leftNav,
        } = this.state;

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
            Loader: {
                textAlign: 'center',
                overflow: 'hidden',
            },
        };

        document.title = title || 'Beniimo Online';
        return (
            <div style={Styles.Container}>
                <AppBar title={title || 'Beniimo Online'} onLeftIconButtonTouchTap={() => this.toggleLeftNav()} />
                <div style={Styles.Form}>
                    {messageForm.map(form => <MessageFormContainer {...form} key={form.id} user={user} />)}
                </div>
                <div ref="messageList" style={Styles.List} onScroll={e => this.onScroll(e)}>
                    {input.map(input => <Message {...input} key={input.id} iconType="loading" />)}
                    {messageList.map(message => <Message {...message} key={message.id} />)}
                    <div ref="loader" style={Object.assign({
                        display: eor ? 'none' : 'block',
                    }, Styles.Loader)}>
                        <CircularProgress />
                    </div>
                </div>
                <LeftNav open={leftNav} docked={false}>
                    <AppBar
                        title={title || 'Beniimo Online'}
                        iconElementLeft={<IconButton iconClassName="material-icons" onTouchTap={() => this.toggleLeftNav()}>close</IconButton>} />
                    <MenuItem onTouchTap={() => setRoute('/')}>Leave</MenuItem>
                    <MenuItem href={`/view/${id}`} target="_blank">Static View</MenuItem>
                </LeftNav>
            </div>
        );
    }
};
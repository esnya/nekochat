import { template } from 'lodash';
import FontIcon from 'material-ui/lib/font-icon';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Popover from 'material-ui/lib/popover/popover';
import React, { Component, PropTypes } from 'react';

const Item = ({
    data,
    icon,
    message,
}) => (
    <ListItem
        leftIcon={icon && (
            <FontIcon className="material-icons">{icon}</FontIcon>
        )}
        primaryText={template(message)(data)}
    />
);
Item.propTypes = {
    message: PropTypes.string.isRequired,
    data: PropTypes.object,
    icon: PropTypes.string,
};

export class Notification extends Component {
    static get propTypes() {
        return {
            notifications: PropTypes.arrayOf(
                PropTypes.shape({
                    message: PropTypes.string.isRequired,
                })
            ).isRequired,
        };
    }

    render() {
        const {
            notifications,
        } = this.props;

        return (
            <Popover
                anchorEl={document.getElementById('notification-anchor')}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                }}
                open={notifications.length > 0}
                targetOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                useLayerForClickAway={false}
            >
                <List ref={(c) => (this.list = c)}>
                    {
                        notifications.map((notification, i) => (
                            <Item {...notification} key={i} />
                        ))
                    }
                </List>
            </Popover>
        );
    }
}
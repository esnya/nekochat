describe('Notification', () => {
    const ListItem = require('material-ui/lib/lists/list-item');
    const Popover = require('material-ui/lib/popover/popover');

    jest.dontMock('react');
    const React = require('react');

    jest.dontMock('react-addons-test-utils');
    const {
        isElementOfType,
        renderIntoDocument,
        scryRenderedComponentsWithType,
    } = require('react-addons-test-utils');

    jest.dontMock('../Notification');
    const {
        Notification,
        Item,
    } = require('../Notification');

    it('should validate props', () => {
        expect(Notification.propTypes).toBeDefined();
    });

    it('notifies notifications', () => {
        renderIntoDocument(
            <Notification
                notifications={[
                    { message: 'Notification 1' },
                    { message: 'Notification 2' },
                    { message: 'Notification 3' },
                ]}
            />
        );

        const popover = Popover.mock.instances[0];
        const paper = popover.props.children;
        const listItems = paper.props.children;

        expect(listItems.length).toBe(3);
        expect(isElementOfType(listItems[0], Item)).toBe(true);
        expect(isElementOfType(listItems[1], Item)).toBe(true);
        expect(isElementOfType(listItems[2], Item)).toBe(true);
        expect(listItems[0].props.message).toContain('Notification 1');
        expect(listItems[1].props.message).toContain('Notification 2');
        expect(listItems[2].props.message).toContain('Notification 3');
    });

    it('should be anchored to #notification-anchor', () => {
        const anchor = document.createElement('div');
        anchor.setAttribute('id', 'notification-anchor');
        document.body.appendChild(anchor);

        const notification = renderIntoDocument(
            <Notification notifications={[]} />
        );

        const popover =
            scryRenderedComponentsWithType(notification, Popover)[0];
        expect(popover.props.anchorEl).toBeDefined();
        expect(popover.props.anchorEl.getAttribute('id'))
            .toEqual('notification-anchor');
    });

    it('should be hidden when the notification does not exist', () => {
        const notification = renderIntoDocument(
            <Notification notifications={[]} />
        );

        expect(
            scryRenderedComponentsWithType(notification, Popover)[0].props.open
        ).toBe(false);
    });

    it('render lodash template', () => {
        ListItem.mockClear();

        renderIntoDocument(
            <Item
                message="Notification ${data1} ${data2.data}"
                data={{
                    data1: 1,
                    data2: {
                        data: 2,
                    },
                }}
            />
        );

        expect(ListItem.mock.calls[0][0].primaryText)
            .toContain('Notification 1 2');
    });

    it('displays icon', () => {
        ListItem.mockClear();

        renderIntoDocument(
            <Item
                message="test"
                icon="test-icon"
            />
        );

        const icon = ListItem.mock.calls[0][0].leftIcon;
        expect(icon.props.children).toEqual('test-icon');
    });
});

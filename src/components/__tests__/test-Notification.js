describe('Notification', () => {
    jest.dontMock('material-ui/lib/lists/list');
    jest.dontMock('material-ui/lib/lists/list-item');
    jest.dontMock('material-ui/lib/popover/popover');

    const Popover = require('material-ui/lib/popover/popover');

    jest.dontMock('react');
    const React = require('react');

    jest.dontMock('react-dom');
    const {
        findDOMNode,
    } = require('react-dom');

    jest.dontMock('react-addons-test-utils');
    const {
        findRenderedDOMComponentWithClass,
        renderIntoDocument,
        scryRenderedComponentsWithType,
    } = require('react-addons-test-utils');

    jest.dontMock('../Notification');
    const Notification = require('../Notification').Notification;

    it('should validate props', () => {
        expect(Notification.propTypes).toBeDefined();
    });

    it('should be notify notifications', () => {
        const notification = renderIntoDocument(
            <Notification
                notifications={[
                    { message: 'Notification 1' },
                    { message: 'Notification 2' },
                    { message: 'Notification 3' },
                ]}
            />
        );

        const textContent = findDOMNode(notification.list).textContent;
        expect(textContent).toContain('Notification 1');
        expect(textContent).toContain('Notification 2');
        expect(textContent).toContain('Notification 3');
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

    it('should be able to use lodash template', () => {
        const notification = renderIntoDocument(
            <Notification
                notifications={[{
                    message: 'Notification ${data1} ${data2.data}',
                    data: {
                        data1: 1,
                        data2: {
                            data: 2,
                        },
                    },
                }]}
            />
        );

        const textContent = findDOMNode(notification.list).textContent;
        expect(textContent).toContain('Notification 1 2');
    });

    it('should be able to set icons', () => {
        const notification = renderIntoDocument(
            <Notification
                notifications={[{
                    message: 'Test',
                    icon: 'test-icon',
                }]}
            />
        );

        const icon = findRenderedDOMComponentWithClass(
            notification.list,
            'material-icons'
        );
        const textContent = findDOMNode(icon).textContent;
        expect(textContent).toEqual('test-icon');
    });
});
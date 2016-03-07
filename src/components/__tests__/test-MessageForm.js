describe('MessageForm', () => {
    jest.dontMock('material-ui/lib/text-field');
    const TextField = require('material-ui/lib/text-field');

    jest.dontMock('react');
    const React = require('react');

    jest.dontMock('react-addons-test-utils');
    const {
        Simulate,
        findRenderedComponentWithType,
        renderIntoDocument,
    } = require('react-addons-test-utils');

    jest.dontMock('../MessageForm');
    const MessageForm = require('../MessageForm').MessageForm;

    class TestWrapper extends React.Component {
        constructor(props) {
            super(props);
            this.state = {...props};
        }

        render() {
            const {
                ChildType,
                ...props,
            } = this.props;

            return <ChildType {...props} />;
        }
    }

    const createMessage = jest.genMockFn();
    const beginInput = jest.genMockFn();
    const endInput = jest.genMockFn();

    beforeEach(() => {
        createMessage.mockClear();
        beginInput.mockClear();
        endInput.mockClear();
    });

    let form;
    it('should be able to render', () => {
        form = renderIntoDocument((
            <TestWrapper
                ChildType={MessageForm}
                id="test-id"
                is_first={false}
                name="test-name"
                user={{id: 'test-user-id', name: 'test-user-name'}}
                createMessage={createMessage}
                beginInput={beginInput}
                endInput={endInput}
            />
        ));
    });

    let input;
    it('should have textarea', () => {
        input = findRenderedComponentWithType(form, TextField)
            .refs
            .input
            .refs
            .input;
    });

    it('should send a message with enter', () => {
        Simulate.keyDown(input, { key: 'f', keyCode: 70, which: 70 });
        Simulate.keyDown(input, { key: 'o', keyCode: 79, which: 79 });
        Simulate.keyDown(input, { key: 'o', keyCode: 79, which: 79 });

        input.value = 'foo';

        Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });

        expect(createMessage.mock.calls.length).toBe(1);

        const message = createMessage.mock.calls[0][0];

        expect(Object.keys(message).sort()).toEqual([
            'name',
            'character_url',
            'icon_id',
            'message',
            'whisper_to',
        ].sort());
        expect(message.name).toEqual('test-name');
        expect(message.message).toEqual('foo');
        expect(!message.character_url).toBe(true);
        expect(!message.icon_id).toBe(true);
        expect(!message.whisper_to).toBe(true);
    });

    const watcherId = { the: 'test' };
    setInterval.mockReturnValue(watcherId);

    let watcher;
    it('should send preview of input', () => {
        Simulate.keyDown(input, { key: 'b', keyCode: 66, which: 66 });
        Simulate.focus(input);

        Simulate.keyDown(input, { key: 'a', keyCode: 65, which: 65 });
        Simulate.keyDown(input, { key: 'r', keyCode: 82, which: 82 });

        input.value = 'bar';

        expect(setInterval.mock.calls.length).toBe(1);
        watcher = setInterval.mock.calls[0][0];

        watcher();

        expect(beginInput).toBeCalledWith({
            name: 'test-name',
            message: 'bar',
        });
    });

    it('should clear watcher for input', () => {
        Simulate.blur(input);

        expect(clearInterval.mock.calls.length).toBe(1);
        expect(clearInterval.mock.calls[0][0]).toBe(watcherId);
    });

    it('should end preview of input', () => {
        input.value = '';

        watcher();

        expect(endInput).toBeCalled();
    });
});

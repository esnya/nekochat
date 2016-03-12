describe('MessageForm', () => {
    const TextField = require('material-ui/lib/text-field');

    jest.dontMock('react');
    const React = require('react');

    jest.dontMock('react-addons-test-utils');
    const {
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

    it('should be able to render', () => {
        renderIntoDocument((
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
        expect(TextField).toBeCalled();
        input = TextField.mock.instances[0];
    });

    let onKeyDown;
    const keyDown = (key, code = null) => {
        const keyCode = code === null
            ? key.toUpperCase().charCodeAt(0)
            : code;

        return onKeyDown(new KeyboardEvent('keydown', {
            key, keyCode,
            which: keyCode,
        }));
    };
    it('should send a message with enter', () => {
        onKeyDown = input.props.onKeyDown;
        keyDown('f');
        keyDown('o');
        keyDown('o');

        input.getValue.mockReturnValue('foo');

        keyDown('Enter', 13);

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

    let watcher, onFocus;
    it('should send preview of input', () => {
        onFocus = input.props.onFocus;
        onFocus();

        keyDown('b');
        keyDown('a');
        keyDown('r');

        input.getValue.mockReturnValue('bar');

        expect(setInterval.mock.calls.length).toBe(1);
        watcher = setInterval.mock.calls[0][0];

        watcher();

        expect(beginInput).toBeCalledWith({
            name: 'test-name',
            message: 'bar',
        });
    });

    let onBlur;
    it('should clear watcher for input', () => {
        onBlur = input.props.onBlur;
        onBlur();

        expect(clearInterval.mock.calls.length).toBe(1);
        expect(clearInterval.mock.calls[0][0]).toBe(watcherId);
    });

    it('should end preview of input', () => {
        input.getValue.mockReturnValue('');

        watcher();

        expect(endInput).toBeCalled();
    });
});

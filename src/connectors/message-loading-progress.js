import { connect } from 'react-redux';

export default connect(({ room, messages }) => {
    const first = messages.first();
    const firstId = room.get('first_message');

    return {
        isVisible: firstId &&
            (!first || first.get('id') !== room.get('first_message')),
    };
}, () => ({}));

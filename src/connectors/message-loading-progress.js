import { connect } from 'react-redux';

export default connect(({ room, messages }) => {
    const first = messages.first();

    return {
        isVisible: !first || first.get('id') !== room.get('first_message'),
    };
});

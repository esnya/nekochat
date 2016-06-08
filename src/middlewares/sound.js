import { notice } from '../browser/sound';

export default () => (next) => (action) => {
    if (action.meta && action.meta.sound === 'notice') {
        notice();
    }

    return next(action);
};

import './window-event';
import './moment';
import './render';

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('./debug');
}

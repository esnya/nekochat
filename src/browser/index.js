/* eslint global-require: 0 */

require('react-tap-event-plugin')();
require('../components');
require('./router').run();
require('./window-event');

if (require('./config').Config.debug) {
    require('./debug');
}

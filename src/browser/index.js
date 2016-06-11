/* eslint global-require: 0 */

require('react-tap-event-plugin')();
require('../components');
require('./router').run();
require('./window-event');

if (require('./config').Config.debug) {
    require('why-did-you-update')
        .whyDidYouUpdate(require('react'), {
            exclude: /^(Connect|^TouchRipple|^EnhancedButton)/,
        });
    window.Perf = require('react-addons-perf');
}

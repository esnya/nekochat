import moment from 'moment';
export default moment;

require('moment/locale/ja');

moment.locale(
    navigator.userLanguage || navigator.languages || navigator.language
);

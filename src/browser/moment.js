import moment from 'moment';
export default moment;

import 'moment/locale/ja';

moment.locale(
    navigator.userLanguage || navigator.languages || navigator.language
);

import moment from 'moment';
import 'moment/locale/ja';

export default moment;

moment.locale(
    navigator.userLanguage || navigator.languages || navigator.language,
);

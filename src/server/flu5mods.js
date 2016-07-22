import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import parser from '../pegjs/fluorite5';

const src = readdirSync(path.join(__dirname, '../../fluorite5'))
    .map((file) =>
        readFileSync(path.join(__dirname, '../../fluorite5', file)).toString()
    )
    .join(';');

export default parser.parse(`\\${src}\\`)[1];

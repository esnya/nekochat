import config from 'config';
import { Router } from 'express';
import { unformatSI } from 'format-si-prefix';
import { genId } from '../../utility/id';
import knex from '../knex';
import { system as logger } from '../logger';

const router = new Router();
export default router;

const types = config.get('file.types');
const maxSize = unformatSI(config.get('file.maxSize'));

router.get('/:id', ({ params, user }, res, next) =>
    knex('files')
        .where({
            id: params.id,
        })
        .whereNull('deleted')
        .first()
        .then(file => {
            if (!file) return res.sendStatus(404);

            return res.type(file.type).send(file.data);
        })
        .catch(next)
);

// eslint-disable-next-line consistent-return
router.post('/', (req, res) => {
    if (!types.some(type => req.is(type))) return res.sendStatus(400);

    let size = 0;
    let sizeOver = false;

    const chunks = [];
    req.on('data', chunk => {
        if (!sizeOver) {
            size += chunk.length;

            if (size > maxSize) {
                sizeOver = true;
            } else {
                chunks.push(chunk);
            }
        }
    });

    req.on('end', () => {
        if (sizeOver) return res.sendStatus(413);

        const file = {
            id: genId(),
            type: req.get('content-type'),
            user_id: req.user.id,
        };

        return knex('files')
            .insert({
                ...file,
                data: Buffer.concat(chunks),
            })
            .then(() => res.send(file))
            .catch((e) => {
                logger.error(e);
                res.sendStatus(500);
            });
    });
});

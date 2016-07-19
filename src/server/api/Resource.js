import bodyParser from 'body-parser';
import { Router } from 'express';
import { getLogger } from 'log4js';
import moment from 'moment';
import knex from '../knex';
import genId from '../../utility/id';

const logger = getLogger('[API]');

const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const getNow = () => moment().format(TIMESTAMP_FORMAT);

class Model {
    constructor(name, table, options) {
        this.table = table;
        this.autoInc = options.autoInc;
        this.filter = options.filter || (data => data);
    }

    find(id) {
        return knex(this.table)
                .whereNull('deleted')
                .where('id', id)
                .first()
                .then(data => data || Promise.reject(new Error('Not found')))
                .then(this.filter);
    }

    findAll() {
        return knex(this.table)
            .whereNull('deleted')
            .then(data => data.map(this.filter));
    }

    insert(userId, data) {
        const id = this.autoInc ? undefined : genId().substr(0, 20);
        const now = getNow();

        return knex(this.table)
            .insert({
                ...data,
                id,
                user_id: userId,
                created: now,
                modified: now,
                deleted: null,
            })
            .then(ids => this.find(this.autoInc ? ids[0] : id));
    }

    update(id, userId, data) {
        return knex(this.table)
            .where({ id, user_id: userId })
            .update({
                ...data,
                id,
                user_id: userId,
                modified: getNow(),
                deleted: null,
            })
            .then(() => this.find(id));
    }

    remove(id, userId) {
        return knex(this.table)
            .where({ id, user_id: userId })
            .update({ deleted: getNow() });
    }
}

export default class Resource {
    constructor(name, table, options) {
        this.model = new Model(name, table, options);
        this.paramKey = `${name}_id`;
    }

    initialize() {
        const router = new Router;

        router.get('/', (...args) => this.index(...args));
        router.post('/', bodyParser.json(), (...args) => this.create(...args));
        router.get(`/:${this.paramKey}`, (...args) => this.show(...args));
        router.put(`/:${this.paramKey}`, bodyParser.json(), (...args) => this.update(...args));
        router.delete(`/:${this.paramKey}`, (...args) => this.remove(...args));

        return router;
    }

    index(req, res) {
        this.model.findAll()
            .then(data => res.send(data))
            .catch((e) => {
                logger.error(e);
                res.send(500, { error: 'Internal Server Error' });
            });
    }

    create(req, res) {
        this.model.insert(req.user.id, req.body)
            .then(data => res.send(data))
            .catch((e) => {
                logger.error(e);
                res.send(500, { error: 'Internal Server Error' });
            });
    }

    show(req, res) {
        this.model.find(req.params[this.paramKey])
            .then(data => res.send(data))
            .catch((e) => {
                logger.error(e);
                res.send(500, { error: 'Internal Server Error' });
            });
    }

    update(req, res) {
        this.model.update(req.params[this.paramKey], req.user.id, req.body)
            .then(data => res.send(data))
            .catch((e) => {
                logger.error(e);
                res.send(500, { error: 'Internal Server Error' });
            });
    }

    remove(req, res) {
        this.model.remove(req.params[this.paramKey], req.user.id)
            .then(() => res.send(200, null))
            .catch((e) => {
                logger.error(e);
                res.send(500, { error: 'Internal Server Error' });
            });
    }
}

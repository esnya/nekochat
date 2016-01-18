import Knex from 'knex';

export const knex = Knex(require('../../config/database').default);
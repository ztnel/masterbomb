/**
 * manufacturers.ts
 *
 * API queries for /manufacturers subroute
 *
 * @module manufacturersRouter
 */

import { errors } from 'pg-promise';
import { Router, Request, Response } from 'express';
import { postgres } from '../../../db';
import { pk_guard } from '../interfaces/params';

const manufacturersRouter = Router();

/** GET /v1/manufacturers/ */
manufacturersRouter.get('/', async (_request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const manufacturers = await db.any(`
            SELECT id, name FROM manufacturers`
        );
        response.json(manufacturers);
    } catch (err) {
        console.error(err);
        response.status(500).json({error: err.message || err });
    }
    return response;
});

/** GET /v1/manufacturers/:id */
manufacturersRouter.get('/:id', async (request:Request, response:Response):Promise<Response> => {
    if (pk_guard(request.params)) {
        try {
            const db = postgres.get_db();
            const manufacturers = await db.one(`
                SELECT id, name FROM manufacturers
                WHERE id = $[id]`,
                { id: request.params.id }
            );
            response.json(manufacturers);
        } catch (err) {
            console.error(err);
            // since the param is the pk more than one response row is not possible
            if (err instanceof errors.QueryResultError) {
                response.status(404).json({error: 'Manufacturer not found' });
            } else {
                response.status(500).json({ error: 'The server experienced an internal error' });
            }
        }
    } else {
        response.status(400).json({ error: 'Bad Request: id param must be an integer' });
    }
    return response;
});

/** POST /v1/manufacturers/ */
manufacturersRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const id = await db.one(`
            INSERT INTO manufacturers( name )
            VALUES( $[name] )
            RETURNING id;`,
            {...request.body}
        );
        response.status(201).json({ id });
    } catch (err) {
        console.error(err);
        response.status(500).json({error: err.message || err });
    }
    return response;
});

/** DELETE /v1/manufacturers/ */
manufacturersRouter.delete('/:id', async (request:Request, response:Response):Promise<Response> => {
    if (pk_guard(request.params)) {
        try {
            const db = postgres.get_db();
            const id = await db.result(`
                DELETE FROM manufacturers
                WHERE id = $[id]`,
                { id: request.params.id }, (r:any) => r.rowCount
            );
            response.json({ id });
        } catch (err) {
            console.error(err);
            response.status(500).json({error: err.message || err });
        }
    } else {
        response.status(400).json({ error: 'Bad Request: id param must be an integer' });
    }
    return response;
});

export default manufacturersRouter;
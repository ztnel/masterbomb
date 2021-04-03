/**
 * manufacturers.ts
 *
 * API queries for /manufacturers subroute
 *
 * @module manufacturersRouter
 */

import { Router, Request, Response } from 'express';
import { postgres } from '../../../db';

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
    try {
        const db = postgres.get_db();
        const manufacturers = await db.any(`
            SELECT id, name FROM manufacturers
            WHERE id = $[id]`,
            { id: request.params.id }
        );
        response.json(manufacturers);
    } catch (err) {
        console.error(err);
        response.status(500).json({error: err.message || err });
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
    return response;
});

export default manufacturersRouter;
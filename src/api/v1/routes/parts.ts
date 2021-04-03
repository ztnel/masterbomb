/**
 * parts.ts
 *
 * API queries for /parts subroute
 *
 * @module partsRouter
 */

import { Router, Request, Response } from 'express';
import { postgres } from '../../../db';

const partsRouter = Router();

/** GET /v1/parts/ */
partsRouter.get('/', async (_request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const parts = await db.any(`
            SELECT id, name, description, manufacturer_id, supplier_id, unit_price FROM parts`
        );
        response.json(parts);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** GET /v1/parts/:id */
partsRouter.get('/get/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const parts = await db.any(`
            SELECT id, name, description, manufacturer_id, supplier_id, unit_price FROM parts
            WHERE id = $[id]`,
            { id: request.params.id }
        );
        response.json(parts);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/parts/ */
partsRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const id = await db.one(`
            INSERT INTO parts( name, description, manufacturer_id, supplier_id, unit_price )
            VALUES( $[name], $[description], $[manufacturer_id], $[supplier_id], $[unit_price] )
            RETURNING id;`,
            {...request.body}
        );
        response.status(201).json({ id });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** DELETE /v1/parts/:id */
partsRouter.delete('/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const id = await db.result(`
            DELETE FROM parts
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        response.json({ id });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

export default partsRouter;
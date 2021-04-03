/**
 * suppliers.ts
 *
 * API queries for /suppliers subroute
 *
 * @module suppliersRouter
 */

import { Router, Request, Response} from 'express';
import { postgres } from '../../../db';

const suppliersRouter = Router();

/** GET /v1/suppliers/ */
suppliersRouter.get('/', async (_request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = postgres.get_db();
        const suppliers = await db.any(`
            SELECT id, name, website FROM suppliers`
        );
        response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** GET /v1/suppliers/:id */
suppliersRouter.get('/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = postgres.get_db();
        const suppliers = await db.any(`
            SELECT id, name, website FROM suppliers
            WHERE id = $[id]`,
            { id: request.params.id }
        );
        response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/suppliers/ */
suppliersRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = postgres.get_db();
        const id = await db.one(`
            INSERT INTO suppliers( name, website )
            VALUES( $[name], $[website] )
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

/** DELETE /v1/suppliers/:id */
suppliersRouter.delete('/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = postgres.get_db();
        const id = await db.result(`
            DELETE FROM suppliers
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

export default suppliersRouter;
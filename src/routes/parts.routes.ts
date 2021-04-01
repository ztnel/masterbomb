// parts.routes.ts
/**
 * API queries for /parts subroute 
 *
 * @module partsRouter
 */

import { Router, Request, Response } from 'express'

const partsRouter = Router();

/** GET /parts/all */
partsRouter.get('/all', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const parts = await db.any(`
            SELECT id, name, description, manufacturer_id, supplier_id, unit_price FROM parts`
        );
        return response.json(parts);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /parts/get/:id */
partsRouter.get('/get/:id', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const parts = await db.any(`
            SELECT id, name, description, manufacturer_id, supplier_id, unit_price FROM parts
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json(parts);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /parts/add */
partsRouter.post('/add', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO parts( name, description, manufacturer_id, supplier_id, unit_price )
            VALUES( $[name], $[description], $[manufacturer_id], $[supplier_id], $[unit_price] )
            RETURNING id;`,
            {...request.body}
        );
        return response.status(201).json({ id });
    } catch (err) {
        // catch errors and log (returning false)
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** DELETE /parts/delete */
partsRouter.delete('/delete/:id', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.result(`
            DELETE FROM parts
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json({ id });
    } catch (err) {
        // catch errors and log (returning false)
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

export default partsRouter;
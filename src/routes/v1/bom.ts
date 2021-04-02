/**
 * bom.routes.ts
 *
 * API queries for /bom subroute
 *
 * @module bomRouter
 */

import { Router, Request, Response } from 'express';

const bomRouter = Router();

/** GET /v1/bom/ */
bomRouter.get('/', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const bom = await db.any(`
            SELECT id, name, description FROM bom`
        );
        return response.json(bom);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /v1/bom/:id */
bomRouter.get('/get/:id', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const bom = await db.any(`
            SELECT id, name, description FROM bom
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json(bom);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /v1/bom/ */
bomRouter.post('/', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO bom( name, description )
            VALUES( $[name], $[description] )
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

export default bomRouter;
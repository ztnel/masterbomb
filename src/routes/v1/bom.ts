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
bomRouter.get('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const bom = await db.any(`
            SELECT id, name, description FROM bom`
        );
        response.json(bom);
    } catch (err) {
        console.error(err);
        response.status(500).json({error: err.message || err });
    }
    return response;
});

/** GET /v1/bom/:id */
bomRouter.get('/get/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const bom = await db.any(`
            SELECT id, name, description FROM bom
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        response.json(bom);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/bom/ */
bomRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO bom( name, description )
            VALUES( $[name], $[description] )
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

export default bomRouter;
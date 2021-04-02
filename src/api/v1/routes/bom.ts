/**
 * bom.routes.ts
 *
 * API queries for /bom subroute
 *
 * @module bomRouter
 */

import { Router, Request, Response } from 'express';
import { BomRequest } from '../interfaces/bom';

const bomRouter = Router();

/** GET /v1/bom/?project_id=X&part_id=Y */
bomRouter.get('/', async (request:BomRequest, response:Response):Promise<Response> => {
    // parse query string
    const part_id = request.query.part_id;
    const project_id = request.query.project_id;
    console.log("Project ID:" + project_id);
    console.log("Part ID:" + part_id);
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

/** POST /v1/bom/ */
bomRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO bom( name, description )
            VALUES( $[part_id], $[project_id], $[quantity] )
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
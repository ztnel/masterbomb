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

/** GET /v1/bom/?project_id=<int> */
bomRouter.get('/', async (request:BomRequest, response:Response):Promise<Response> => {
    // parse query string
    const project_id = request.query.project_id;
    console.log("Project ID:" + project_id);
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const bom = await db.any(`
            SELECT parts, quantity FROM bom
            WHERE project_id=$[project_id]`
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
        const id = await db.any(`
            INSERT INTO bom( project_id, part_id, quantity )
            VALUES( $[part_id], $[project_id], $[quantity] );`,
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
/**
 * bom.routes.ts
 *
 * API queries for /bom subroute
 *
 * @module bomRouter
 */


import { Router, Request, Response } from 'express';
import { BomRequest } from '../interfaces/bom';
import { get_db } from '../../../db';

const bomRouter = Router();

/** GET /v1/bom/?project_id=<int> */
bomRouter.get('/', async (request:BomRequest, response:Response):Promise<Response> => {
    // type guard for request obj
    try {
        // get database passed by request object
        const db = get_db();
        const bom = await db.any(`
            SELECT part_id, quantity FROM bom
            WHERE project_id=$[project_id]`,
            {...request.query}
        );
        response.status(200).json(bom);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/bom/ */
bomRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = get_db();
        const id = await db.any(`
            INSERT INTO bom( project_id, part_id, quantity )
            VALUES( $[project_id], $[part_id], $[quantity] );`,
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
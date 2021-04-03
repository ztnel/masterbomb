/**
 * projects.ts
 *
 * API queries for /projects subroute
 *
 * @module projectsRouter
 */

import { Router, Request, Response } from 'express';
import { get_db } from '../../../db';

const projectsRouter = Router();

/** GET /v1/projects/ */
projectsRouter.get('/', async (_request:Request, response:Response):Promise<Response> => {
    try {
        const db = get_db();
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const projects = await db.any(`
            SELECT id, name, description FROM projects`
        );
        response.json(projects);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** GET /v1/projects/:id */
projectsRouter.get('/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = get_db();
        const projects = await db.any(`
            SELECT id, name, description FROM projects
            WHERE id = $[id]`,
            { id: request.params.id }
        );
        response.json(projects);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/projects/ */
projectsRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = get_db();
        const id = await db.one(`
            INSERT INTO projects( name, description )
            VALUES( $[name], $[description] )
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

/** DELETE /v1/projects/:id */
projectsRouter.delete('/:id', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = get_db();
        const id = await db.result(`
            DELETE FROM projects
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

export default projectsRouter;
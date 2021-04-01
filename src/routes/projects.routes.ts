/**
 * projects.routes.ts
 *
 * API queries for /projects subroute
 *
 * @module projectsRouter
 */

import { Router, Request, Response } from 'express';

const projectsRouter = Router();

/** GET /projects/all */
projectsRouter.get('/all', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const projects = await db.any(`
            SELECT id, name, description FROM projects`
        );
        return response.json(projects);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /projects/get/:id */
projectsRouter.get('/get/:id', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const projects = await db.any(`
            SELECT id, name, description FROM projects
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json(projects);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /projects/add */
projectsRouter.post('/add', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO projects( name, description )
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

/** DELETE /projects/delete */
projectsRouter.delete('/delete/:id', async (request:Request, response:Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.result(`
            DELETE FROM projects
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

export default projectsRouter;
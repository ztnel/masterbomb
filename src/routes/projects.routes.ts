import express from 'express';
import { Router } from 'express';

const projectsRouter = Router();

// /** Render suppliers page */
// projectsRouter.get('/', (_, response:express.Response) => {
//     response.render('suppliers', {title: 'Suppliers'});
// });

/** GET /suppliers/all */
projectsRouter.get('/all', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const suppliers = await db.any(`
            SELECT * FROM projects`
        );
        return response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /projects/get/:id */
projectsRouter.get('/get/:id', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const projects = await db.any(`
            SELECT * FROM projects
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
projectsRouter.post('/add', async (request:express.Request, response:express.Response) => {
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
projectsRouter.delete('/delete/:id', async (request:express.Request, response:express.Response) => {
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
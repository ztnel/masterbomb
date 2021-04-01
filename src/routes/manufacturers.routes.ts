import express from 'express';
import { Router } from 'express';

const manufacturersRouter = Router();

/** GET /manufacturers/all */
manufacturersRouter.get('/all', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const manufacturers = await db.any(`
            SELECT name FROM manufacturers`
        );
        return response.json(manufacturers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /manufacturers/get/:id */
manufacturersRouter.get('/get/:id', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const manufacturers = await db.any(`
            SELECT name FROM manufacturers
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json(manufacturers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /manufacturers/add */
manufacturersRouter.post('/add', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO manufacturers( name )
            VALUES( $[name] )
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

/** DELETE /manufacturers/delete */
manufacturersRouter.delete('/delete/:id', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.result(`
            DELETE FROM manufacturers
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

export default manufacturersRouter;
import express from 'express';
import { Router } from 'express';

const suppliersRouter = Router();

/** GET /suppliers/all */
suppliersRouter.get('/all', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const suppliers = await db.any(`
            SELECT * FROM suppliers`
        );
        return response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /suppliers/add */
suppliersRouter.get('/add', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO suppliers( name, website )
            VALUES( $[name], $[website] )
            RETURNING id;`,
            {...request.body}
        );
        return response.json({ id });
    } catch (err) {
        // catch errors and log (returning false)
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});


/** DELETE /suppliers/delete */
suppliersRouter.get('/delete/:id', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.result(`
            DELETE FROM suppliers
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

export default suppliersRouter;
import express from 'express';
import { Router } from 'express';

const suppliersRouter = Router();

// /** Render suppliers page */
// suppliersRouter.get('/', (_, response:express.Response) => {
//     response.render('suppliers', {title: 'Suppliers'});
// });

/** GET /suppliers/all */
suppliersRouter.get('/all', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        // FIX: do not query using * in application runtime, explicitly specify cols to reduce db traffic
        const suppliers = await db.any(`
            SELECT id, name, website FROM suppliers`
        );
        return response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** GET /suppliers/get/:id */
suppliersRouter.get('/get/:id', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const suppliers = await db.any(`
            SELECT id, name, website FROM suppliers
            WHERE id = $[id]`,
            { id: request.params.id }, (r:any) => r.rowCount
        );
        return response.json(suppliers);
    } catch (err) {
        console.error(err);
        response.json({error: err.message || err });
        return false;
    }
});

/** POST /suppliers/add */
suppliersRouter.post('/add', async (request:express.Request, response:express.Response) => {
    try {
        // get database passed by request object
        const db = request.app.get('db');
        const id = await db.one(`
            INSERT INTO suppliers( name, website )
            VALUES( $[name], $[website] )
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

/** DELETE /suppliers/delete */
suppliersRouter.delete('/delete/:id', async (request:express.Request, response:express.Response) => {
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
import { Router } from 'express';
import express from 'express';
import suppliersRouter from './suppliers.routes';

const routes = Router();

// connect index router to /suppliers route
routes.use('/suppliers', suppliersRouter);

/* GET home page */
routes.get('/', (_, response:express.Response) => {
    response.render('index', { title: 'Masterbomb' });
});

// export module
export default routes;
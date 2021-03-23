import express from 'express';
import { Router } from 'express';
import suppliersRouter from './suppliers.routes';

const routes = Router();

// connect index router to /suppliers route
routes.use('/suppliers', suppliersRouter);

/* GET home page */
routes.get('/', (request:express.Request, response:express.Response, next:express.NextFunction) => {
    response.render('index', { title: 'Masterbomb' });
});

// export module
export default routes;
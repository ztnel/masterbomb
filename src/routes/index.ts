import { Router } from 'express';
import express from 'express';
import suppliersRouter from './suppliers.routes';
import manufacturersRouter from './manufacturers.routes';
import projectsRouter from './projects.routes';
import partsRouter from './parts.routes';

const routes = Router();

// connect index router to subroutes route
routes.use('/parts', partsRouter);
routes.use('/suppliers', suppliersRouter);
routes.use('/manufacturers', manufacturersRouter);
routes.use('/projects', projectsRouter);

/* GET home page */
routes.get('/', (_req, response:express.Response) => {
    response.render('index', { title: 'Masterbomb' });
});

export default routes;
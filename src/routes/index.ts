import { Router } from 'express';
import express from 'express';
import suppliersRouter from './v1/suppliers';
import manufacturersRouter from './v1/manufacturers';
import projectsRouter from './v1/projects';
import partsRouter from './v1/parts';

const routes = Router();

// connect index router to subroutes route
routes.use('/v1/parts', partsRouter);
routes.use('/v1/suppliers', suppliersRouter);
routes.use('/v1/manufacturers', manufacturersRouter);
routes.use('/v1/projects', projectsRouter);

/* GET home page */
routes.get('/', (_req, response:express.Response) => {
    response.render('index', { title: 'Masterbomb' });
});

export default routes;
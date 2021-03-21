import express from 'express';
import { Router } from 'express';
import usersRouter from './users.routes';

const routes = Router();

// connect index router to /users route
routes.use('/users', usersRouter);

/* GET home page */
routes.get('/', (request:express.Request, response:express.Response, next:express.NextFunction) => {
  response.render('index', { title: 'Masterbomb' });
});

// export module
export default routes;
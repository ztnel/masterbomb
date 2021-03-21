import { Router } from 'express';
import usersRouter from './users.routes';

const routes = Router();

// connect index router to /users route
routes.use('/users', usersRouter);

// export module
export default routes;
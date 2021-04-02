import { Router } from 'express';
import suppliersRouter from './v1/routes/suppliers';
import manufacturersRouter from './v1/routes/manufacturers';
import projectsRouter from './v1/routes/projects';
import partsRouter from './v1/routes/parts';

const apiRoutes = Router();

// connect index router to subroutes route
apiRoutes.use('/v1/parts', partsRouter);
apiRoutes.use('/v1/suppliers', suppliersRouter);
apiRoutes.use('/v1/manufacturers', manufacturersRouter);
apiRoutes.use('/v1/projects', projectsRouter);

export default apiRoutes;
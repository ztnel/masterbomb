import express from 'express'
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', (request:express.Request, response:express.Response) => {
    response.send("Hello from users route");
});

export default usersRouter;
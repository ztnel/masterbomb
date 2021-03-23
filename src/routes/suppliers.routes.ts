import express from 'express'
import { Router } from 'express';
import pgPromise from "pg-promise";

const suppliersRouter = Router();

const config = {
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port,
    user: process.env.PGUSER || "postgres"
}

suppliersRouter.get('/', (request:express.Request, response:express.Response) => {
    response.send("Hello from suppliers route");
});

export default suppliersRouter;
import express from 'express';
import { NextFunction, Response, Request } from 'express';
import createError from 'http-errors';
import path from "path";
import pageRoutes from './routes';
import apiRoutes from './api';
import { connect_db } from './db';
import dotenv from "dotenv";


// load environment settings
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

// need to validate the types on the process.env vars
if (process.env.PGDATABASE === undefined ||
    process.env.PGHOST === undefined ||
    process.env.PGPORT === undefined ||
    process.env.PGUSER === undefined) {
    throw new Error("Database configuration fields invalid. Please check the .env file in root");
}

// configure db
connect_db(process.env.PGDATABASE, process.env.PGHOST, process.env.PGPORT, process.env.PGUSER);

const app = express();
// setup view engine
app.set('views', path.join(__dirname, '../dist/views'));
app.set('view engine', 'ejs');

// add logger middleware to express app
app.use((request:Request, _res, next:NextFunction) => {
    console.log(`${request.method} ${request.path}`);
    next();
});
// use express types (make sure this is defined in front of the routes!)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// bind statics to app
app.use(express.static(path.join(__dirname, 'public')));
// add page routes
app.use(pageRoutes);
app.use(apiRoutes);
// start webserver
app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
});

app.use((_req, _res, next:NextFunction) => {
    // forward 404 error
    next(createError(404));
});

// custom error handler
app.use((err:createError.HttpError, request:Request, response:Response) => {
    // set locals, only providing error in development
    response.locals.message = err.message;
    response.locals.error = request.app.get('NODE_ENV') === 'development' ? err : {};
    // render the error page
    response.status(err.status || 500);
    response.render('error');
});
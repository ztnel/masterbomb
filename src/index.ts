import express from 'express';
import createError from 'http-errors'
import path from "path";
import routes from './routes';
import dotenv from "dotenv";

dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.SERVER_PORT;

// log to console the requests that are made
function loggerMiddleware(request:express.Request, response:express.Response, next:express.NextFunction) {
  console.log("Logging middleware: " + `${request.method} ${request.path}`);
  next();
}

const app = express();
// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// add logger middleware to express app
app.use(loggerMiddleware);
// add all routes to app
app.use(routes);
// use express types
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// bind statics to app
app.use(express.static(path.join(__dirname, 'src/public')));

// app.get('/', (request:express.Request, response:express.Response, next:express.NextFunction) => {
//   response.render('index', { title: 'Masterbomb' });
// });

app.listen(port, () => {
  console.log(`server started at http://localhost:${ port }`);
});

app.use((request:express.Request, response:express.Response, next:express.NextFunction) => {
  next(createError(404));
});

// custom error handler
app.use((err:createError.HttpError, request:express.Request, response:express.Response) => {
  // set locals, only providing error in development
  response.locals.message = err.message;
  response.locals.error = request.app.get('NODE_ENV') === 'development' ? err : {};
  // render the error page
  response.status(err.status || 500);
  response.render('error');
})
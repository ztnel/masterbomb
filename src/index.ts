import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';


// log to console the requests that are made
function loggerMiddleware(request:express.Request, response:express.Response, next:express.NextFunction) {
  console.log("Logging middleware: " + `${request.method} ${request.path}`);
  next();
}


const app = express();
// add logger middleware to express app
app.use(loggerMiddleware)
// add body parser to access request body
app.use(bodyParser.json());
// add all routes to app
app.use(routes);

// app.post('/', (request:express.Request, response:express.Response) => {
//   response.send(request.body);
// });

app.listen(5000, () => {
  console.log('Server started');
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const shelljs_1 = __importDefault(require("shelljs"));
shelljs_1.default.cp("-R", "src/views", "dist/");
dotenv_1.default.config();
const port = process.env.SERVER_PORT;
function loggerMiddleware(request, response, next) {
    console.log("Logging middleware: " + `${request.method} ${request.path}`);
    next();
}
const app = express_1.default();
app.set('views', path_1.default.join(__dirname, '../dist/views'));
app.set('view engine', 'ejs');
app.use(loggerMiddleware);
app.use(routes_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'src/public')));
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
app.use((request, response, next) => {
    next(http_errors_1.default(404));
});
app.use((err, request, response) => {
    response.locals.message = err.message;
    response.locals.error = request.app.get('NODE_ENV') === 'development' ? err : {};
    response.status(err.status || 500);
    response.render('error');
});
//# sourceMappingURL=index.js.map
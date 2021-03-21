"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
function loggerMiddleware(request, response, next) {
    console.log("Logging middleware: " + `${request.method} ${request.path}`);
    next();
}
const app = express_1.default();
app.use(loggerMiddleware);
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.listen(5000, () => {
    console.log('Server started');
});
//# sourceMappingURL=index.js.map
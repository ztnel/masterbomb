"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users.routes"));
const routes = express_1.Router();
routes.use('/users', users_routes_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map
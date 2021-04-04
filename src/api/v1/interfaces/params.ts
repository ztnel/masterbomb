import { ParamsDictionary } from 'express-serve-static-core'

// basic parameter type
export type ReqParam = {
    id: number;
} & ParamsDictionary;

// define basic type guard
export function type_guard(params:ParamsDictionary): params is ReqParam {
    return !isNaN(parseInt(params.id, 10));
}
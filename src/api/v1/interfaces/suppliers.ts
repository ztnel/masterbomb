import { Request } from 'express-serve-static-core';
import { ParamsDictionary } from 'express-serve-static-core';

export type SuppliersParams = {
    id: number;
} & ParamsDictionary;

export interface SuppliersRequest extends Request {
    params: SuppliersParams;
}

// define basic type guard
export function type_guard(params:ParamsDictionary): params is SuppliersParams {
    return !isNaN(parseInt(params.id, 10));
}

/**
 * bom.routes.ts
 *
 * API queries for /bom subroute
 *
 * @module bomRouter
 */

import { errors } from 'pg-promise';
import { Router, Request, Response } from 'express';
import { postgres } from '../../../db';

const bomRouter = Router();

/** GET /v1/bom/?project_id=<int> */
bomRouter.get('/', async (request:Request, response:Response):Promise<Response> => {
    try {
        const db = postgres.get_db();
        const bom = await db.any(`
            SELECT parts.name AS "Part Name",
            (SELECT name AS "Supplier" FROM suppliers WHERE id=parts.supplier_id),
            (SELECT name AS "Manufacturer" FROM manufacturers WHERE id=parts.manufacturer_id),
            bom.quantity AS "Quantity", bom.net_price AS "Net Price" FROM bom JOIN parts on bom.part_id=parts.id
            WHERE project_id=$[project_id]`,
            {...request.query}
        );
        response.status(200).json(bom);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message || err });
    }
    return response;
});

/** POST /v1/bom/ */
bomRouter.post('/', async (request:Request, response:Response):Promise<Response> => {
    const db = postgres.get_db();
    try{
        const unitPrice = await db.one(`
            SELECT unit_price FROM parts WHERE id=$[part_id];`,
            {...request.body}
        );
        // FIX: not type safe!
        request.body.net_price = parseInt(request.body.quantity,10) * parseFloat(unitPrice.unit_price);
        console.log({...request.body});
        const id = await db.any(`
            INSERT INTO bom( project_id, part_id, quantity, net_price)
            VALUES( $[project_id], $[part_id], $[quantity], $[net_price] );`,
            {...request.body},
        );
        response.status(201).json(id);
    } catch (err) {
        console.error(err);
        if (err instanceof errors.QueryResultError) {
            response.status(404).json({error: 'Part not found'});
        } else {
            response.status(500).json({error: 'The server experienced an internal error'});
        }
    }
    return response;
});

export default bomRouter;
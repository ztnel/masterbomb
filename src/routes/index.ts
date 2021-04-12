import { Router } from 'express';
import express from 'express';
import axios from 'axios';
import { ISuppliers } from 'api/v1/interfaces/suppliers';

const pageRoutes = Router();

/* GET home page */
pageRoutes.get('/', (_req, response:express.Response) => {
    response.render('pages/index', { title: 'Masterbomb' });
});

/* GET parts page */
pageRoutes.get('/bom', (_req, response:express.Response) => {
    response.render('pages/bom', { title: 'Bill of Materials' });
});

/* GET parts page */
pageRoutes.get('/parts', (_req, response:express.Response) => {
    response.render('pages/parts', { title: 'Parts' });
});

/* GET projects page */
pageRoutes.get('/projects', (_req, response:express.Response) => {
    response.render('pages/projects', { title: 'Projects' });
});

/* GET suppliers page */
pageRoutes.get('/suppliers', (_req, response:express.Response) => {
    // axios request for all suppliers
    axios.get<ISuppliers[]>("http://localhost:3000/v1/suppliers", {
        headers: {"Content-Type": "application/json"}
    }).then(axios_response => {
        // pass ejs the supplier list
        response.render('pages/suppliers',
            { title: 'Suppliers', suppliers: axios_response.data }
        );
    });

});

/* GET manufacturers page */
pageRoutes.get('/manufacturers', (_req, response:express.Response) => {
    response.render('pages/manufacturers', { title: 'Manufacturers' });
});

export default pageRoutes;
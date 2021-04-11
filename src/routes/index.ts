import { Router } from 'express';
import express from 'express';

const pageRoutes = Router();

/* GET home page */
pageRoutes.get('/', (_req, response:express.Response) => {
    response.render('pages/index', { title: 'Masterbomb' });
});

/* GET parts page */
pageRoutes.get('/parts', (_req, response:express.Response) => {
    response.render('pages/parts', { title: 'Parts List' });
});

/* GET projects page */
pageRoutes.get('/projects', (_req, response:express.Response) => {
    response.render('pages/projects', { title: 'Project List' });
});

/* GET suppliers page */
pageRoutes.get('/suppliers', (_req, response:express.Response) => {
    response.render('pages/suppliers', { title: 'Supplier List' });
});

/* GET manufacturers page */
pageRoutes.get('/manufacturers', (_req, response:express.Response) => {
    response.render('pages/manufacturers', { title: 'Manufacturers List' });
});

export default pageRoutes;
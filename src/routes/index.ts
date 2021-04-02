import { Router } from 'express';
import express from 'express';

const pageRoutes = Router();

/* GET home page */
pageRoutes.get('/', (_req, response:express.Response) => {
    response.render('index', { title: 'Masterbomb' });
});

export default pageRoutes;
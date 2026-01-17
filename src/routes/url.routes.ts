import { Router } from 'express';
import getAllUrlsRoute from './urls/get-all-urls.route';
import getUrlByIdRoute from './urls/get-url-by-id.route';
import createUrlRoute from './urls/create-url.route';
import updateUrlRoute from './urls/update-url.route';
import deleteUrlRoute from './urls/delete-url.route';

const router = Router();

// Combine all URL routes
router.use('/', getAllUrlsRoute);
router.use('/', getUrlByIdRoute);
router.use('/', createUrlRoute);
router.use('/', updateUrlRoute);
router.use('/', deleteUrlRoute);

export default router;

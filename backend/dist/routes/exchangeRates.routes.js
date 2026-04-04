import { Router } from 'express';
import { createExchangeRate, deleteExchangeRate, listExchangeRates, updateExchangeRate } from '../controllers/exchangeRates.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
export const exchangeRatesRouter = Router();
exchangeRatesRouter.use(requireAuth);
exchangeRatesRouter.use(requireRole(['admin', 'editor']));
exchangeRatesRouter.get('/', listExchangeRates);
exchangeRatesRouter.post('/', createExchangeRate);
exchangeRatesRouter.put('/:id', updateExchangeRate);
exchangeRatesRouter.delete('/:id', deleteExchangeRate);
//# sourceMappingURL=exchangeRates.routes.js.map
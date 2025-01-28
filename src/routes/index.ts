import { Router } from 'express';
import passport from 'passport';
import PropertyRentRouter from './property.rent.api.actions';
import PropertySellRouter from './property.sell.api.actions';
import AgentRouter from './agent.api';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/agent', AgentRouter);

router.use('/properties/rents', PropertyRentRouter);
router.use('/properties/sell', PropertySellRouter);

// Add one more middleware namely `authorize` after passport.authenticate to authorize user for access
// console `req.user` and `req` in authorize middleware
// router.use('/property-rent', passport.authenticate('jwt', {session: false}), PropertyRentRouter);

// Export the base-router
export default router;

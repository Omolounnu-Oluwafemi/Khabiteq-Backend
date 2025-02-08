import { NextFunction, Request, Response, Router } from 'express';

import { AgentController, DB } from '../controllers';
import validator from '../common/validator';
import HttpStatusCodes from '../common/HttpStatusCodes';
import { PropertyRent, PropertySell } from '../models';

// Init shared
const router = Router();
const agentControl = new AgentController();

/******************************************************************************
 *                      add user - "POST /api/auth/register"
 ******************************************************************************/

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, phoneNumber } = validator.validate(req.body, 'agentSignupSchema');

    const response = await agentControl.signup(email, req.body.password, firstName, lastName, phoneNumber);
    const { password, ...newUser } = response;
    return res.status(200).json(newUser);
  } catch (error) {
    // console.log('error', error);
    next(error);
    // return res.status(400).json(error);
  }
});

/******************************************************************************
 *                      add user - "POST /api/auth/register/google"
 ******************************************************************************/

router.post('/signup/google', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = validator.validate(req.body, 'googleSignupSchema');
    const googleUserInfo = await agentControl.googleSignup(idToken);
    return res.status(200).json(googleUserInfo);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                      get user - "GET /api/login/google"
 ******************************************************************************/

router.get('/login/google', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = validator.validate(req.body, 'googleSignupSchema');
    const googleUserInfo = await agentControl.googleSignup(idToken as string);
    return res.status(200).json(googleUserInfo);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                      onboard agent - "POST /api/auth/onboard"
 ******************************************************************************/

router.put('/onboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, address, regionOfOperation, agentType, companyAgent, individualAgent, doc } = validator.validate(
      req.body,
      'agentOnboardSchema'
    );

    console.log('Body Request', req.body);

    const response = await agentControl.onboard(
      email,
      address,
      regionOfOperation,
      agentType,
      companyAgent,
      individualAgent,
      doc
    );
    return res.status(HttpStatusCodes.OK).json({
      message: 'Agent information updated successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/******************************************************************************
 *                      get agent auth details - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  let response;
  let status;
  try {
    const reqBody = validator.validate(req.body, 'agentLoginSchema');
    const { user, token } = await agentControl.login({ email: reqBody.email, password: reqBody.password });
    status = 200;

    const { password, ...newUser } = user;
    return res.status(status).json({ user: newUser, token });
  } catch (error) {
    response = error;
    status = 400;
    next(error);
  }
});

router.post('/upload/image', async (req: Request & { file?: any }, res: Response, next: NextFunction) => {
  try {
    const { image } = req.body;
    console.log(req?.file);
    const response = await agentControl.uploadImage(image);
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
});
/******************************************************************************
 *                      add user - "POST /api/auth/register"
 ******************************************************************************/
router.post('/properties', async (req: Request, res: Response, next: NextFunction) => {
  // const {} = req.agent
  try {
    // const properties1 = await DB.Models.PropertyRent.find({ owner: req.agent._id });
    // const properties2 = await DB.Models.PropertySell.find({ owner: req.agent._id });
    // const properties = [...properties1, ...properties2];
    // return res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});
export default router;

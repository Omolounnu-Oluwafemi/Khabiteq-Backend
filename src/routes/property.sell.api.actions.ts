import { NextFunction, Request, Response, Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { PropertySellController } from '../controllers';
import HttpStatusCodes from '../common/HttpStatusCodes';
import validator from '../common/validator';

// Init shared
const router = Router();
const propertySellControl = new PropertySellController();

/******************************************************************************
 *                      Get All propertys - "GET /api/properties/sell/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertys = await propertySellControl.all();
    return res.status(HttpStatusCodes.OK).send(propertys);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                      Get single property - "GET /api/properties/sell/:_id"
 ******************************************************************************/

router.get('/:_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params as ParamsDictionary;
    const property = await propertySellControl.getOne(_id);
    if (!property) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        error: 'Property not found',
      });
    }
    return res.status(HttpStatusCodes.OK).send(property);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                       Add - "POST /api/properties/sell/new"
 ******************************************************************************/

router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyType, location, price, docOnProperty, propertyFeatures, owner, areYouTheOwner, usageOptions } =
      validator.validate(req.body, 'propertySellSchema');

    const response = await propertySellControl.add({
      propertyType,
      location,
      price,
      docOnProperty,
      propertyFeatures,
      owner,
      areYouTheOwner,
      usageOptions,
    });
    return res.status(HttpStatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                       Update - "PUT /api/properties/sell/:_id"
 ******************************************************************************/

router.put('/update/:_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params as ParamsDictionary;
    if (!_id) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: 'Property ID is required',
      });
    }
    const { propertyType, location, price, docOnProperty, propertyFeatures, owner, areYouTheOwner, usageOptions } =
      validator.validate(req.body, 'propertySellSchema');

    const updated = await propertySellControl.update(_id, {
      propertyType,
      location,
      price,
      docOnProperty,
      propertyFeatures,
      owner,
      areYouTheOwner,
      usageOptions,
    });
    return res.status(HttpStatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                    Delete - "DELETE /api/properties/sell/delete/:_id"
 ******************************************************************************/

router.delete('/delete/:_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params as ParamsDictionary;
    await propertySellControl.delete(_id);
    return res.status(HttpStatusCodes.OK).end();
  } catch (error) {
    next(error);
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;

import path from 'path';
import HttpStatusCodes from '../../common/HttpStatusCodes';
import { RouteError } from '../../common/classes';
import { IPropertyRent } from '../../models/index';
import { DB } from '../index';
import Fuse from 'fuse.js';

interface PropertyRentProps {
  propertyType: string;
  propertyCondition: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  rentalPrice: number;
  noOfBedrooms: number;
  features: {
    featureName: string;
  }[];
  tenantCriteria: {
    criteria: string;
  }[];
  owner: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  areYouTheOwner: boolean;
  budgetRange?: string;
  pictures?: string[];
}

interface PropertyRentRequestProps {
  id: string;
  contact: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
}

interface PropertySearchProps {
  propertyType: string;
  propertyCondition: string;
  state: string;
  localGovernment: string;
  area: string;
  noOfBedrooms: number;

  budgetMin: number;
  budgetMax: number;
  features: string;
  tenantCriteria: string;
}

export interface IBuyerOrRentPropertyRentController {
  all: () => Promise<IPropertyRent[]>;
  getOne: (_id: string) => Promise<IPropertyRent | null>;
  add: (PropertyRent: PropertyRentProps) => Promise<IPropertyRent>;
  update: (_id: string, PropertyRent: PropertyRentProps) => Promise<IPropertyRent>;
  delete: (_id: string) => Promise<void>;
}

export class BuyerOrRentPropertyRentController implements IBuyerOrRentPropertyRentController {
  /**
   * @param id
   */
  public async getOne(_id: string): Promise<IPropertyRent | null> {
    try {
      const data = await DB.Models.PropertyRent.find({ _id }).exec();
      if (data) {
        return data[0];
      }
      throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Property Not Found');
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   *
   */
  public async all(): Promise<IPropertyRent[]> {
    try {
      const data = await DB.Models.PropertyRent.find({}).populate({
        path: 'owner',
        refPath: 'ownerModel',
        select: 'fullName phoneNumber email firstName lastName',
      });
      return data;
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   *
   * @param PropertyRent
   */
  public async add(PropertyRent: PropertyRentProps): Promise<IPropertyRent> {
    try {
      let owner = await DB.Models.BuyerOrRent.findOne({ email: PropertyRent.owner.email }).exec();
      if (!owner) {
        owner = await DB.Models.BuyerOrRent.create({
          ...PropertyRent.owner,
          ownerType: 'Rent',
        });
      }
      const newPropertyRent = await DB.Models.PropertyRent.create({
        ...PropertyRent,
        owner: owner._id,
        ownerModel: 'BuyerOrRenter',
      });
      return newPropertyRent;
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   * @param PropertyRent
   * @param _id
   */
  public async update(_id: string, PropertyRent: PropertyRentProps): Promise<IPropertyRent> {
    try {
      const owner =
        (await DB.Models.BuyerOrRent.findOne({ email: PropertyRent.owner.email }).exec()) ||
        (await DB.Models.Agent.findOne({ email: PropertyRent.owner.email }).exec());
      if (!owner) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Owner not found');
      const property = await DB.Models.PropertyRent.findOneAndUpdate(
        { _id },
        { ...PropertyRent, owner: owner._id },
        {
          new: true,
        }
      ).exec();

      if (!property) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Property not found');

      return property;
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   *
   * @param id
   */
  public async delete(_id: string): Promise<void> {
    try {
      await DB.Models.PropertyRent.findByIdAndDelete({ _id }).exec();
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   * Fuzzy Searching
   */

  public async getPropertiesFuzzy(PropertySearch: PropertySearchProps) {
    try {
      // const { propertyType, location, budgetMin, budgetMax, features } = PropertySearch;

      // const properties = await DB.Models.PropertyRent.find({
      //   ...(budgetMin || budgetMax
      //     ? { price: { ...(budgetMin ? { $gte: budgetMin } : {}), ...(budgetMax ? { $lte: budgetMax } : {}) } }
      //     : {}),
      // });

      // console.log(properties);

      // const fuse = new Fuse(properties, {
      //   keys: [
      //     'propertyType',
      //     'location.state',
      //     'location.localGovernment',
      //     'location.area',
      //     'propertyFeatures.additionalFeatures',
      //   ],
      //   threshold: 0.4, // Lower means stricter match
      // });

      // console.log(fuse);

      // const results = fuse.search(
      //   `${propertyType} ${location?.state} ${location?.localGovernment} ${location?.area} ${features}`
      // );

      // return results.map((result) => result.item);

      // Match exact property type

      const {
        propertyType,
        propertyCondition,
        state,
        localGovernment,
        area,
        budgetMin,
        budgetMax,
        noOfBedrooms,
        features,
        tenantCriteria,
      } = PropertySearch;

      const query: any = {};

      if (propertyType) query.propertyType = propertyType;

      // Match exact property condition
      if (propertyCondition) query.propertyCondition = propertyCondition;

      // Match location (state, local government, area)
      if (state) query['location.state'] = state;
      if (localGovernment) query['location.localGovernment'] = localGovernment;
      if (area) query['location.area'] = area;

      // Price range filter
      if (budgetMin || budgetMax) {
        query.rentalPrice = {};
        if (budgetMin) query.rentalPrice.$gte = Number(budgetMin);
        if (budgetMax) query.rentalPrice.$lte = Number(budgetMax);
      }

      // Number of bedrooms filter
      if (noOfBedrooms) {
        query.noOfBedrooms = {};
        query.noOfBedrooms.$gte = Number(noOfBedrooms);
      }

      // Features filter (matches if at least one feature exists)
      if (features) {
        const featuresArray = Array.isArray(features) ? features : [features];
        query.features = { $elemMatch: { featureName: { $in: featuresArray } } };
      }

      // Tenant criteria filter
      if (tenantCriteria) {
        const criteriaArray = Array.isArray(tenantCriteria) ? tenantCriteria : [tenantCriteria];
        query.tenantCriteria = { $elemMatch: { criteria: { $in: criteriaArray } } };
      }

      query.isAvailable = true;

      // Execute the query
      const properties = await DB.Models.PropertyRent.find(query);

      return properties;
    } catch (error) {
      console.error(error);
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  public async requestProperty(PropertyRent: PropertyRentRequestProps) {
    try {
      const property = await DB.Models.PropertyRent.findOne({ _id: PropertyRent.id }).exec();
      if (!property) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Property not found');
      if (!property.isAvailable) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Property is not available');
    } catch (error) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}

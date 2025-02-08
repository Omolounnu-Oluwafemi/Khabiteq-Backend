import HttpStatusCodes from '../../common/HttpStatusCodes';
import { RouteError } from '../../common/classes';
import { IPropertySell } from '../../models/index';
import { DB } from '../index';

interface PropertySellProps {
  propertyType: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  price: number;
  docOnProperty: {
    docName: string;
    isProvided: boolean;
  }[];
  propertyFeatures: {
    noOfBedrooms: number;
    additionalFeatures: string[];
  };
  owner: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  areYouTheOwner: boolean;
  usageOptions: string[];
  budgetRange?: string;
  pictures?: string[];
}

export interface IBuyerOrRentPropertySellController {
  all: () => Promise<IPropertySell[]>;
  getOne: (_id: string) => Promise<IPropertySell | null>;
  add: (PropertySell: PropertySellProps) => Promise<IPropertySell>;
  update: (_id: string, PropertySell: PropertySellProps) => Promise<IPropertySell>;
  delete: (_id: string) => Promise<void>;
}

export class BuyerOrRentPropertySellController implements IBuyerOrRentPropertySellController {
  /**
   * @param id
   */
  public async getOne(_id: string): Promise<IPropertySell | null> {
    try {
      const data = await DB.Models.PropertySell.find({ _id }).exec();
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
  public async all(): Promise<IPropertySell[]> {
    try {
      const data = await DB.Models.PropertySell.find({}).exec();
      return data;
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   *
   * @param PropertySell
   */
  public async add(PropertySell: PropertySellProps): Promise<IPropertySell> {
    try {
      let owner = await DB.Models.BuyerOrRent.findOne({ email: PropertySell.owner.email }).exec();
      const agent = await DB.Models.Agent.findOne({ email: PropertySell.owner.email }).exec();
      if (!owner && !agent) {
        owner = await DB.Models.BuyerOrRent.create({
          ...PropertySell.owner,
          ownerType: 'Buyer',
        });
      } else if (agent && !owner) {
        owner = agent as any;
      }
      const newPropertySell = await DB.Models.PropertySell.create({
        ...PropertySell,
        owner: owner._id,
        ownerModel: 'Request',
      });
      return newPropertySell;
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }

  /**
   * @param PropertySell
   * @param _id
   */
  public async update(_id: string, PropertySell: PropertySellProps): Promise<IPropertySell> {
    try {
      const owner =
        (await DB.Models.BuyerOrRent.findOne({ email: PropertySell.owner.email }).exec()) ||
        (await DB.Models.Agent.findOne({ email: PropertySell.owner.email }).exec());
      if (!owner) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Owner not found');
      const property = await DB.Models.PropertySell.findOneAndUpdate(
        { _id },
        { ...PropertySell, owner: owner._id },
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
      await DB.Models.PropertySell.findByIdAndDelete({ _id }).exec();
    } catch (err) {
      throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  }
}

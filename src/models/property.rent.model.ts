import { Schema, model, Document, Model, ObjectId, Types } from 'mongoose';
import { propertyRent } from '../common/constants';

export interface IPropertyRent {
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
  owner: ObjectId;
  ownerModel: string;
  areYouTheOwner?: boolean;
}

export interface IPropertyRentDoc extends IPropertyRent, Document {}

export type IPropertyRentModel = Model<IPropertyRentDoc>;

export class PropertyRent {
  private propertyRentModel: Model<IPropertyRentDoc>;

  constructor() {
    const schema = new Schema(
      {
        propertyType: { type: String, required: true, enum: Object.values(propertyRent.getPropertyType) },
        propertyCondition: { type: String, required: true, enum: Object.values(propertyRent.getPropertyCondition) },
        location: {
          state: { type: String, required: true },
          localGovernment: { type: String, required: true },
          area: { type: String, required: true },
        },
        rentalPrice: { type: Number, required: true },
        noOfBedrooms: { type: Number, required: true },
        features: [
          {
            featureName: { type: String, required: true, enum: Object.values(propertyRent.getPropertyFeatures) },
          },
        ],

        tenantCriteria: [
          {
            criteria: { type: String, required: true, enum: Object.values(propertyRent.getTenantCriteria) },
          },
        ],

        owner: { type: Types.ObjectId, required: true, refPath: 'ownerModel' },

        ownerModel: {
          type: String,
          required: true,
          enum: ['PropertyOwner', 'Agent'],
        },
        areYouTheOwner: { type: Boolean, default: false },
      },
      {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
      }
    );

    this.propertyRentModel = model<IPropertyRentDoc>('PropertyRent', schema);
  }

  public get model(): Model<IPropertyRentDoc> {
    return this.propertyRentModel;
  }
}

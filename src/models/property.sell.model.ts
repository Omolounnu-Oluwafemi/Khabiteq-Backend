import { Schema, model, Document, Model, ObjectId, Types } from 'mongoose';
import { propertySell } from '../common/constants';

export interface IPropertySell {
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

  owner: ObjectId;
  ownerModel: string;
  areYouTheOwner?: boolean;
}

export interface IPropertySellDoc extends IPropertySell, Document {}

export type IPropertySellModel = Model<IPropertySellDoc>;

export class PropertySell {
  private propertySellModel: Model<IPropertySellDoc>;

  constructor() {
    const schema = new Schema(
      {
        propertyType: { type: String, required: true, enum: Object.values(propertySell.getPropertyType) },
        location: {
          state: { type: String, required: true },
          localGovernment: { type: String, required: true },
          area: { type: String, required: true },
        },
        price: { type: Number, required: true },
        docOnProperty: [
          {
            docName: { type: String, required: true, enum: Object.values(propertySell.getDocOnProperty) },
            isProvided: { type: Boolean, required: true },
          },
        ],
        propertyFeatures: {
          noOfBedrooms: { type: Number, required: true },
          additionalFeatures: [{ type: String }],
        },
        owner: { type: Types.ObjectId, required: true, refPath: 'ownerModel' },

        ownerModel: {
          type: String,
          required: true,
          enum: ['PropertyOwner', 'Agent'],
        },
        areYouTheOwner: { type: Boolean, default: false },
      },
      {
        timestamps: true,
      }
    );

    this.propertySellModel = model<IPropertySellDoc>('PropertySell', schema);
  }

  public get model(): Model<IPropertySellDoc> {
    return this.propertySellModel;
  }
}

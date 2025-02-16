import { Schema, model, Document, Model } from 'mongoose';
import { propertyOwner } from '../common/constants';

export interface IPropertyRequest {
  propertyId: string;
  requestFrom: string;
  status: string;
  propertyModel: 'PropertySell' | 'PropertyRent';
  inspectionDate?: Date;
}

export interface IPropertyRequestDoc extends IPropertyRequest, Document {}

export type IPropertyRequestModel = Model<IPropertyRequestDoc>;

export class PropertyRequest {
  private generalModel: Model<IPropertyRequestDoc>;

  constructor() {
    const schema = new Schema(
      {
        propertyId: { type: Schema.Types.ObjectId, refPath: 'propertyModel', required: true },
        requestFrom: { type: Schema.Types.ObjectId, ref: 'BuyerOrRenter', required: true },
        status: { type: String, required: true, enum: ['Pending', 'Accepted', 'Rejected'] },
        propertyModel: { type: String, required: true, enum: ['PropertySell', 'PropertyRent'] },
        inspectionDate: { type: Date },
      },
      {
        timestamps: true,
      }
    );

    this.generalModel = model<IPropertyRequestDoc>('PropertyRequest', schema);
  }

  public get model(): Model<IPropertyRequestDoc> {
    return this.generalModel;
  }
}

import { agentNotificationTemplate, inspectionScheduledTemplate } from '../../common/email.template';
import { DB } from '..';
import sendEmail from '../../common/send.email';
import path from 'path';
import { propertyRequestTemplate } from '../../common/email.template';
import { RouteError } from '../../common/classes';
import HttpStatusCodes from '../../common/HttpStatusCodes';

interface IPropertyRequest {
  propertyId: string;
  requestFrom: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  propertyType: 'PropertySell' | 'PropertyRent';
}

export interface IPropertRequestController {
  requestProperty: (PropertyRequest: IPropertyRequest) => Promise<void>;
}

export class PropertyRequestController implements IPropertRequestController {
  public async requestProperty(PropertyRequest: IPropertyRequest): Promise<void> {
    const { propertyId, requestFrom, propertyType } = PropertyRequest;
    const property = await DB.Models[propertyType]
      .findById(propertyId)
      .populate({
        path: 'owner',
        select: 'email fullName',
      })
      .exec();
    if (!property) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Property not found');
    }

    let requestFrm = await DB.Models.BuyerOrRent.findOne({ email: requestFrom.email }).exec();

    if (!requestFrm) {
      requestFrm = await DB.Models.BuyerOrRent.create({
        ...requestFrom,
        ownerType: propertyType === 'PropertySell' ? 'Buyer' : 'Rent',
      });
    }
    await new DB.Models.PropertyRequest({
      propertyId,
      requestFrom: requestFrm._id,
      status: 'Pending',
      propertyModel: propertyType,
    }).save();

    const mailBodyAgent = agentNotificationTemplate(
      (property.owner as any).email as string,
      `${property.location.area}, ${property.location.localGovernment}, ${property.location.state}`
    );

    const mailBodyRequester = propertyRequestTemplate(
      requestFrom.fullName,
      `${property.location.area}, ${property.location.localGovernment}, ${property.location.state}`
    );

    // const adminMailBody =

    await sendEmail({
      to: (property.owner as any).email,
      subject: 'Confirm Property Availability for Inspection',
      text: 'Confirm Property Availability for Inspection',
      html: mailBodyAgent,
    });

    await sendEmail({
      to: requestFrom.email,
      subject: 'Your Inspection Request is Being Processed',
      text: 'Your Inspection Request is Being Processed',
      html: mailBodyRequester,
    });
  }

  public async scheduleInspection(propertyRequestId: string, inspectionDate: Date): Promise<void> {
    const propertyRequest = await DB.Models.PropertyRequest.findById(propertyRequestId).exec();
    if (!propertyRequest) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Property Request not found');
    }
    propertyRequest.inspectionDate = inspectionDate;

    const property = await DB.Models[propertyRequest.propertyModel]
      .findById(propertyRequest.propertyId)
      .populate({
        path: 'owner',
        select: 'email fullName',
      })
      .exec();

    const mailBody = inspectionScheduledTemplate(
      (property.owner as any).email as string,
      `${property.location.area}, ${property.location.localGovernment}, ${property.location.state}`,
      inspectionDate as any
    );

    await propertyRequest.save();

    console.log(property);

    await sendEmail({
      to: (property.owner as any).email,
      subject: `Inspection Scheduled for ${property.location.area}, ${property.location.localGovernment}, ${property.location.state}`,
      text: `Inspection Scheduled for ${property.location.area}, ${property.location.localGovernment}, ${property.location.state}`,
      html: mailBody,
    });
  }
}

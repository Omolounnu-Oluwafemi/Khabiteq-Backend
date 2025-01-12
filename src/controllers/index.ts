import { connect, connection, Connection } from 'mongoose';
import {
  IPropertySellModel,
  IPropertyRentModel,
  PropertyRent,
  PropertySell,
  IAgentModel,
  Agent,
} from '../models/index';
import { IOwnerModel, Owner } from '../models/property.owner';

declare interface IModels {
  PropertySell: IPropertySellModel;
  PropertyRent: IPropertyRentModel;
  Owner: IOwnerModel;
  Agent: IAgentModel;
}

export class DB {
  private static instance: DB;

  private mongoDB: Connection;
  private models: IModels;

  constructor() {
    try {
      connect(process.env.MONGO_URL as string, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err, 'Error connecting to MongoDB');
    }
    this.mongoDB = connection;
    this.mongoDB.on('open', this.connected);
    this.mongoDB.on('error', this.error);

    this.models = {
      PropertyRent: new PropertyRent().model,
      PropertySell: new PropertySell().model,
      Owner: new Owner().model,
      Agent: new Agent().model,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance.models;
  }

  private connected() {
    console.info('Mongoose has connected');
  }

  private error(error: Error) {
    console.info('Mongoose has errored', error);
  }
}

export { AgentController, IAgentController } from './Agent';
export { PropertyRentController, IPropertyRentController } from './Property.Rent';
export { PropertySellController, IPropertySellController } from './Property.Sell';

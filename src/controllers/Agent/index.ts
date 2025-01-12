/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { IAgent } from '../../models/index';
import { DB } from '../index';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { otherConstants } from '../../common/constants';
import { RouteError, signJwt } from '../../common/classes';
import HttpStatusCodes from '../../common/HttpStatusCodes';
import validator from '../../common/validator';

export interface IAgentController {
  signup: (
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    phoneNumber: string
  ) => Promise<IAgent>;
  login: (agentCredential: { email: string; password: string }) => Promise<any>;
  onboard: (
    email: string,
    address: {
      street: string;
      city: string;
      state: string;
      localGovtArea: string;
    },
    regionOfOperation: string,
    agentType: string,
    companyAgent: {
      companyName?: string;
      regNUmber?: string;
    },
    individualAgent: {
      typeOfId: string;
      idNumber: string;
    },
    doc: string
  ) => Promise<any>;
}

export class AgentController implements IAgentController {
  public async signup(
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    phoneNumber: string
  ): Promise<IAgent> {
    const checkUser = await DB.Models.Agent.findOne({ email }).exec();
    if (checkUser) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await DB.Models.Agent.create({ email, password: passwordHash, lastName, firstName, phoneNumber });
    return newUser.toObject();
  }

  public async onboard(
    email: string,
    address: {
      street: string;
      city: string;
      state: string;
      localGovtArea: string;
    },
    regionOfOperation: string,
    agentType: string,
    companyAgent: {
      companyName?: string;
      regNUmber?: string;
    },
    individualAgent: {
      typeOfId: string;
      idNumber: string;
    },
    doc: string
  ): Promise<any> {
    let user = await DB.Models.Agent.findOne({ email }).exec();

    if (!user) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User not found');

    if (user.agentType) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User already onboarded');

    if (agentType === 'Company' && companyAgent) {
      user = await DB.Models.Agent.findOneAndUpdate(
        { email },
        {
          address,
          regionOfOperation,
          agentType,
          companyAgent,
          doc,
        },
        { new: true }
      );
    } else if (agentType === 'Individual' && individualAgent) {
      user = await DB.Models.Agent.findOneAndUpdate(
        { email },
        {
          address,
          regionOfOperation,
          agentType,
          individualAgent,
          doc,
        },
        { new: true }
      );
    } else {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Invalid agent type');
    }

    return user.toObject();
  }

  public async login(agentCredential: { email: string; password: string }): Promise<any> {
    try {
      // return new Promise((resolve, reject) => {
      //   passport.authenticate('local', { session: false }, (error: any, user: any) => {
      //     if (error || !user) {
      //       console.log('error', error);
      //       reject(error);
      //       return;
      //     }

      //     /** This is what ends up in our JWT */
      //     const payload = {
      //       email: user,
      //       agentType: user.agentType,
      //     };

      //     /** assigns payload to req.user */

      //     /** generate a signed json web token and return it in the response */
      //     const token = jwt.sign(payload, process.env.JWT_SECRET, {
      //       expiresIn: otherConstants.getConstants().jwtExpire,
      //     });

      //     resolve({ payload, token });
      //   })(req, res);
      // });
      const { email, password } = agentCredential;
      const user = await DB.Models.Agent.findOne({ email });
      if (!user) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Invalid password');

      const payload = {
        email: user.email,
        agentType: user.agentType,
      };

      const token = signJwt(payload);
      return { user: user.toObject(), token: token };
    } catch (err) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, err.message);
    }
  }
}

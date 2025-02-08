/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { IAgent } from '../../models/index';
import { DB } from '../index';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { otherConstants } from '../../common/constants';
import { getMimeType, RouteError, signJwt } from '../../common/classes';
import HttpStatusCodes from '../../common/HttpStatusCodes';
import validator from '../../common/validator';
import cloudinaryApiUpload from '../../common/cloudinary';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

// Define an interface for the response
interface GoogleUserInfo extends TokenPayload {}

async function verifyIdToken(idToken: string): Promise<GoogleUserInfo | null> {
  // console.log(idToken, process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });
    console.log('Ticket:', ticket.getPayload());
    return ticket.getPayload() as GoogleUserInfo;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

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
    doc: string,
    uploadImage: (image: any) => Promise<any>
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

  public async googleSignup(idToken: string): Promise<IAgent> {
    //GOOGLE AUTHENTICATION
    const verifyUserWithGoogle = await verifyIdToken(idToken);

    if (!verifyUserWithGoogle) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Invalid Google Token');
    }

    const { name, picture, email } = verifyUserWithGoogle;

    const userExists = await DB.Models.Agent.findOne({ email });
    console.log('Checking if user exists');
    if (userExists) {
      throw new RouteError(HttpStatusCodes.CONFLICT, 'User already exists');
    }

    const newAgent = await DB.Models.Agent.create({
      email,
      fullName: name,
      profile_picture: picture,
    });

    return newAgent.toObject();
  }

  public async googleLogin(idToken: string): Promise<any> {
    //GOOGLE AUTHENTICATION
    const verifyUserWithGoogle = await verifyIdToken(idToken);

    if (!verifyUserWithGoogle) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Invalid Google Token');
    }

    const { email } = verifyUserWithGoogle;

    const user = await DB.Models.Agent.findOne({ email });
    if (!user) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'User not found');

    const payload = {
      email: user.email,
      agentType: user.agentType,
    };

    const token = signJwt(payload);
    return { user: user.toObject(), token: token };
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

  public async uploadImage(image: any): Promise<any> {
    try {
      const fileName = image.file.originalname;
      console.log('fileName', fileName);
      console.log('image', image);

      if (!image) throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Image not found');
      const mimeType = getMimeType(image);
      // const base64String = `data:${mimeType};base64,${req?.file?.buffer.toString('base64')}`;
      // const imageUrl = await cloudinaryApiUpload.uploadFile(
      //   base64String,
      //   ,
      //   user.accountType
      // );
    } catch (error) {
      console.log(error);
    }
  }
}

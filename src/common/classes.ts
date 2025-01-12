import Joi from 'joi/lib';
import jwt from 'jsonwebtoken';
import HttpStatusCodes from './HttpStatusCodes';

/**
 * Error with status code and message.
 */
export class RouteError extends Error {
  public status: HttpStatusCodes;
  public message2?: string;

  public constructor(status: HttpStatusCodes, message: string, message2?: string) {
    super(message);
    this.status = status;
    this.message2 = message2;

    // Maintain proper stack trace (only for V8 engines like Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * If route validation fails.
 */
export class ValidationErr extends RouteError {
  public static MSG = 'The follow parameter were missing or invalid "';

  public constructor(paramName: string) {
    super(HttpStatusCodes.BAD_REQUEST, ValidationErr.GetMsg(paramName));
  }

  public static GetMsg(param: string) {
    return ValidationErr.MSG + param + '".';
  }
}

export const validateRequestData = (data: any, schemaFunc: any) => {
  const error = schemaFunc;
  if (error) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, error.message);
  }

  return data;
};

export const signJwt = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
};

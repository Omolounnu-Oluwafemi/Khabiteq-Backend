import joi from 'joi';
import { propertyRent, propertySell } from '../constants';
import { RouteError } from '../classes';
import HttpStatusCodes from '../HttpStatusCodes';
import { joiPasswordExtendCore } from 'joi-password';
const joiPassword = joi.extend(joiPasswordExtendCore);

enum validatorSchemaNames {
  agentSignupSchema = 'agentSignupSchema',
  agentLoginSchema = 'agentLoginSchema',
  agentOnboardSchema = 'agentOnboardSchema',
  propertySellSchema = 'propertySellSchema',
  propertyRentSchema = 'propertyRentSchema',
}

class Validator {
  private passwordRegex;

  constructor() {
    this.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
  }

  private agentSignupSchema = joi.object({
    email: joi.string().email().required(),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(2)
      .minOfLowercase(2)
      .minOfUppercase(2)
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .doesNotInclude(['password'])
      .required(),
    lastName: joi.string().required(),
    firstName: joi.string().required(),
    phoneNumber: joi.string().required(),
  });

  private agentLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  private agentOnboardSchema = joi.object({
    email: joi.string().email().required(),
    address: joi.object({
      street: joi.string().required(),
      city: joi.string().required(),
      state: joi.string().required(),
      localGovtArea: joi.string().required(),
    }),
    regionOfOperation: joi.string().required(),
    agentType: joi.string().valid('Individual', 'Company').required(),
    companyAgent: joi.object({
      companyName: joi.string().required(),
      regNumber: joi.string().required(),
    }),
    individualAgent: joi
      .object({
        typeOfId: joi.string().required(),
        idNumber: joi.string().required(),
      })
      .optional(),
    doc: joi.string().required(),
  });

  private propertySellSchema = joi.object({
    propertyType: joi
      .string()
      .required()
      .valid(...Object.values(propertySell.getPropertyType)),
    location: joi.object({
      state: joi.string().required(),
      localGovernment: joi.string().required(),
      area: joi.string().required(),
    }),
    price: joi.number().required(),
    docOnProperty: joi
      .array()
      .items(
        joi.object({
          docName: joi
            .string()
            .required()
            .valid(...Object.values(propertySell.getDocOnProperty)),
          isProvided: joi.boolean().required(),
        })
      )
      .required(),
    propertyFeatures: joi
      .object({
        noOfBedrooms: joi.number().required(),
        additionalFeatures: joi.array().items(joi.string()).optional(),
      })
      .required(),
    areYouTheOwner: joi.boolean().required(),
    owner: joi
      .object({
        fullName: joi.string().required(),
        phoneNumber: joi.string().required(),
        email: joi.string().required(),
      })
      .required(),
    usageOptions: joi.array().items(
      joi
        .string()
        .valid(...Object.values(propertySell.getUsageOptions))
        .required()
    ),
  });

  private propertyRentSchema = joi.object({
    propertyType: joi
      .string()
      .required()
      .valid(...Object.values(propertyRent.getPropertyType)),
    propertyCondition: joi
      .string()
      .required()
      .valid(...Object.values(propertyRent.getPropertyCondition)),
    location: joi
      .object({
        state: joi.string().required(),
        localGovernment: joi.string().required(),
        area: joi.string().required(),
      })
      .required(),
    rentalPrice: joi.number().required(),
    noOfBedrooms: joi.number().required(),
    features: joi
      .array()
      .items(
        joi.object({
          featureName: joi
            .string()
            .required()
            .valid(...Object.values(propertyRent.getPropertyFeatures)),
        })
      )
      .required(),
    tenantCriteria: joi
      .array()
      .items(
        joi.object({
          criteria: joi
            .string()
            .required()
            .valid(...Object.values(propertyRent.getTenantCriteria)),
        })
      )
      .required(),
    owner: joi.object({
      fullName: joi.string().required(),
      phoneNumber: joi.string().required(),
      email: joi.string().required(),
    }),
    areYouTheOwner: joi.boolean().required(),
  });

  public validate(data: any, schemaName: keyof typeof validatorSchemaNames) {
    try {
      const schema = this[schemaName];
      const { error, value } = schema.validate(data);
      //   console.log('error', error);
      if (error) {
        throw new RouteError(HttpStatusCodes.BAD_REQUEST, error.message);
      }
      return value;
    } catch (error) {
      throw new RouteError(HttpStatusCodes.BAD_REQUEST, error.message);
    }
  }
}

export default new Validator();

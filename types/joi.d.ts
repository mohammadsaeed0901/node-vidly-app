import * as Joi from 'joi';

declare module 'joi' {
  interface Root {
    objectId?: () => any;
  }
}
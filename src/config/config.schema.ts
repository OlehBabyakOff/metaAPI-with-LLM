import * as Joi from 'joi';

export const configSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
});

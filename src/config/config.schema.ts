import * as Joi from 'joi';

export const configSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),

  // Mongo
  MONGO_URI: Joi.string().uri().required(),

  // LLM
  LLM_PROVIDER: Joi.string().valid('openai', 'claude').default('openai'),
  OPENAI_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'openai',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  ANTHROPIC_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'claude',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Meta
  META_APP_ID: Joi.string().required(),
  META_APP_SECRET: Joi.string().required(),
  META_REDIRECT_URI: Joi.string().uri().required(),
});

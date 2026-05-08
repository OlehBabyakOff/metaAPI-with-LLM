import * as Joi from 'joi';

export const configSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),

  // LLM
  LLM_PROVIDER: Joi.string().valid('openai').default('openai'),
  OPENAI_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'openai',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

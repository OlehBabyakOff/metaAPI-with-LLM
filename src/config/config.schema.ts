import * as Joi from 'joi';

export const configSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),

  // Mongo
  MONGO_URI: Joi.string().uri().required(),

  // LLM
  LLM_PROVIDER: Joi.string().valid('openai', 'claude', 'gemini').default('gemini'),
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
  GEMINI_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'gemini',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Meta
  META_APP_ID: Joi.string().required(),
  META_APP_SECRET: Joi.string().required(),
  META_REDIRECT_URI: Joi.string().uri().required(),
  META_SCOPES: Joi.string()
    .required()
    .custom((value, helpers) => {
      const scopes = value.split(',').map((scope) => scope.trim());

      const allowedScopes = ['pages_show_list', 'pages_manage_metadata', 'pages_read_engagement'];

      const invalidScopes = scopes.filter((scope) => !allowedScopes.includes(scope));

      if (invalidScopes.length > 0) {
        return helpers.error('any.invalid');
      }

      return value;
    }, 'Meta scopes validation'),
  META_BASE_URL: Joi.string().uri().required(),
  META_API_VERSION: Joi.string()
    .pattern(/^v\d+(\.\d+)?$/)
    .required(),
});

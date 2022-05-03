import Joi from "joi";

export const userSignUpValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  phone: Joi.number().required(),
  name: Joi.string().required(),
});

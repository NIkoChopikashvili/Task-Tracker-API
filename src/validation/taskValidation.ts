import Joi from "joi";

export const taskCreateValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
  assignedTo: Joi.array(),
});

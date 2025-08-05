import Joi from "joi";

export const createOrderSchema = Joi.object({
  pickupLocation: Joi.string().required(),
  dropoffLocation: Joi.string().required(),
  passengerCount: Joi.number().integer().min(1).required(),
  // добавьте остальные поля по необходимости
});

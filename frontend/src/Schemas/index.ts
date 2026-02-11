import * as yup from 'yup';

type AutoUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? undefined : T[K];
};

export type TYupObjectSchema<T> = yup.ObjectSchema<Required<T>, yup.AnyObject, AutoUndefined<T>, ''>;

export const ListValuesChema = yup
  .array()
  .of(
    yup.object({
      id: yup.string().required(),
      value: yup.string().required(),
    })
  )
  .default([])
  .defined();

export const ListValueChema = yup
  .object({
    id: yup.string().required(),
    value: yup.string().required(),
  })
  .strict();

export const ListValueWithCountChema = yup
  .array()
  .of(
    yup.object({
      id: yup.string().required(),
      value: yup.string().required(),
      count: yup.number().required().default(0),
    })
  )
  .default([])
  .defined();

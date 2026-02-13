import * as yup from 'yup';

type AutoUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? undefined : T[K];
};

export type TYupObjectSchema<T> = yup.ObjectSchema<Required<T>, yup.AnyObject, AutoUndefined<T>, ''>;

export const ListValuesChema = <T extends string = string>() =>
  yup
    .array()
    .of(
      yup.object({
        id: yup.mixed<T>().required(),
        value: yup.mixed<string | number>().required(),
      })
    )
    .default([])
    .defined();

export const ListValueChema = <T extends string = string>() =>
  yup
    .object({
      id: yup.mixed<T>().required(),
      value: yup.mixed<string | number>().required(),
    })
    .strict();

export const ListValueWithCountChema = <T extends string = string>() =>
  yup
    .array()
    .of(
      yup.object({
        id: yup.mixed<T>().required(),
        value: yup.mixed<string | number>().required(),
        count: yup.number().required().default(0),
      })
    )
    .default([])
    .defined();

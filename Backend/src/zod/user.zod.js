import zod from "zod";

export const signUpSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

export const updateBody = zod.object({
  email: zod.string().email().nullable(),
  firstName: zod.string().nullable(),
  lastName: zod.string().nullable()
});
import * as z from "zod"
import {email} from 'zod';

export const usernameValidation = z.string()
.min(2 , 'username must be atleast 2 characters')
.max(20 , 'Username must be no more 20 characters')
.regex(/^[a-zA-Z0-9]+$/, 'User name must not contain special character');



export const signUpValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
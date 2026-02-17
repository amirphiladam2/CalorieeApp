import {z} from 'zod';

export const LoginSchema=z.object({
    email:z
    .string()
    .min(1,"Email is required")
    .email("Enter a valid email"),

    password:z
    .string()
    .min(1,"Password is required")
});

export type LoginSchemaType=z.infer<typeof LoginSchema>
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {z} from 'zod'

export const RegisterSchema=z.object({
    name:z.string().min(1,"Name is required"),
    email:z.string().email("Enter a valid email"),
    password:z.string().min(6,"Password must be at least 6 characters"),
    confirmPassword:z.string().min(1,"Password do not match"),
})
.refine((data)=>data.password===data.confirmPassword,{
   message:"Passwords do not match",
   path:["confirmPassword"]
});

export type RegisterSchemaType=z.infer<typeof RegisterSchema>


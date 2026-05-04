// import {z} from "zod" --> v3
import * as z from 'zod' // --> v4

export const verifySchema = z.string().min(6 , 'Verify must be 6 character');
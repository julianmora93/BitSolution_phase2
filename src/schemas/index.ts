/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const userLoadResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  username: Type.String(),
  email: Type.String(),
  address: Type.Object({
    street: Type.String(),
    suite: Type.String(),
    city: Type.String(),
    zipcode: Type.String(),
    geo: Type.Object({
      lat: Type.String(),
      lng: Type.String(),
    }),
  }),
  phone: Type.String(),
  website: Type.String(),
  company: Type.Object({
    name: Type.String(),
    catchPhrase: Type.String(),
    bs: Type.String(),
  }),
})

// TYPES
type UserLoadTypeResponseSchema = Static<typeof userLoadResponseSchema>

export {
  // SCHEMAS
  userLoadResponseSchema,
}

export type {
  // TYPES
  UserLoadTypeResponseSchema,
}
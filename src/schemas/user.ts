/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const userLoadSchema = Type.Object(
  {
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
  },
  { description: 'User data from external API' },
)

const userQueryStringSchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1, description: 'Filter by name' })),
    username: Type.Optional(Type.String({ minLength: 1, description: 'Filter by username' })),
    email: Type.Optional(Type.String({ minLength: 1, description: 'Filter by email' })),
    phone: Type.Optional(Type.String({ minLength: 1, description: 'Filter by phone' })),
    website: Type.Optional(Type.String({ minLength: 1, description: 'Filter by website' })),
  },
  { description: 'User search parameters' },
)

// TYPES
type UserLoadSchema = Static<typeof userLoadSchema>

export {
  userLoadSchema,
  userQueryStringSchema,
}

export type {
  UserLoadSchema,
}
/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const postSchema = Type.Object(
  {
    userId: Type.Number(),
    id: Type.Number(),
    title: Type.String(),
    body: Type.String(),
  },
  { description: 'Post data from external API' },
)

// TYPES
type PostSchema = Static<typeof postSchema>

export {
  postSchema
}

export type {
  PostSchema
}
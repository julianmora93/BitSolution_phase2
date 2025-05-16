/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const postQueueSchema = Type.Object(
  {
    userId: Type.Number(),
    postId: Type.Number(),
    title: Type.String(),
    body: Type.String(),
  },
  { description: 'Post data from external API' },
)

// TYPES
type PostQueueSchema = Static<typeof postQueueSchema>

export {
    postQueueSchema
}

export type {
    PostQueueSchema
}
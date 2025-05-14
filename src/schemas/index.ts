/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS

const demoSchema = Type.Object({
  email: Type.String(),
})

// TYPES
type DemoSchema = Static<typeof demoSchema>

export {
  // SCHEMAS
  demoSchema,
  // TYPES
  DemoSchema,
}

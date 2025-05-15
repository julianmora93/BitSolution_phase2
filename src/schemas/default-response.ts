/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Type } from '@sinclair/typebox'

// SCHEMAS
const defaultResponseMessageSchema = (
  generalDescription: string,
  messageDescription: string, 
  processCountDescription: string
) => Type.Object(
  {
    processCount: Type.Number({ description: messageDescription }),
    message: Type.String({ description: processCountDescription }),
  },
  { description: generalDescription },
)

export { defaultResponseMessageSchema }
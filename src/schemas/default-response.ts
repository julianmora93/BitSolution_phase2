/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const defaultResponseSchema = (
  generalDescription: string,
  messageDescription: string,
  processCountDescription: string,
  dataDescription?: string,
) =>
  Type.Object(
    {
      processCount: Type.Number({ description: messageDescription }),
      message: Type.String({ description: processCountDescription }),
      data: Type.Optional(Type.Any({ description: dataDescription })),
    },
    { description: generalDescription },
  )

// TYPES
type DefaultResponseSchema = Static<ReturnType<typeof defaultResponseSchema>>

export { defaultResponseSchema }

export type { DefaultResponseSchema }
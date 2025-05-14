/*
 * Copyright (c) 2023 Bit Solution Group
 */

import envSchema from 'env-schema'
import { Static, Type } from '@sinclair/typebox'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE


// TODO: DEFINE HERE ALL THE ENV VARIABLES
const schema = Type.Strict(
  Type.Object({
    // DATA WAREHOUSE CONFIG
    DW_SERVER: Type.String(),
    DW_DATABASE: Type.String(),
    DW_USERNAME: Type.String(),
    DW_PASSWORD: Type.String(),
    DW_PORT: Type.Number({ default: 5432 }),
    // GENERAL CONFIG
    REDIS_CONFIG: Type.String({ default: '127.0.0.1:6379' }),
    CACHE_TTL: Type.Number({ default: 1 * HOUR }),
  })
)

type Env = Static<typeof schema>

const config = envSchema<Env>({
  dotenv: true,
  schema,
})

export { config, Env }

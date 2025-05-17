/*
 * Copyright (c) 2023 Bit Solution Group
 */

import envSchema from 'env-schema'
import { Static, Type } from '@sinclair/typebox'

// TODO: DEFINE HERE ALL THE ENV VARIABLES
const schema = Type.Object({
  // OTHER
  EXTERNAL_ENDPOINT: Type.String(),

  // DATA WAREHOUSE CONFIG
  DW_SERVER: Type.String(),
  DW_DATABASE: Type.String(),
  DW_USERNAME: Type.String(),
  DW_PASSWORD: Type.String(),
  DW_PORT: Type.Number({ default: 5432 }),
  DW_SCHEMA: Type.String({ default: 'public' }),

  // MAILHOG CONFIG
  MAILHOG_HOST: Type.String({ default: 'localhost' }),
  MAILHOG_SMTP_PORT: Type.Number({ default: 1025 }),
  EMAIL_FROM: Type.String({ default: '"Microservice App" <noreply@example.com>' }),

  // BULLMQ CONFIG
  BULLMQ_QUEUE_NAME: Type.String({ default: 'postNotification' }),
  BULLMQ_QUEUE_HOST: Type.String({ default: 'localhost' }),
  BULLMQ_QUEUE_PORT: Type.Number({ default: 6379 }),
  BULLMQ_REDIS_NAME_SPACE: Type.String({ default: 'phase2' }),

  WORKER_NAME: Type.String({ default: 'workerNotification' }),
  WORKER_CONCURRENCY_MINUTES: Type.Number({ default: 1 }),
})

type Env = Static<typeof schema>

const config = envSchema<Env>({
  dotenv: true,
  schema,
})

export { config }
export type { Env }
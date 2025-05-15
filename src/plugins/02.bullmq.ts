/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AppOptions } from '../app'
import { Queue } from 'bullmq'

declare module 'fastify' {
  interface FastifyInstance {
    bullmq: Queue;
  }
}

const bullmqPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, options: any) => {
  const { TEST_MODE, BULLMQ_QUEUE_NAME } = options

  if (TEST_MODE) return

  if (!fastify.redisStore) {
    throw new Error('Error initializing Redis service')
  }

  const postNotificationQueue = new Queue(BULLMQ_QUEUE_NAME, {
    connection: fastify.redisStore,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: { count: 1000 },
    },
  })

  postNotificationQueue.on('error', (error) => {
    fastify.log.error({ error, queue: BULLMQ_QUEUE_NAME }, 'BullMQ Queue Error')
  })

  fastify.decorate('bullmq', postNotificationQueue)

  fastify.addHook('onClose', async (instance: any) => {
    await instance[BULLMQ_QUEUE_NAME]?.close()
  })
})

export default bullmqPlugin
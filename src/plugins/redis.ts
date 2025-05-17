/*
 * Copyright (c) 2023 Bit Solution Group
 */

import Keyv from 'keyv'
import fp from 'fastify-plugin'
import { AppOptions } from '../app'
import KeyvRedis from '@keyv/redis'
import { FastifyPluginAsync } from 'fastify'

export interface ICacheRes {
  store?: KeyvRedis<null>
  namespace?: string
}

export type Cache = Keyv<string | undefined>

declare module 'fastify' {
  interface FastifyInstance {
    cache: Cache
  }
}

const redisPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, options: any) => {
  const { TEST_MODE, BULLMQ_QUEUE_HOST, BULLMQ_QUEUE_PORT, BULLMQ_REDIS_NAME_SPACE } = options

  if (TEST_MODE) return

  const store = new KeyvRedis(`redis://${BULLMQ_QUEUE_HOST}:${BULLMQ_QUEUE_PORT}/0`)
  const cache = new Keyv({
    store,
    namespace: BULLMQ_REDIS_NAME_SPACE,
  })

  cache.clear().catch((err) => {
    fastify.log.error({ err }, 'Failed to clear cache on startup')
  })

  cache.clear().catch()

  fastify.decorate('cache', cache)
  fastify.decorate('redisStore', store)

  store.on('error', (err) => {
    fastify.log.error({ err }, 'Redis Store Error')
  })

  fastify.addHook('onClose', async () => {
    if (store && typeof store.disconnect === 'function') {
      await store.disconnect()
    }
  })
})

export default fp(redisPlugin, {
  name: 'redis-plugin',
})
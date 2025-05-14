/*
 * Copyright (c) 2023 Bit Solution Group
 */

import Keyv from 'keyv'
import fp from 'fastify-plugin'
import { AppOptions } from '../app'
import KeyvRedis from '@keyv/redis'
import { FastifyPluginAsync } from 'fastify'

export interface ICacheRes {
  store?: KeyvRedis
  adapter?: 'redis'
  namespace?: string
}

export type Cache = Keyv<string | undefined, ICacheRes>

declare module 'fastify' {
  interface FastifyInstance {
    cache: Cache
  }
}

const redis: FastifyPluginAsync<AppOptions> = fp(async (fastify, options) => {
  const { TEST_MODE, REDIS_CONFIG } = options

  if (TEST_MODE) {
    fastify.decorate('cache', new Keyv())
    return
  }

  const store = new KeyvRedis(REDIS_CONFIG)
  const cache = new Keyv({
    store,
    adapter: 'redis',
    namespace: 'demo', // TODO: RENAME THE NAMESPACE ACCORDINGLY TO THE PROJECT
  })

  cache.clear().catch()

  fastify.decorate('cache', cache)
})

export default redis

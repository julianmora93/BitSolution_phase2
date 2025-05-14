/*
 * Copyright (c) 2023 Bit Solution Group
 */

// TODO: SET HERE THE ENV VARIABLES YOU NEED FOR YOU PROJECT

process.env.DW_SERVER = 'DW_SERVER'
process.env.DW_USERNAME = 'DW_USERNAME'
process.env.DW_PORT = '5432'
process.env.DW_DATABASE = 'DW_DATABASE'
process.env.DW_PASSWORD = 'DW_PASSWORD'
process.env.DW_SCHEMA = 'DW_SCHEMA'
process.env.REDIS_CONFIG = '127.0.0.1:6379'
process.env.CACHE_TTL = '5000'

import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { app, AppOptions } from '../src/app'

// Fill in this config with all the configurations
// needed for testing the application
function config(): AppOptions {
  // RETURN HERE ALL THE DEFINED VARIABLES
  return {
    REDIS_CONFIG: 'REDIS_CONFIG',
    CACHE_TTL: 5000,
    DW_DATABASE: 'DW_DATABASE',
    DW_PORT: 5432,
    DW_PASSWORD: 'DW_PASSWORD',
    TEST_MODE: true,
    DW_SERVER: 'DW_SERVER',
    DW_USERNAME: 'DW_USERNAME',
  }
}

async function build() {
  try {
    const fastify = await app(config())
    void fastify.register(fp(mocks()))
    return fastify
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}


// TODO: DEFINE HERE ALL THE NEEDED MOCKS
function mocks() {
  return (fastify: FastifyInstance, opts: AppOptions, next: any) => {
    fastify.decorate('prisma', {})

    fastify.decorate('handleAxiosError', (err: any) => {
      console.log(err)
      return { code: 422, message: err.message }
    })

    fastify.decorate('axios', {
        get: (url: string, config: any) => {
          return { status: 200, data: {} }
        },
    })

    next()
  }
}

export { config, build }

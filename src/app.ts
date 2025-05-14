/*
 * Copyright (c) 2023 Bit Solution Group
 */
 
import { join } from 'path'
import { config, Env } from './config'
import fastify, { FastifyInstance } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'

export type AppOptions = {
  TEST_MODE: boolean
} & Partial<AutoloadPluginOptions> &
  Env

export const app = async (opts: AppOptions = { ...config, TEST_MODE: false }): Promise<FastifyInstance> => {
  const app = fastify({ logger: true })

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void app.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })
  app.swagger
  // This loads all plugins defined in routes
  // define your routes in one of these
  void app.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  })

  return app
}

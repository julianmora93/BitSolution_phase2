/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { Prisma, PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, options: any) => {
  const { DW_PORT, TEST_MODE, DW_SCHEMA, DW_SERVER, DW_PASSWORD, DW_DATABASE, DW_USERNAME } = options

  if (TEST_MODE) return

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${DW_USERNAME}:${DW_PASSWORD}@${DW_SERVER}:${DW_PORT}/${DW_DATABASE}?schema=${DW_SCHEMA}&pool_timeout=0`,
      },
    },
    log: ['error', 'query', 'info', 'warn'],
    rejectOnNotFound: (err: Error) => {
      return new Prisma.PrismaClientKnownRequestError(err.message, {
        code: 'P2025',
        clientVersion: Prisma.prismaVersion.client,
      })
    },
  })

  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (fastify: any) => {
    await fastify.prisma.$disconnect()
  })
})
export default prismaPlugin

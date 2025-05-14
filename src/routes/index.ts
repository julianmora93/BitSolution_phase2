/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'

const index: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Demo'

  // DEMO ROUTE
  fastify.route<{}>({
    method: 'GET',
    url: '/demo-resources',
    handler: async function (req, reply) {
      try {
		  reply.send({})
      } catch (err) {
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        return reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
    },
  })
}

export default index

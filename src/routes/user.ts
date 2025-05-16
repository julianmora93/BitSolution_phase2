/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { config } from '../config'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { userLoadSchema, UserLoadSchema, userQueryStringSchema } from '../schemas/user'
import { createManyUsers, findUsers, getExistingUsers } from '../repositories/users'
import { defaultResponseSchema } from '../schemas/default-response'

const user: FastifyPluginAsync<AppOptions> = async (fastify, _opts): Promise<void> => {
  const ENTITY_NAME = 'Users'

  fastify.route({
    method: 'POST',
    url: '/users/load',
    handler: async (req, reply) => {
      try {
        const { data: users } = await fastify.axios.get<UserLoadSchema[]>(`${config.EXTERNAL_ENDPOINT}/users`)

        const existingUsers = await getExistingUsers(fastify.prisma)

        const existingIds = new Set(existingUsers.map((u) => u.id))
        const existingEmails = new Set(existingUsers.map((u) => u.email))
        const existingUsernames = new Set(existingUsers.map((u) => u.username))

        const newUsers = users.filter(
          (u) => !existingIds.has(u.id) && !existingEmails.has(u.email) && !existingUsernames.has(u.username),
        )

        if (newUsers.length > 0) {
          await createManyUsers(
            fastify.prisma,
            newUsers.map((u) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              // email: u.email,
              // email: `${u.username.toLowerCase()}@yopmail.com`,
              email: `user_bitsolution_test_${u.id}@yopmail.com`,
              phone: u.phone,
              website: u.website,
              address: u.address,
              company: u.company,
            })),
          )
        }

        reply.send({ processCount: newUsers.length, message: 'Users loaded successfully.', data: users })
      } catch (err) {
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Loads users from an external API and saves them to the database.',
      response: {
        200: defaultResponseSchema('Load process result', 'Load process result message', 'Number of users loaded'),
      },
    },
  })

  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async (req, reply) => {
      try {
        const users = await findUsers(fastify.prisma, req.query as any)
        reply.send(users)
      } catch (err) {
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Retrieves the list of users stored in the database.',
      querystring: userQueryStringSchema,
      response: {
        200: {
          type: 'array',
          items: userLoadSchema,
        },
      },
    },
  })
}

export default user
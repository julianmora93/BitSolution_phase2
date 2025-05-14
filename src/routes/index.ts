/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { config } from '../config'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { userLoadResponseSchema, UserLoadTypeResponseSchema } from '../schemas'

const index: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Users'

  console.log('JMORA[config]', config)

  fastify.route({
    method: 'POST',
    url: '/users/load',
    handler: async (req, reply) => {
      try {
        console.log('JMORA[config.EXTERNAL_ENDPOINT]', `${config.EXTERNAL_ENDPOINT}/users`)

        // get user data from external API
        const { data: users } = await fastify.axios.get<UserLoadTypeResponseSchema[]>(
          `${config.EXTERNAL_ENDPOINT}/users`,
        )

        // search IDs, emails and usernames in the database
        const existingUsers = await fastify.prisma.user.findMany({
          select: {
            id: true,
            email: true,
            username: true,
          },
        })

        const existingIds = new Set(existingUsers.map((u) => u.id))
        const existingEmails = new Set(existingUsers.map((u) => u.email))
        const existingUsernames = new Set(existingUsers.map((u) => u.username))

        // filter only new users
        const newUsers = users.filter(
          (u) => !existingIds.has(u.id) && !existingEmails.has(u.email) && !existingUsernames.has(u.username),
        )

        // Insert new users
        if (newUsers.length > 0) {
          await fastify.prisma.user.createMany({
            data: newUsers.map((u) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              email: u.email,
              phone: u.phone,
              website: u.website,
              address: u.address,
              company: u.company,
            })),
            skipDuplicates: true,
          })
        }

        reply.send({ loaded: newUsers.length, message: 'Users loaded successfully.' })
      } catch (err) {
        fastify.log.error(err)
        reply.code(500).send({ error: 'Error loading users.' })
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Loads users from an external API and saves them to the database.',
    },
  })
}

export default index
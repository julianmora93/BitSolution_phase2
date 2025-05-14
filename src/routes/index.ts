/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { config } from '../config'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { defaultResponseMessageSchema, userLoadSchema, UserLoadSchema, userQueryStringSchema } from '../schemas'

const index: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Users'

  fastify.route({
    method: 'POST',
    url: '/users/load',
    handler: async (req, reply) => {
      try {
        // get user data from external API
        const { data: users } = await fastify.axios.get<UserLoadSchema[]>(`${config.EXTERNAL_ENDPOINT}/users`)

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
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Loads users from an external API and saves them to the database.',
      response: {
        200: defaultResponseMessageSchema,
      },
    },
  })

  fastify.route({
    method: 'GET',
    url: '/users',
    handler: async (req, reply) => {
      try {
        const { name, username, email, phone, website } = req.query as {
          name?: string
          username?: string
          email?: string
          phone?: string
          website?: string
        }
        const where: any = {}
        if (name) where.name = { contains: name, mode: 'insensitive' }
        if (username) where.username = { contains: username, mode: 'insensitive' }
        if (email) where.email = { contains: email, mode: 'insensitive' }
        if (phone) where.phone = { contains: phone, mode: 'insensitive' }
        if (website) where.website = { contains: website, mode: 'insensitive' }

        const users = await fastify.prisma.user.findMany({ where })
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

export default index
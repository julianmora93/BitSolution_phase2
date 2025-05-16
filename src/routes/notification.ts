/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { config } from '../config'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { PostSchema } from '../schemas/notification'
import EnqueueService from '../services/enqueue'
import { defaultResponseSchema } from '../schemas/default-response'

const notification: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Notifications'
  const { BULLMQ_QUEUE_NAME } = opts

  const queueInstance = fastify.bullmq

  if (!queueInstance) {
    throw new Error(`BullMQ not initialized.`)
  }

  const enqueueService = new EnqueueService(queueInstance)

  fastify.route({
    method: 'POST',
    url: '/posts/published-notification',
    handler: async (req, reply) => {
      let totalNotificationsEnqueued = 0
      try {
        const { data: posts } = await fastify.axios.get<PostSchema[]>(`${config.EXTERNAL_ENDPOINT}/posts`)
        for (const post of posts) {
          await enqueueService.add(BULLMQ_QUEUE_NAME, {
            userId: post.userId,
            postId: post.id,
            title: post.title,
            body: post.body,
          })
          totalNotificationsEnqueued += 1
        }
        reply.send({ processCount: totalNotificationsEnqueued, message: 'Notifications enqueued successfully.' })
      } catch (err: any) {
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Simulate publishing posts and enqueue notifications for users.',
      response: {
        200: defaultResponseSchema(
          'Notification process result',
          'Persistence result message for pending notifications',
          'Registered notification count',
        ),
      },
    },
  })
}

export default notification
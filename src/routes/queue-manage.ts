/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { defaultResponseSchema } from '../schemas/default-response'
import { PostQueueSchema } from '../schemas/queue-manager'
import EnqueueService from '../services/enqueue'

const notification: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'QueueManager'

  const queueInstance = fastify.bullmq;

  if (!queueInstance) {
    throw new Error(`BullMQ not initialized.`);
  }

  const enqueueService = new EnqueueService(queueInstance)

  fastify.route({
    method: 'GET',
    url: '/queue-manager',
    handler: async (req, reply) => {
      try {
        const jobs = await enqueueService.getAllMeessages()
        if(!jobs && jobs === 0) {
          reply.send({ processCount: 0, message: 'The queue is empty.' })
          return
        }

        const postQueueList: PostQueueSchema[] = jobs.map(job => ({
          userId: job.data.userId,
          postId: job.data.postId,
          title: job.data.title,
          body: job.data.body,
        }));
        
        reply.send({ processCount: 0, message: 'The queue is empty.', data: postQueueList });
      } catch (err: any) {
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Retrieve all queued messages.',
      response: {
        200: defaultResponseSchema(
          'Queued messages result',
          'List of all messages currently in the queue',
          'Messages count',
          'List postMessages enqueued in the queue',
        ),
      },
    },
  })

  fastify.route({
    method: 'POST',
    url: '/queue-manager/clear',
    handler: async (req, reply) => {
      try {
        const enqueueService = new EnqueueService(queueInstance)
        const messageWaitingCount = await enqueueService.getCountWaitingMessages()
        if(messageWaitingCount === 0) {
          reply.send({ processCount: 0, message: 'The queue is already empty.' })
          return
        }
        await queueInstance.obliterate({ force: true });
        reply.send({ processCount: messageWaitingCount, message: 'All messages deleted; the queue is now empty.' })
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
          'Notifications'
        ),
      },
    },
  })
}

export default notification
/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AppOptions } from '../app'
import { Worker } from 'bullmq'
import { PostNotification, UserEntity } from '../interfaces'
import { getUserById } from '../repositories/users'

const bullWorkerPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, options: any) => {
  const { TEST_MODE, BULLMQ_QUEUE_NAME, BULLMQ_QUEUE_HOST, BULLMQ_QUEUE_PORT, EMAIL_FROM } = options

  if (TEST_MODE) return

  const bullWorker = new Worker(BULLMQ_QUEUE_NAME, async (job) => {
    try{
      const dataPost: PostNotification = job.data
      const userData: UserEntity = await getUserById(fastify.prisma, dataPost.userId)
      if (!userData) return false
      const mailOptions = {
        from: EMAIL_FROM,
        to: userData.email,
        subject: `New Post Published: ${dataPost.title}`,
        text: `Post ID: ${dataPost.postId}\n\n${dataPost.body}`,
      }
      await fastify.mailer.sendMail(mailOptions)
      return true
    }catch(e){
      console.error(`BullMQ Worker Error: ${e}`)
      return false
    }

  },{ 
    connection: {
      host: BULLMQ_QUEUE_HOST,
      port: BULLMQ_QUEUE_PORT,
    },
    autorun: true,
    removeOnComplete: {count: 10},
    concurrency: 10
  })

  fastify.decorate('bullWorker', bullWorker)
})

export default bullWorkerPlugin
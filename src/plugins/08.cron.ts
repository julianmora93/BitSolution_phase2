import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import fastifyCron from 'fastify-cron';
import postNotificationWorker from '../services/worker';

const cronPlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
  const { TEST_MODE, WORKER_NAME, WORKER_CONCURRENCY_MINUTES } = opts as any

  if (TEST_MODE) return

  let isRunning = false

  fastify.register(fastifyCron, {
    jobs: [
      {
        name: WORKER_NAME,
        cronTime: `*/${WORKER_CONCURRENCY_MINUTES} * * * * `,
        start: true,
        runOnInit: true,
        onTick: async () => {
          if (!isRunning) {
            isRunning = true
            await postNotificationWorker(fastify, opts)
          }
        },
        onComplete: async () => {
          isRunning = false
        },
      },
    ],
  })
})

export default cronPlugin
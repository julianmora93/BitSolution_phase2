/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { app } from './app'

const start = async () => {
  const fastify = await app()
  await fastify.listen({ port: Number(process.env.PORT || 3000), host: '0.0.0.0' })
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})

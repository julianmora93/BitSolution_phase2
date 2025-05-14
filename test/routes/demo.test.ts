/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { build } from '../helper'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => {
  app = await build()
  await app.ready()
})

test('TEST DEMO', async () => {
  const res = await app.inject({
    method: 'GET',
    url: '/demo-resources',
  })

  expect(JSON.parse(res.body)).toEqual({})
})

afterAll(() => app.close())

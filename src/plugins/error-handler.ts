/*
 * Copyright (c) 2023 Bit Solution Group
 */

import axios from 'axios'
import fp from 'fastify-plugin'
import { Prisma } from '@prisma/client'

export interface IErrorHandler {
  code: number
  message: string
}

const DEFAULT_ERR_CODE = 422

export default fp(async (fastify, opts) => {
  fastify.decorate(
    'customErrorHandler',
    (err: any, entity = '', defaultMessage = err?.message || 'Unprocessable entity'): IErrorHandler => {
      console.log(err)
      let code = err?.statusCode || DEFAULT_ERR_CODE
      let message = defaultMessage

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const meta = err.meta as { target: unknown[] }
          code = 409
          message = `Already exist a ${entity} with this: ${meta.target.join(', ')}`
        } else if (err.code === 'P2025') {
          code = 404
          message = `${entity} not found`
        }
		else if (err.code === 'P2010') {
          code = 422
          message = `Could not resolve the data from data source. Please check your criteria and retry`
        }
      } else if (axios.isAxiosError(err)) {
        code = err.response?.status
        message = err.response?.data
      }
      try {
        console.log(code, JSON.stringify(message))
      } catch (e) {
        console.log(code, message)
      }

      return { code, message }
    }
  )
})

declare module 'fastify' {
  export interface FastifyInstance {
    customErrorHandler(err: any, entity: string, defaultMessage: string): IErrorHandler
  }
}
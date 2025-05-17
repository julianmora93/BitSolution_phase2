/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin';
import { AppOptions } from '../app';
import { FastifyPluginAsync } from 'fastify';
import { Transporter } from 'nodemailer';
import fastifyMailer from 'fastify-mailer';

interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter;
}
type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module 'fastify' {
  export interface FastifyInstance {
    mailer: FastifyMailer;
  }
}

const mailerPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, opts: any) => {
  const { TEST_MODE, MAILHOG_HOST, MAILHOG_SMTP_PORT, EMAIL_FROM } = opts

  if (TEST_MODE) return

  fastify.register(fastifyMailer, {
    defaults: {
      from: EMAIL_FROM,
    },
    transport: {
      host: MAILHOG_HOST,
      port: MAILHOG_SMTP_PORT,
      secure: false,
    },
  })

  // fastify.decorate('mailer', fastifyMailer);
})

export default mailerPlugin
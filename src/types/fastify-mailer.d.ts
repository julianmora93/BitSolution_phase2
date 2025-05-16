declare module 'fastify-mailer' {
    import { FastifyPluginCallback } from 'fastify';
    import { TransportOptions, SentMessageInfo } from 'nodemailer';
  
    interface FastifyMailerOptions {
      defaults?: Record<string, any>;
      transport: TransportOptions;
    }
  
    interface Mailer {
      sendMail: (options: any) => Promise<SentMessageInfo>;
    }
  
    const fastifyMailer: FastifyPluginCallback<FastifyMailerOptions>;
  
    export = fastifyMailer;
  }
  
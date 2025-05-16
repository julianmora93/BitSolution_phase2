import { JobAction, PostNotification, UserEntity } from "../interfaces";
import { getUserById } from "../repositories/users";
import EnqueueService from "./enqueue";

export default async function postNotificationWorker(fastify: any, opts: any) {
  const { EMAIL_FROM } = opts
  const enqueueService = new EnqueueService(fastify.bullmq)
  const waitingMessages = await enqueueService.getWaitingMeessages()
  if (!waitingMessages || waitingMessages.length === 0) return

  for (const message of waitingMessages) {
    try {
      enqueueService.markJob(message.id!, JobAction.UpdateData, { status: 'in-transaction' })
      const dataPost: PostNotification = message.data
      const userData: UserEntity = await getUserById(fastify.prisma, dataPost.userId)
      if (!userData) return
      const mailOptions = {
        from: EMAIL_FROM,
        to: userData.email,
        subject: `New Post Published: ${dataPost.title}`,
        text: `Post ID: ${dataPost.postId}\n\n${dataPost.body}`,
      }
      await fastify.mailer.sendMail(mailOptions)
      enqueueService.markJob(message.id!, JobAction.Remove, { status: 'completed' })
    } catch (error) {
      await enqueueService.markJob(message.id!, JobAction.Fail, { error: 'Error al procesar el mensaje' })
    }
  }
}
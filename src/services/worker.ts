import { JobAction, PostNotification, UserEntity } from "../interfaces";
import { getUserById } from "../repositories/users";
import EnqueueService from "./enqueue";

export default async function postNotificationWorker(fastify: any, opts: any) {
  console.log('----------------------------------------')
  console.log('JMORA[worker] => Worker en ejecucion', getHour());
  const { EMAIL_FROM } = opts
  const enqueueService = new EnqueueService(fastify.bullmq)
  const waitingMessages = await enqueueService.getWaitingMeessages()
  if (!waitingMessages  || waitingMessages.length === 0) {
    console.log('----------------------------------------')
    console.log('JMORA[worker] => No more message in the queue. ', getHour())
    return
  }

  for (const message of waitingMessages) {
    try {
      enqueueService.markJob(message.id!, JobAction.UpdateData, { status: 'in-transaction' })
      const dataPost: PostNotification = message.data
      console.log('----------------------------------------')
      console.log('JMORA[worker] => dataPost: ', dataPost)
      const userData: UserEntity = await getUserById(fastify.prisma, dataPost.userId)
      console.log('--')
      console.log('JMORA[worker] => userData: ', userData)
      if (!userData) return
      const mailOptions = {
        from: EMAIL_FROM,
        to: userData.email,
        subject: `New Post Published: ${dataPost.title}`,
        text: `Post ID: ${dataPost.postId}\n\n${dataPost.body}`,
      };
      console.log('--')
      console.log('JMORA[worker] => mailOptions', mailOptions)
      await fastify.mailer.sendMail(mailOptions);
      console.log('--')
      console.log('JMORA[worker] => Email sent: ', userData.email)
      enqueueService.markJob(message.id!, JobAction.Remove, { status: 'completed' })
      // enqueueService.markJob(message.id!, JobAction.CompleteAndRemove, { status: 'completed' })
      // message.remove()
      console.log('--')
      console.log('JMORA[worker] => Queue mark as completed')
    } catch (error) {
      console.log('--')
      console.log('JMORA[worker] => Email error: ', error)
      await enqueueService.markJob(message.id!, JobAction.Fail, { error: 'Error al procesar el mensaje' });
      console.log('--')
      console.log('JMORA[worker] => Queue mark as failed')
    }
  }
}

function getHour(){
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `[${hours}:${minutes}:${seconds}]`;
}
// import { Worker, isMainThread, workerData } from 'worker_threads';
// import fastify from 'fastify';
// import { getUserById } from '../repositories/users';
// import EnqueueService from '../services/enqueue';

// const fastifyApp = fastify()
// const configData = workerData

// if (isMainThread) {
//   new Worker(__filename);
// } else {
//   const queueInstance = fastifyApp.bullmq;
//   const enqueueService = new EnqueueService(queueInstance);

//   if (!queueInstance) {
//     throw new Error('BullMQ not initialized.');
//   }

//   const processQueue = async () => {
//     while (true) {
//       const message = await enqueueService.getNextMessage();

//       if (!message) {
//         console.log('No more message in the queue.');
//         break;
//       }

//       const { userId, postId, title, body } = message.data;
//       const user = await getUserById(fastifyApp.prisma, userId);

//       console.log('JMORA[user] => ', user);

//       if (!user) {
//         continue;
//       }

//       const mailOptions = {
//         from: configData.EMAIL_FROM,
//         to: user.email,
//         subject: `New Post Published: ${title}`,
//         text: `Post ID: ${postId}\n\n${body}`,
//       };

//       try {
//         await fastifyApp.mailer.sendMail(mailOptions);
//         console.log(`Email sent to user ${userId} for post ${postId}`);
//         await message.moveToCompleted('done', 'done', true);
//       } catch (error) {
//         console.error(`Failed to send email for post ${postId}:`, error);
//         await message.moveToFailed(new Error('Failed to send email'), 'done', true);
//       }
//     }
//   };

//   processQueue().catch(err => console.error('Error processing queue:', err));
// }
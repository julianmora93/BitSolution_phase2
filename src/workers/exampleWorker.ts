// export async function runExampleWorker() {
//   const now = new Date();
//   const hours = now.getHours().toString().padStart(2, '0');
//   const minutes = now.getMinutes().toString().padStart(2, '0');
//   console.log('----------------------------------------')
//   console.log('JMORA[002] => ✅ Worker terminado', `[${hours}:${minutes}]`);
//   // await new Promise(resolve => setTimeout(resolve, 1000));
//   // console.log('✅ Worker terminado');
// }



/**


import fp from 'fastify-plugin';
import { AppOptions } from '../app';
import { FastifyPluginAsync } from 'fastify';
import fastifyCron from 'fastify-cron';
import postNotificationWorker from '../services/worker';

const cronPlugin: FastifyPluginAsync<AppOptions> = fp(async (fastify: any, opts: any) => {
  const { TEST_MODE, WORKER_NAME, WORKER_CONCURRENCY_MINUTES } = opts

  if (TEST_MODE) return
  console.log('JMORA[Cron] => Inicio del plugin ', getHour());

  let isRunning = false;

  fastify.register(fastifyCron, {
    jobs: [{
      name: WORKER_NAME,
      cronTime: `*${WORKER_CONCURRENCY_MINUTES} * * * *`,
      start: true,
      runOnInit: true,
      onTick: async () => {
        if(!isRunning){
          console.log('----------------------------------------')
          console.log('==> JMORA[cron] => Cron iniciado ', getHour());
          isRunning = true;
          await postNotificationWorker(fastify, opts)
        }else{
          console.log('----------------------------------------')
          console.log('==> JMORA[cron] => Cron en ejecucion ', getHour());
        }
      },
      onComplete: async () => {
        isRunning = false;
        console.log('----------------------------------------')
        console.log('==> JMORA[cron] => Cron terminado ', getHour());
      },
    }],
  })
})

function getHour(){
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `[${hours}:${minutes}:${seconds}]`;
}

export default cronPlugin
 */
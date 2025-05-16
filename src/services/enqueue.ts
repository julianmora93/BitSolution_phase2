/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Queue as BullQueue, Job, JobsOptions } from 'bullmq'
import { JobAction } from '../interfaces'

export default class EnqueueService<T = any> {
  private queue: BullQueue<T>

  constructor(queue: BullQueue<T>) {
    this.queue = queue
  }

  add = async (jobName: any, data: T, opts?: JobsOptions) => this.queue.add(jobName, data as any, opts)

  // getAllMeessages = async (): Promise<Job<T>[]> =>
  //   this.queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'])

  getAllMeessages = async (): Promise<Job<T>[]> =>
    this.queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'])

  getWaitingMeessages = async (): Promise<Job<T>[]> => this.queue.getJobs(['waiting'])

  removeAllMessages = async (): Promise<void> => await this.queue.obliterate({ force: true })

  getCountWaitingMessages = async (): Promise<number> => (await this.queue.getJobs(['waiting'])).length

  async markJob(jobId: string, action: JobAction, payload?: any): Promise<void> {
    const job = await this.queue.getJob(jobId)

    if (!job) {
      console.warn(`Job ${jobId} no encontrado.`)
      return
    }

    switch (action) {
      case JobAction.UpdateData:
        await job.updateData({ ...job.data, ...payload })
        break

      case JobAction.Complete:
        try {
          const token = (job as any).token
          if (!token) {
            console.warn(`No se puede completar el job ${jobId}: falta token.`)
            return
          }
          await job.moveToCompleted(payload ?? job.data, token, true)
        } catch (error) {
          console.error(`Error completando job ${jobId}:`, error)
        }
        break

      case JobAction.Remove:
        await job.remove()
        break

      case JobAction.Fail:
        try {
          const token = (job as any).token
          if (!token) {
            console.warn(`Unable to mark the job as failed ${jobId}: token error.`)
            return
          }
          await job.moveToFailed(new Error(payload?.error || 'General error.'), token, true)
        } catch (error) {
          console.error(`Failed to mark job: ${jobId}:`, error)
        }
        break

      case JobAction.CompleteAndRemove:
        try {
          console.log(`JMORA[CompleteAndRemove]==================> ${jobId}`, 1)
          const token = (job as any).token
          console.log(`JMORA[CompleteAndRemove]==================> ${jobId}`, 2)
          if (!token) {
            console.warn(`No se puede completar el job ${jobId}: falta token.`)
            return
          }
          console.log(`JMORA[CompleteAndRemove]==================> ${jobId}`, 3)
          await job.moveToCompleted(payload ?? job.data, token, true)
          console.log(`JMORA[CompleteAndRemove]==================> ${jobId}`, 4)
          await job.remove()
        } catch (error) {
          console.error(`Error completando job ${jobId}:`, error)
        }
        break

      default:
        console.warn(`Acción ${action} no soportada.`)
    }
  }

  // async getJobStatus(jobId: string): Promise<string | null> {
  //   const job = await this.queue.getJob(jobId)
  //   if (!job) return null

  //   const isCompleted = await job.isCompleted()
  //   if (isCompleted) return 'completed'

  //   const isFailed = await job.isFailed()
  //   if (isFailed) return 'failed'

  //   const isActive = await job.isActive()
  //   if (isActive) return 'active'

  //   const isWaiting = await job.isWaiting()
  //   if (isWaiting) return 'waiting'

  //   const isDelayed = await job.isDelayed()
  //   if (isDelayed) return 'delayed'

  //   return 'unknown'
  // }
}
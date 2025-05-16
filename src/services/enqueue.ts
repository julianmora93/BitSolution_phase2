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

  getAllMeessages = async (): Promise<Job<T>[]> =>
    this.queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'])

  getWaitingMeessages = async (): Promise<Job<T>[]> => this.queue.getJobs(['waiting'])

  removeAllMessages = async (): Promise<void> => await this.queue.obliterate({ force: true })

  getCountWaitingMessages = async (): Promise<number> => (await this.queue.getJobs(['waiting'])).length

  async markJob(jobId: string, action: JobAction, payload?: any): Promise<void> {
    const job = await this.queue.getJob(jobId)

    if (!job) return

    switch (action) {
      case JobAction.UpdateData:
        await job.updateData({ ...job.data, ...payload })
        break

      case JobAction.Complete:
        try {
          const token = (job as any).token
          if (!token) return
          await job.moveToCompleted(payload ?? job.data, token, true)
        } catch (error) {
          console.error(`Error completing job ${jobId}:`, error)
        }
        break

      case JobAction.Remove:
        await job.remove()
        break

      case JobAction.Fail:
        try {
          const token = (job as any).token
          if (!token) return
          await job.moveToFailed(new Error(payload?.error || 'General error.'), token, true)
        } catch (error) {
          console.error(`Failed to mark job: ${jobId}:`, error)
        }
        break

      case JobAction.CompleteAndRemove:
        try {
          const token = (job as any).token
          if (!token) return
          await job.moveToCompleted(payload ?? job.data, token, true)
          await job.remove()
        } catch (error) {
          console.error(`Error completing job ${jobId}:`, error)
        }
        break

      default:
        console.warn(`Action ${action} is not supported.`)
    }
  }
}
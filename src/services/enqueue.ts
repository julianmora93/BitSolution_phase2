/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Queue as BullQueue, JobsOptions } from 'bullmq';

export default class EnqueueService<T = any> {
  private queue: BullQueue<T>;

  constructor(queue: BullQueue<T>) {
    this.queue = queue;
  }

  async add(jobName: any, data: T, opts?: JobsOptions) {
    return this.queue.add(jobName, data as any, opts);
  }
}
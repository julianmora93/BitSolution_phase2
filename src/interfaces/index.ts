/*
 * Copyright (c) 2023 Bit Solution Group
 */

export type UserEntity = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export type ExistingUserEntity = {
  id: number
  email: string
  username: string
}

export type PostNotification = {
  userId: number
  postId: number
  title: string
  body: string
}

export enum JobAction {
  UpdateData = 'updateData',
  Complete = 'complete',
  Remove = 'remove',
  Fail = 'fail',
  CompleteAndRemove = 'completeAndRemove',
}
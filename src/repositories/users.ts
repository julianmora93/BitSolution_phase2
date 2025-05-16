/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Prisma, PrismaClient } from '@prisma/client'
import { Sql } from '@prisma/client/runtime'
import { ExistingUserEntity } from '../interfaces'

const getExistingUsers = async (prisma: PrismaClient): Promise<ExistingUserEntity[]> =>
  prisma.$queryRaw<ExistingUserEntity[]>(Prisma.sql`SELECT id, email, username FROM users`)

const createManyUsers = async (prisma: PrismaClient, users: any[]) => {
  if (users.length === 0) return
  const values = users.map(
    (u) =>
      Prisma.sql`(
        ${u.id}, 
        ${u.name}, 
        ${u.username}, 
        ${u.email}, 
        ${u.phone}, 
        ${u.website}, 
        ${Prisma.sql`CAST(
          ${JSON.stringify(u.address)} AS jsonb)`}, 
        ${Prisma.sql`CAST(
          ${JSON.stringify(u.company)} AS jsonb)`})`,
  )
  await prisma.$executeRaw(
    Prisma.sql`INSERT INTO users (id, name, username, email, phone, website, address, company) VALUES ${Prisma.join(
      values,
    )} ON CONFLICT (id) DO NOTHING`,
  )
}

const findUsers = async (
  prisma: PrismaClient,
  filters: {
    name?: string
    username?: string
    email?: string
    phone?: string
    website?: string
  },
) => {
  let whereClauses: Sql[] = []
  if (filters.name) whereClauses.push(Prisma.sql`name ILIKE ${'%' + filters.name + '%'}`)
  if (filters.username) whereClauses.push(Prisma.sql`username ILIKE ${'%' + filters.username + '%'}`)
  if (filters.email) whereClauses.push(Prisma.sql`email ILIKE ${'%' + filters.email + '%'}`)
  if (filters.phone) whereClauses.push(Prisma.sql`phone ILIKE ${'%' + filters.phone + '%'}`)
  if (filters.website) whereClauses.push(Prisma.sql`website ILIKE ${'%' + filters.website + '%'}`)

  const where = whereClauses.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}` : Prisma.empty

  return prisma.$queryRaw<any>(
    Prisma.sql`SELECT 
        id, 
        name, 
        username, 
        email, 
        phone, 
        website, 
        address, 
        company 
      FROM users ${where}`,
  )
}

const getUserById = async (prisma: PrismaClient, id: number) => {
  const user = await prisma.$queryRaw<any>(
    Prisma.sql`SELECT 
        id, 
        name, 
        username, 
        email, 
        phone, 
        website, 
        address, 
        company 
      FROM users WHERE id = ${id} LIMIT 1`,
  )
  if (user && user.length === 0) return null
  return user[0]
}

export { getExistingUsers, createManyUsers, findUsers, getUserById }
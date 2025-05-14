/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Prisma } from '@prisma/client'
import { Sql } from '@prisma/client/runtime'

const getData = (clientEmail: string): Sql => Prisma.sql`SELECT * FROM SOME_DATABASE`

export { getData }

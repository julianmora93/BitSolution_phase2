// /*
//  * Copyright (c) 2023 Bit Solution Group
//  */

// import { Cache } from '../plugins/redis'

// export default class DemoCache {
//   store: Cache

//   constructor(store: Cache) {
//     this.store = store
//   }

//   async get(key: string, factoryValue: any, ttl: number, clearCache = false) {
//     let value = clearCache ? undefined : await this.store.get(key)

//     if (value === undefined) {
//       value = await factoryValue()
//       await this.store.set(key, value, ttl)
//     }

//     return value
//   }
// }

import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

const result = config({ path: resolve(process.cwd(), '.env') })
console.log('Dotenv result:', result)
console.log('DATABASE_URL:', process.env.DATABASE_URL)

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? ''
  }
})

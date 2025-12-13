import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file for local development
config({ path: resolve(process.cwd(), '.env') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? ''
  }
})

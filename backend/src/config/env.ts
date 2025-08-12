import dotenv from 'dotenv'

// load .env file into process.env
dotenv.config()

// get env var or throw if missing
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

// centralized app config
export const ENV = {
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  PORT: parseInt(process.env.PORT || '3000', 10)
}

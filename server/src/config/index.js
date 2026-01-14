module.exports = {
  hana: {
    driver: process.env.HANA_DRIVER || 'HDBODBC',
    serverNode: process.env.HANA_SERVERNODE,
    host: process.env.HANA_HOST,
    port: process.env.HANA_PORT,
    user: process.env.HANA_USER,
    password: process.env.HANA_PASSWORD,
    database: process.env.HANA_DATABASE,
    schema: process.env.HANA_SCHEMA || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  useIda: process.env.USE_IDA === 'true' || false,
  ida: {
    url: process.env.IDA_API_URL || null,
    apiKey: process.env.IDA_API_KEY || null
  }
}


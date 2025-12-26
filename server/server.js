import mongoose from 'mongoose'
import config from './../config/config'
import app from './express'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri)
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

const isProd = config.env === 'production'
const initialPort = Number(config.port) || 5000
const maxPortRetries = isProd ? 0 : 10

const startServer = (port, attemptsLeft) => {
  const server = app.listen(port, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('Server started on port %s.', port)
  })

  server.on('error', (err) => {
    if (!isProd && err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1
      console.warn('Port %s in use; retrying on %s...', port, nextPort)
      startServer(nextPort, attemptsLeft - 1)
      return
    }
    console.error(err)
    process.exit(1)
  })
}

startServer(initialPort, maxPortRetries)

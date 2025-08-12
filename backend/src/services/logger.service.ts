import pino from 'pino'
import path from 'path'

// absolute path to backend.log
const logFile = path.resolve(process.cwd(), 'logs', 'backend.log')

// set logging detail level
const level = 'info'

const transport = pino.transport({
  targets: [

    // create logs on consol
    {
      target: 'pino-pretty',
      level,
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy/mm/dd HH:MM:ss',
        ignore: 'pid,hostname'
      }
    },

    // create logs on backend.log file
    {
      target: 'pino-pretty',
      level,
      options: {
        colorize: false,
        translateTime: 'SYS:yyyy/mm/dd HH:MM:ss',
        ignore: 'pid,hostname',
        destination: logFile,   // write pretty logs to file
        mkdir: true             // create logs folder if missing
      }
    }
  ]
})

export const logger = pino({ level }, transport)

import BeeQ from 'bee-queue'
import { logger } from '@/server'
import { env } from '@/common/utils/envConfig'

type EventQJob = {
    eventId: string
    userId: string
    eventLogId?: string
    metadata?: any
}

const queue = new BeeQ('eventQueue', {
    redis: {
        url: env.REDIS_URL,
    },
})

queue.process(async (job) => {
    logger.info(`Processing job ${job.id}`)
    logger.info(job.data)
})

export const addJob = async (data: EventQJob) => queue.createJob(data).save()

export default queue
import { EventLog, Event, Prisma, CommunityRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { communityService } from '../community/communityService'
import { QueryPaging } from '@/common/utils/commonTypes'

export class EventService {
    /**
     * Get all events
     * @returns all events
     */
    async getAllEvents(where?: Prisma.EventWhereInput, include?: Prisma.EventInclude, paging?: QueryPaging): Promise<Event[]> {
        return dbClient.event.findMany({
            where,
            include,
            skip: paging?.skip || 0,
            take: paging?.take || 10,
        })
    }

    /**
     * Create a new event
     * @param userId: the user performing the action
     * @param data: the data to create the event
     * @returns the created event
     */
    async createEvent(userId: string, data: Prisma.EventUncheckedCreateInput): Promise<Event> {
        // check if the user is authorized to create an event
        const community = await communityService.findByIdWithEditAccess(data.communityId, userId)

        if (!community) {
            throw new CustomError('Invalid community or access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                communityId: data.communityId,
            })
        }

        return dbClient.event.create({
            data,
        })
    }

    // Get all events
    async logEvent(data: Prisma.EventLogUncheckedCreateInput): Promise<EventLog> {
        return dbClient.eventLog.create({
            data,
        })
    }

    // Get an event by ID
    async getEventByTag(tag: string, communityId?: string): Promise<Event | null> {
        return dbClient.event.findFirst({
            where: {
                tag: tag,
                communityId: communityId
            }
        })
    }

    /**
     * Update an event
     * @param userId: the user performing the action
     * @param eventId: the id of the event
     * @param data: the data to update
     * @returns the updated event
     */
    async updateEvent(userId: string, eventId: string, data: Prisma.EventUpdateInput): Promise<Event> {
        const eventDetails = await dbClient.event.findFirst({
            where: {
                id: eventId
            },
            include: {
                // include the community to check if the user is an admin
                community: {
                    include: {
                        memberships: {
                            where: {
                                userId: userId,
                                communityRole: CommunityRole.ADMIN,
                            }
                        }
                    }
                }
            }
        })

        if (!eventDetails) {
            throw new CustomError("Unknown event", CustomErrorCode.UNKNOWN_EVENT, {
                eventId,
            })
        } else if (eventDetails.createdById !== userId && eventDetails.community?.memberships.length === 0) {
            throw new CustomError("Invalid access control", CustomErrorCode.MUST_BE_EVENT_OWNER_OR_COMMUNITY_ADMIN, {
                eventId,
            })
        }

        return dbClient.event.update({
            where: {
                id: eventId
            },
            data,
        })
    }

    // Delete an event
    async deleteEvent(eventId: string): Promise<void> {
        throw new Error("Not implemented")
    }
}

export const eventService = new EventService()

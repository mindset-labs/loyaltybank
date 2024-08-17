import dbClient from '@/db'
import { Community, CommunityStatus, Prisma } from '@prisma/client'

export default {
    // Determine if a community is accessible by a certain user
    async accessibleByUser(userId: string, communityId: string, include: Prisma.CommunityInclude): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id: communityId,
                OR: [
                    // community is public and active
                    {
                        status: CommunityStatus.ACTIVE,
                        isPublic: true
                    },
                    // OR the community is created by the user
                    { createdById: userId },
                    // OR the user is a member of the community
                    {
                        memberships: {
                            some: {
                                userId,
                            }
                        }
                    }
                ]
            }
        })
    }
}
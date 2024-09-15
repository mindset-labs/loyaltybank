import { Prisma, Invite, InviteStatus } from '@prisma/client'
import dbClient from '@/db'
import { QueryPaging } from '@/common/utils/commonTypes'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { communityService } from '../community/communityService'

export class InviteService {
    /**
     * Create an invite
     * @param userId: the id of the user creating the invite
     * @param inviteData: the data for the invite
     * @returns the created invite
     */
    async createInvite(userId: string, inviteData: Prisma.InviteUncheckedCreateWithoutInviteByInput): Promise<Invite> {
        return dbClient.invite.create({
            data: {
                ...inviteData,
                inviteById: userId,
            }
        })
    }

    /**
     * Accept an invite
     * @param userId: the id of the user accepting the invite
     * @param inviteCode: the code of the invite to accept
     * @param communityId: the id of the community to accept the invite for
     * @returns the updated invite
     */
    async acceptInvite(userId: string, inviteCode: string): Promise<Invite> {
        const invite = await dbClient.invite.findFirst({
            where: {
                code: inviteCode,
            },
        })

        if (!invite) {
            throw new CustomError('Invite not found', CustomErrorCode.INVITE_NOT_FOUND)
        } else if (invite.status !== InviteStatus.OPEN) {
            throw new CustomError('Invite closed', CustomErrorCode.INVITE_NOT_AVAILABLE)
        }

        return dbClient.$transaction(async () => {
            const updatedInvite = await dbClient.invite.update({
                where: {
                    id: invite.id,
                },
                data: {
                    uses: {
                        increment: 1,
                    },
                    status: invite.maxUses && invite.uses + 1 >= invite.maxUses ? InviteStatus.CLOSED : InviteStatus.OPEN,
                }
            })

            await communityService.joinCommunity(invite.communityId, userId, {
                ignorePublicCheck: true,
                createWallet: true,
                inviteId: invite.id,
            })

            return updatedInvite
        })
    }

    /**
     * Query invites
     * @param where: the where clause for the query
     * @param include: the include for the query
     * @param paging: the paging for the query
     * @returns the queried invites and total count
     */
    async queryInvites(
        where: Prisma.InviteWhereInput,
        include: Prisma.InviteInclude,
        paging: QueryPaging
    ): Promise<{
        invites: Invite[],
        total: number,
    }> {
        const results = await dbClient.$transaction([
            dbClient.invite.findMany({
                where,
                include,
                skip: paging.skip || 0,
                take: paging.take || 100,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            dbClient.invite.count({ where })
        ])

        return {
            invites: results[0],
            total: results[1],
        }
    }
}

export const inviteService = new InviteService()

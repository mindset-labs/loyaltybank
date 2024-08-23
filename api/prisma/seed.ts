import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: 'alice2@prisma.io' },
        update: {},
        create: {
            email: 'alice2@prisma.io',
            name: 'Alice',
            password: bcrypt.hashSync('password', 10),
            role: 'ADMIN',
        },
    })
    const bob = await prisma.user.upsert({
        where: { email: 'bob2@prisma.io' },
        update: {},
        create: {
            email: 'bob2@prisma.io',
            name: 'Bob',
            password: bcrypt.hashSync('password', 10),
        },
    })
    const apiKey = await prisma.apiKey.upsert({
        where: {
            key: 'key',
        },
        update: {},
        create: {
            key: 'key',
            secret: bcrypt.hashSync('secret', 10),
            createdById: alice.id,
        },
    })
}

// start the seed
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

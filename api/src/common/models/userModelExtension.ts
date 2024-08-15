import db from '@/db'

// Add a new method to the PrismaClient class
export default {
    // Find a user by their email
    async findByEmail(email: string) {
        return db.user.findFirst({ where: { email } })
    }
}
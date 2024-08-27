import bcrypt from 'bcrypt'
import ShortUniqueId from 'short-unique-id'

const { randomUUID } = new ShortUniqueId({ length: 10 })
const { randomUUID: randomShortHex } = new ShortUniqueId({ length: 7, dictionary: 'hex' })

export const generateUUID = (): string => randomUUID()
export const generateApiKey = (): string => randomShortHex()

export const generateApiSecret = async (): Promise<{ secretPlainText: string, secretHashed: string }> => {
    const secretPlainText = generateApiKey()
    const secretHashed = await bcrypt.hash(secretPlainText, 10)

    return { secretPlainText, secretHashed }
}

import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ApiKeyScalarFieldEnumSchema = z.enum(['id','key','description','metadata','status','accessLevel','secret','createdById','createdAt','updatedAt']);

export const CommunityScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','metadata','pointsTokenName','isPublic','status','createdById','createdAt','updatedAt']);

export const EventScalarFieldEnumSchema = z.enum(['id','name','description','conditions','actions','createdById','communityId','version','createdAt','updatedAt']);

export const MembershipScalarFieldEnumSchema = z.enum(['id','userId','communityId','teir','communityRole','tags','nftTokenId','nftMetadata','membershipMetadata','membershipStatus','createdAt','updatedAt']);

export const TransactionScalarFieldEnumSchema = z.enum(['id','amount','transactionType','transactionSubtype','transactionStatus','description','senderId','receiverId','senderWalletId','receiverWalletId','communityId','eventId','metadata','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','phoneNumber','is2FAEnabled','twoFactorSecret','role','resetPasswordToken','managedById','createdAt','updatedAt']);

export const UserOnWalletScalarFieldEnumSchema = z.enum(['userId','walletId','role','dailyLimit','weeklyLimit','monthlyLimit','metadata','createdAt','updatedAt']);

export const WalletScalarFieldEnumSchema = z.enum(['id','name','address','token','communityId','balance','isShared','ownerId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const ApiKeyStatusSchema = z.enum(['ACTIVE','INACTIVE','ARCHIVED']);

export type ApiKeyStatusType = `${z.infer<typeof ApiKeyStatusSchema>}`

export const ApiKeyAccessLevelSchema = z.enum(['READ_ONLY','READ_WRITE']);

export type ApiKeyAccessLevelType = `${z.infer<typeof ApiKeyAccessLevelSchema>}`

export const CommunityStatusSchema = z.enum(['DRAFT','ACTIVE','INACTIVE','ARCHIVED']);

export type CommunityStatusType = `${z.infer<typeof CommunityStatusSchema>}`

export const MembershipTierSchema = z.enum(['BASIC','PREMIUM','GOLD','PLATINUM']);

export type MembershipTierType = `${z.infer<typeof MembershipTierSchema>}`

export const CommunityRoleSchema = z.enum(['MEMBER','MODERATOR','ADMIN']);

export type CommunityRoleType = `${z.infer<typeof CommunityRoleSchema>}`

export const MembershipStatusSchema = z.enum(['PENDING','ACTIVE','INACTIVE','SUSPENDED','CANCELLED']);

export type MembershipStatusType = `${z.infer<typeof MembershipStatusSchema>}`

export const TransactionTypeSchema = z.enum(['DEPOSIT','WITHDRAW','TRANSFER','REWARD']);

export type TransactionTypeType = `${z.infer<typeof TransactionTypeSchema>}`

export const TransactionSubtypeSchema = z.enum(['BANK_TRANSFER','CASH','BALANCE','CRYPTO','POINTS']);

export type TransactionSubtypeType = `${z.infer<typeof TransactionSubtypeSchema>}`

export const TransactionStatusSchema = z.enum(['PENDING','COMPLETED','FAILED']);

export type TransactionStatusType = `${z.infer<typeof TransactionStatusSchema>}`

export const RoleSchema = z.enum(['SYSTEM','SYSTEM_ADMIN','ADMIN','MANAGER','USER','MANAGED_USER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const WalletRoleSchema = z.enum(['OWNER','ADMIN','MEMBER']);

export type WalletRoleType = `${z.infer<typeof WalletRoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// API KEY SCHEMA
/////////////////////////////////////////

export const ApiKeySchema = z.object({
  status: ApiKeyStatusSchema,
  accessLevel: ApiKeyAccessLevelSchema,
  id: z.string(),
  key: z.string(),
  description: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  secret: z.string(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ApiKey = z.infer<typeof ApiKeySchema>

/////////////////////////////////////////
// API KEY PARTIAL SCHEMA
/////////////////////////////////////////

export const ApiKeyPartialSchema = ApiKeySchema.partial()

export type ApiKeyPartial = z.infer<typeof ApiKeyPartialSchema>

/////////////////////////////////////////
// COMMUNITY SCHEMA
/////////////////////////////////////////

export const CommunitySchema = z.object({
  status: CommunityStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  pointsTokenName: z.string().nullable(),
  isPublic: z.boolean(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Community = z.infer<typeof CommunitySchema>

/////////////////////////////////////////
// COMMUNITY PARTIAL SCHEMA
/////////////////////////////////////////

export const CommunityPartialSchema = CommunitySchema.partial()

export type CommunityPartial = z.infer<typeof CommunityPartialSchema>

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  conditions: JsonValueSchema.nullable(),
  actions: JsonValueSchema.nullable(),
  createdById: z.string(),
  communityId: z.string(),
  version: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Event = z.infer<typeof EventSchema>

/////////////////////////////////////////
// EVENT PARTIAL SCHEMA
/////////////////////////////////////////

export const EventPartialSchema = EventSchema.partial()

export type EventPartial = z.infer<typeof EventPartialSchema>

/////////////////////////////////////////
// MEMBERSHIP SCHEMA
/////////////////////////////////////////

export const MembershipSchema = z.object({
  teir: MembershipTierSchema,
  communityRole: CommunityRoleSchema,
  membershipStatus: MembershipStatusSchema,
  id: z.string(),
  userId: z.string(),
  communityId: z.string(),
  tags: z.string().array(),
  nftTokenId: z.string().nullable(),
  nftMetadata: JsonValueSchema.nullable(),
  membershipMetadata: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Membership = z.infer<typeof MembershipSchema>

/////////////////////////////////////////
// MEMBERSHIP PARTIAL SCHEMA
/////////////////////////////////////////

export const MembershipPartialSchema = MembershipSchema.partial()

export type MembershipPartial = z.infer<typeof MembershipPartialSchema>

/////////////////////////////////////////
// TRANSACTION SCHEMA
/////////////////////////////////////////

export const TransactionSchema = z.object({
  transactionType: TransactionTypeSchema,
  transactionSubtype: TransactionSubtypeSchema,
  transactionStatus: TransactionStatusSchema,
  id: z.string(),
  amount: z.number(),
  description: z.string().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().nullable(),
  eventId: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Transaction = z.infer<typeof TransactionSchema>

/////////////////////////////////////////
// TRANSACTION PARTIAL SCHEMA
/////////////////////////////////////////

export const TransactionPartialSchema = TransactionSchema.partial()

export type TransactionPartial = z.infer<typeof TransactionPartialSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().nullable(),
  is2FAEnabled: z.boolean(),
  twoFactorSecret: z.string().nullable(),
  resetPasswordToken: z.string().nullable(),
  managedById: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

/////////////////////////////////////////
// USER ON WALLET SCHEMA
/////////////////////////////////////////

export const UserOnWalletSchema = z.object({
  role: WalletRoleSchema,
  userId: z.string(),
  walletId: z.string(),
  dailyLimit: z.number().nullable(),
  weeklyLimit: z.number().nullable(),
  monthlyLimit: z.number().nullable(),
  metadata: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserOnWallet = z.infer<typeof UserOnWalletSchema>

/////////////////////////////////////////
// USER ON WALLET PARTIAL SCHEMA
/////////////////////////////////////////

export const UserOnWalletPartialSchema = UserOnWalletSchema.partial()

export type UserOnWalletPartial = z.infer<typeof UserOnWalletPartialSchema>

/////////////////////////////////////////
// WALLET SCHEMA
/////////////////////////////////////////

export const WalletSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  token: z.string(),
  communityId: z.string().nullable(),
  balance: z.number(),
  isShared: z.boolean(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Wallet = z.infer<typeof WalletSchema>

/////////////////////////////////////////
// WALLET PARTIAL SCHEMA
/////////////////////////////////////////

export const WalletPartialSchema = WalletSchema.partial()

export type WalletPartial = z.infer<typeof WalletPartialSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// API KEY
//------------------------------------------------------

export const ApiKeyIncludeSchema: z.ZodType<Prisma.ApiKeyInclude> = z.object({
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ApiKeyArgsSchema: z.ZodType<Prisma.ApiKeyDefaultArgs> = z.object({
  select: z.lazy(() => ApiKeySelectSchema).optional(),
  include: z.lazy(() => ApiKeyIncludeSchema).optional(),
}).strict();

export const ApiKeySelectSchema: z.ZodType<Prisma.ApiKeySelect> = z.object({
  id: z.boolean().optional(),
  key: z.boolean().optional(),
  description: z.boolean().optional(),
  metadata: z.boolean().optional(),
  status: z.boolean().optional(),
  accessLevel: z.boolean().optional(),
  secret: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// COMMUNITY
//------------------------------------------------------

export const CommunityIncludeSchema: z.ZodType<Prisma.CommunityInclude> = z.object({
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommunityCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CommunityArgsSchema: z.ZodType<Prisma.CommunityDefaultArgs> = z.object({
  select: z.lazy(() => CommunitySelectSchema).optional(),
  include: z.lazy(() => CommunityIncludeSchema).optional(),
}).strict();

export const CommunityCountOutputTypeArgsSchema: z.ZodType<Prisma.CommunityCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CommunityCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CommunityCountOutputTypeSelectSchema: z.ZodType<Prisma.CommunityCountOutputTypeSelect> = z.object({
  memberships: z.boolean().optional(),
  transactions: z.boolean().optional(),
  wallets: z.boolean().optional(),
  events: z.boolean().optional(),
}).strict();

export const CommunitySelectSchema: z.ZodType<Prisma.CommunitySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  metadata: z.boolean().optional(),
  pointsTokenName: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  status: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommunityCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVENT
//------------------------------------------------------

export const EventIncludeSchema: z.ZodType<Prisma.EventInclude> = z.object({
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const EventArgsSchema: z.ZodType<Prisma.EventDefaultArgs> = z.object({
  select: z.lazy(() => EventSelectSchema).optional(),
  include: z.lazy(() => EventIncludeSchema).optional(),
}).strict();

export const EventCountOutputTypeArgsSchema: z.ZodType<Prisma.EventCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EventCountOutputTypeSelectSchema: z.ZodType<Prisma.EventCountOutputTypeSelect> = z.object({
  transactions: z.boolean().optional(),
}).strict();

export const EventSelectSchema: z.ZodType<Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  conditions: z.boolean().optional(),
  actions: z.boolean().optional(),
  createdById: z.boolean().optional(),
  communityId: z.boolean().optional(),
  version: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MEMBERSHIP
//------------------------------------------------------

export const MembershipIncludeSchema: z.ZodType<Prisma.MembershipInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
}).strict()

export const MembershipArgsSchema: z.ZodType<Prisma.MembershipDefaultArgs> = z.object({
  select: z.lazy(() => MembershipSelectSchema).optional(),
  include: z.lazy(() => MembershipIncludeSchema).optional(),
}).strict();

export const MembershipSelectSchema: z.ZodType<Prisma.MembershipSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  communityId: z.boolean().optional(),
  teir: z.boolean().optional(),
  communityRole: z.boolean().optional(),
  tags: z.boolean().optional(),
  nftTokenId: z.boolean().optional(),
  nftMetadata: z.boolean().optional(),
  membershipMetadata: z.boolean().optional(),
  membershipStatus: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
}).strict()

// TRANSACTION
//------------------------------------------------------

export const TransactionIncludeSchema: z.ZodType<Prisma.TransactionInclude> = z.object({
  sender: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  receiver: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  senderWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
  receiverWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

export const TransactionArgsSchema: z.ZodType<Prisma.TransactionDefaultArgs> = z.object({
  select: z.lazy(() => TransactionSelectSchema).optional(),
  include: z.lazy(() => TransactionIncludeSchema).optional(),
}).strict();

export const TransactionSelectSchema: z.ZodType<Prisma.TransactionSelect> = z.object({
  id: z.boolean().optional(),
  amount: z.boolean().optional(),
  transactionType: z.boolean().optional(),
  transactionSubtype: z.boolean().optional(),
  transactionStatus: z.boolean().optional(),
  description: z.boolean().optional(),
  senderId: z.boolean().optional(),
  receiverId: z.boolean().optional(),
  senderWalletId: z.boolean().optional(),
  receiverWalletId: z.boolean().optional(),
  communityId: z.boolean().optional(),
  eventId: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  sender: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  receiver: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  senderWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
  receiverWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  myCommunities: z.union([z.boolean(),z.lazy(() => CommunityFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  transactionsSent: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  transactionsReceived: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
  sharedWallets: z.union([z.boolean(),z.lazy(() => UserOnWalletFindManyArgsSchema)]).optional(),
  managedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  managedByMe: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  apiKeys: z.union([z.boolean(),z.lazy(() => ApiKeyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  myCommunities: z.boolean().optional(),
  memberships: z.boolean().optional(),
  transactionsSent: z.boolean().optional(),
  transactionsReceived: z.boolean().optional(),
  wallets: z.boolean().optional(),
  sharedWallets: z.boolean().optional(),
  managedByMe: z.boolean().optional(),
  events: z.boolean().optional(),
  apiKeys: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.boolean().optional(),
  role: z.boolean().optional(),
  resetPasswordToken: z.boolean().optional(),
  managedById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  myCommunities: z.union([z.boolean(),z.lazy(() => CommunityFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  transactionsSent: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  transactionsReceived: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
  sharedWallets: z.union([z.boolean(),z.lazy(() => UserOnWalletFindManyArgsSchema)]).optional(),
  managedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  managedByMe: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  apiKeys: z.union([z.boolean(),z.lazy(() => ApiKeyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER ON WALLET
//------------------------------------------------------

export const UserOnWalletIncludeSchema: z.ZodType<Prisma.UserOnWalletInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  wallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
}).strict()

export const UserOnWalletArgsSchema: z.ZodType<Prisma.UserOnWalletDefaultArgs> = z.object({
  select: z.lazy(() => UserOnWalletSelectSchema).optional(),
  include: z.lazy(() => UserOnWalletIncludeSchema).optional(),
}).strict();

export const UserOnWalletSelectSchema: z.ZodType<Prisma.UserOnWalletSelect> = z.object({
  userId: z.boolean().optional(),
  walletId: z.boolean().optional(),
  role: z.boolean().optional(),
  dailyLimit: z.boolean().optional(),
  weeklyLimit: z.boolean().optional(),
  monthlyLimit: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  wallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
}).strict()

// WALLET
//------------------------------------------------------

export const WalletIncludeSchema: z.ZodType<Prisma.WalletInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  sentTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  receivedTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  users: z.union([z.boolean(),z.lazy(() => UserOnWalletFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WalletCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const WalletArgsSchema: z.ZodType<Prisma.WalletDefaultArgs> = z.object({
  select: z.lazy(() => WalletSelectSchema).optional(),
  include: z.lazy(() => WalletIncludeSchema).optional(),
}).strict();

export const WalletCountOutputTypeArgsSchema: z.ZodType<Prisma.WalletCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WalletCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WalletCountOutputTypeSelectSchema: z.ZodType<Prisma.WalletCountOutputTypeSelect> = z.object({
  sentTransactions: z.boolean().optional(),
  receivedTransactions: z.boolean().optional(),
  users: z.boolean().optional(),
}).strict();

export const WalletSelectSchema: z.ZodType<Prisma.WalletSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  address: z.boolean().optional(),
  token: z.boolean().optional(),
  communityId: z.boolean().optional(),
  balance: z.boolean().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  sentTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  receivedTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  users: z.union([z.boolean(),z.lazy(() => UserOnWalletFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WalletCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ApiKeyWhereInputSchema: z.ZodType<Prisma.ApiKeyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumApiKeyStatusFilterSchema),z.lazy(() => ApiKeyStatusSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => EnumApiKeyAccessLevelFilterSchema),z.lazy(() => ApiKeyAccessLevelSchema) ]).optional(),
  secret: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ApiKeyOrderByWithRelationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  accessLevel: z.lazy(() => SortOrderSchema).optional(),
  secret: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ApiKeyWhereUniqueInputSchema: z.ZodType<Prisma.ApiKeyWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    key: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    key: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumApiKeyStatusFilterSchema),z.lazy(() => ApiKeyStatusSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => EnumApiKeyAccessLevelFilterSchema),z.lazy(() => ApiKeyAccessLevelSchema) ]).optional(),
  secret: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ApiKeyOrderByWithAggregationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  accessLevel: z.lazy(() => SortOrderSchema).optional(),
  secret: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ApiKeyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ApiKeyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ApiKeyMinOrderByAggregateInputSchema).optional()
}).strict();

export const ApiKeyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ApiKeyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumApiKeyStatusWithAggregatesFilterSchema),z.lazy(() => ApiKeyStatusSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => EnumApiKeyAccessLevelWithAggregatesFilterSchema),z.lazy(() => ApiKeyAccessLevelSchema) ]).optional(),
  secret: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CommunityWhereInputSchema: z.ZodType<Prisma.CommunityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  pointsTokenName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumCommunityStatusFilterSchema),z.lazy(() => CommunityStatusSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict();

export const CommunityOrderByWithRelationInputSchema: z.ZodType<Prisma.CommunityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pointsTokenName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  memberships: z.lazy(() => MembershipOrderByRelationAggregateInputSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  transactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  wallets: z.lazy(() => WalletOrderByRelationAggregateInputSchema).optional(),
  events: z.lazy(() => EventOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CommunityWhereUniqueInputSchema: z.ZodType<Prisma.CommunityWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  pointsTokenName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumCommunityStatusFilterSchema),z.lazy(() => CommunityStatusSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional()
}).strict());

export const CommunityOrderByWithAggregationInputSchema: z.ZodType<Prisma.CommunityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pointsTokenName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CommunityCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CommunityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CommunityMinOrderByAggregateInputSchema).optional()
}).strict();

export const CommunityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CommunityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema),z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema),z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  pointsTokenName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isPublic: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumCommunityStatusWithAggregatesFilterSchema),z.lazy(() => CommunityStatusSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EventWhereInputSchema: z.ZodType<Prisma.EventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  actions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict();

export const EventOrderByWithRelationInputSchema: z.ZodType<Prisma.EventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  actions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  transactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const EventWhereUniqueInputSchema: z.ZodType<Prisma.EventWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema),z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  actions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict());

export const EventOrderByWithAggregationInputSchema: z.ZodType<Prisma.EventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  actions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EventCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EventAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EventMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EventSumOrderByAggregateInputSchema).optional()
}).strict();

export const EventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema),z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  conditions: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  actions: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const MembershipWhereInputSchema: z.ZodType<Prisma.MembershipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MembershipWhereInputSchema),z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipWhereInputSchema),z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  teir: z.union([ z.lazy(() => EnumMembershipTierFilterSchema),z.lazy(() => MembershipTierSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => EnumCommunityRoleFilterSchema),z.lazy(() => CommunityRoleSchema) ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nftMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipStatus: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema),z.lazy(() => MembershipStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
}).strict();

export const MembershipOrderByWithRelationInputSchema: z.ZodType<Prisma.MembershipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  teir: z.lazy(() => SortOrderSchema).optional(),
  communityRole: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  nftMetadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  membershipStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional()
}).strict();

export const MembershipWhereUniqueInputSchema: z.ZodType<Prisma.MembershipWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => MembershipWhereInputSchema),z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipWhereInputSchema),z.lazy(() => MembershipWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  teir: z.union([ z.lazy(() => EnumMembershipTierFilterSchema),z.lazy(() => MembershipTierSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => EnumCommunityRoleFilterSchema),z.lazy(() => CommunityRoleSchema) ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nftMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipStatus: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema),z.lazy(() => MembershipStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
}).strict());

export const MembershipOrderByWithAggregationInputSchema: z.ZodType<Prisma.MembershipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  teir: z.lazy(() => SortOrderSchema).optional(),
  communityRole: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  nftMetadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  membershipStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MembershipCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MembershipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MembershipMinOrderByAggregateInputSchema).optional()
}).strict();

export const MembershipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MembershipScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema),z.lazy(() => MembershipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  teir: z.union([ z.lazy(() => EnumMembershipTierWithAggregatesFilterSchema),z.lazy(() => MembershipTierSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => EnumCommunityRoleWithAggregatesFilterSchema),z.lazy(() => CommunityRoleSchema) ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  nftMetadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  membershipMetadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  membershipStatus: z.union([ z.lazy(() => EnumMembershipStatusWithAggregatesFilterSchema),z.lazy(() => MembershipStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TransactionWhereInputSchema: z.ZodType<Prisma.TransactionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  transactionType: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => EnumTransactionSubtypeFilterSchema),z.lazy(() => TransactionSubtypeSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => EnumTransactionStatusFilterSchema),z.lazy(() => TransactionStatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  senderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  senderWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  receiverWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  event: z.union([ z.lazy(() => EventNullableRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional().nullable(),
}).strict();

export const TransactionOrderByWithRelationInputSchema: z.ZodType<Prisma.TransactionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  transactionType: z.lazy(() => SortOrderSchema).optional(),
  transactionSubtype: z.lazy(() => SortOrderSchema).optional(),
  transactionStatus: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  senderWalletId: z.lazy(() => SortOrderSchema).optional(),
  receiverWalletId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  sender: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  receiver: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  senderWallet: z.lazy(() => WalletOrderByWithRelationInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletOrderByWithRelationInputSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional()
}).strict();

export const TransactionWhereUniqueInputSchema: z.ZodType<Prisma.TransactionWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  transactionType: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => EnumTransactionSubtypeFilterSchema),z.lazy(() => TransactionSubtypeSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => EnumTransactionStatusFilterSchema),z.lazy(() => TransactionStatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  senderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  senderWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  receiverWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  event: z.union([ z.lazy(() => EventNullableRelationFilterSchema),z.lazy(() => EventWhereInputSchema) ]).optional().nullable(),
}).strict());

export const TransactionOrderByWithAggregationInputSchema: z.ZodType<Prisma.TransactionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  transactionType: z.lazy(() => SortOrderSchema).optional(),
  transactionSubtype: z.lazy(() => SortOrderSchema).optional(),
  transactionStatus: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  senderWalletId: z.lazy(() => SortOrderSchema).optional(),
  receiverWalletId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TransactionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TransactionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TransactionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TransactionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TransactionSumOrderByAggregateInputSchema).optional()
}).strict();

export const TransactionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TransactionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema),z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema),z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  transactionType: z.union([ z.lazy(() => EnumTransactionTypeWithAggregatesFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => EnumTransactionSubtypeWithAggregatesFilterSchema),z.lazy(() => TransactionSubtypeSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => EnumTransactionStatusWithAggregatesFilterSchema),z.lazy(() => TransactionStatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  senderId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  senderWalletId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  receiverWalletId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  is2FAEnabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  twoFactorSecret: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  resetPasswordToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  managedById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  myCommunities: z.lazy(() => CommunityListRelationFilterSchema).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  transactionsSent: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletListRelationFilterSchema).optional(),
  managedBy: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  managedByMe: z.lazy(() => UserListRelationFilterSchema).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  is2FAEnabled: z.lazy(() => SortOrderSchema).optional(),
  twoFactorSecret: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  resetPasswordToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  managedById: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  myCommunities: z.lazy(() => CommunityOrderByRelationAggregateInputSchema).optional(),
  memberships: z.lazy(() => MembershipOrderByRelationAggregateInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  wallets: z.lazy(() => WalletOrderByRelationAggregateInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletOrderByRelationAggregateInputSchema).optional(),
  managedBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  managedByMe: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  events: z.lazy(() => EventOrderByRelationAggregateInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  is2FAEnabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  twoFactorSecret: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  resetPasswordToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  managedById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  myCommunities: z.lazy(() => CommunityListRelationFilterSchema).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  transactionsSent: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletListRelationFilterSchema).optional(),
  managedBy: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  managedByMe: z.lazy(() => UserListRelationFilterSchema).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  is2FAEnabled: z.lazy(() => SortOrderSchema).optional(),
  twoFactorSecret: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  resetPasswordToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  managedById: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  is2FAEnabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  twoFactorSecret: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  resetPasswordToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  managedById: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserOnWalletWhereInputSchema: z.ZodType<Prisma.UserOnWalletWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserOnWalletWhereInputSchema),z.lazy(() => UserOnWalletWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserOnWalletWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserOnWalletWhereInputSchema),z.lazy(() => UserOnWalletWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWalletRoleFilterSchema),z.lazy(() => WalletRoleSchema) ]).optional(),
  dailyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  weeklyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  monthlyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  wallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
}).strict();

export const UserOnWalletOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOnWalletOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  walletId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  dailyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weeklyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  monthlyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  wallet: z.lazy(() => WalletOrderByWithRelationInputSchema).optional()
}).strict();

export const UserOnWalletWhereUniqueInputSchema: z.ZodType<Prisma.UserOnWalletWhereUniqueInput> = z.object({
  userId_walletId: z.lazy(() => UserOnWalletUserIdWalletIdCompoundUniqueInputSchema)
})
.and(z.object({
  userId_walletId: z.lazy(() => UserOnWalletUserIdWalletIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserOnWalletWhereInputSchema),z.lazy(() => UserOnWalletWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserOnWalletWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserOnWalletWhereInputSchema),z.lazy(() => UserOnWalletWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWalletRoleFilterSchema),z.lazy(() => WalletRoleSchema) ]).optional(),
  dailyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  weeklyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  monthlyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  wallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
}).strict());

export const UserOnWalletOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOnWalletOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  walletId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  dailyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weeklyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  monthlyLimit: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserOnWalletCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserOnWalletAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserOnWalletMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserOnWalletMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserOnWalletSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserOnWalletScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserOnWalletScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserOnWalletScalarWhereWithAggregatesInputSchema),z.lazy(() => UserOnWalletScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserOnWalletScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserOnWalletScalarWhereWithAggregatesInputSchema),z.lazy(() => UserOnWalletScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  walletId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWalletRoleWithAggregatesFilterSchema),z.lazy(() => WalletRoleSchema) ]).optional(),
  dailyLimit: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  weeklyLimit: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  monthlyLimit: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WalletWhereInputSchema: z.ZodType<Prisma.WalletWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WalletWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isShared: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  users: z.lazy(() => UserOnWalletListRelationFilterSchema).optional()
}).strict();

export const WalletOrderByWithRelationInputSchema: z.ZodType<Prisma.WalletOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  isShared: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  users: z.lazy(() => UserOnWalletOrderByRelationAggregateInputSchema).optional()
}).strict();

export const WalletWhereUniqueInputSchema: z.ZodType<Prisma.WalletWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    address: z.string(),
    address_token: z.lazy(() => WalletAddressTokenCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string(),
    address: z.string(),
  }),
  z.object({
    id: z.string(),
    address_token: z.lazy(() => WalletAddressTokenCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    address: z.string(),
    address_token: z.lazy(() => WalletAddressTokenCompoundUniqueInputSchema),
  }),
  z.object({
    address: z.string(),
  }),
  z.object({
    address_token: z.lazy(() => WalletAddressTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().optional(),
  address: z.string().optional(),
  address_token: z.lazy(() => WalletAddressTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WalletWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isShared: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  users: z.lazy(() => UserOnWalletListRelationFilterSchema).optional()
}).strict());

export const WalletOrderByWithAggregationInputSchema: z.ZodType<Prisma.WalletOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  isShared: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WalletCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WalletAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WalletMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WalletMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WalletSumOrderByAggregateInputSchema).optional()
}).strict();

export const WalletScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WalletScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WalletScalarWhereWithAggregatesInputSchema),z.lazy(() => WalletScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WalletScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WalletScalarWhereWithAggregatesInputSchema),z.lazy(() => WalletScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  isShared: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ApiKeyCreateInputSchema: z.ZodType<Prisma.ApiKeyCreateInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutApiKeysInputSchema)
}).strict();

export const ApiKeyUncheckedCreateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ApiKeyUpdateInputSchema: z.ZodType<Prisma.ApiKeyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutApiKeysNestedInputSchema).optional()
}).strict();

export const ApiKeyUncheckedUpdateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyCreateManyInputSchema: z.ZodType<Prisma.ApiKeyCreateManyInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ApiKeyUpdateManyMutationInputSchema: z.ZodType<Prisma.ApiKeyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommunityCreateInputSchema: z.ZodType<Prisma.CommunityCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutCommunityInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutMyCommunitiesInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUpdateInputSchema: z.ZodType<Prisma.CommunityUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutCommunityNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityCreateManyInputSchema: z.ZodType<Prisma.CommunityCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CommunityUpdateManyMutationInputSchema: z.ZodType<Prisma.CommunityUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommunityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventCreateInputSchema: z.ZodType<Prisma.EventCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutEventsInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutEventsInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUncheckedCreateInputSchema: z.ZodType<Prisma.EventUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.string(),
  communityId: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUpdateInputSchema: z.ZodType<Prisma.EventUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateInputSchema: z.ZodType<Prisma.EventUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventCreateManyInputSchema: z.ZodType<Prisma.EventCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.string(),
  communityId: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventUpdateManyMutationInputSchema: z.ZodType<Prisma.EventUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipCreateInputSchema: z.ZodType<Prisma.MembershipCreateInput> = z.object({
  id: z.string().optional(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMembershipsInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutMembershipsInputSchema)
}).strict();

export const MembershipUncheckedCreateInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  communityId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipUpdateInputSchema: z.ZodType<Prisma.MembershipUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional()
}).strict();

export const MembershipUncheckedUpdateInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipCreateManyInputSchema: z.ZodType<Prisma.MembershipCreateManyInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  communityId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipUpdateManyMutationInputSchema: z.ZodType<Prisma.MembershipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionCreateInputSchema: z.ZodType<Prisma.TransactionCreateInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionUpdateInputSchema: z.ZodType<Prisma.TransactionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionCreateManyInputSchema: z.ZodType<Prisma.TransactionCreateManyInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionUpdateManyMutationInputSchema: z.ZodType<Prisma.TransactionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletCreateInputSchema: z.ZodType<Prisma.UserOnWalletCreateInput> = z.object({
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSharedWalletsInputSchema),
  wallet: z.lazy(() => WalletCreateNestedOneWithoutUsersInputSchema)
}).strict();

export const UserOnWalletUncheckedCreateInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedCreateInput> = z.object({
  userId: z.string(),
  walletId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletUpdateInputSchema: z.ZodType<Prisma.UserOnWalletUpdateInput> = z.object({
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSharedWalletsNestedInputSchema).optional(),
  wallet: z.lazy(() => WalletUpdateOneRequiredWithoutUsersNestedInputSchema).optional()
}).strict();

export const UserOnWalletUncheckedUpdateInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletCreateManyInputSchema: z.ZodType<Prisma.UserOnWalletCreateManyInput> = z.object({
  userId: z.string(),
  walletId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletUpdateManyMutationInputSchema: z.ZodType<Prisma.UserOnWalletUpdateManyMutationInput> = z.object({
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletCreateInputSchema: z.ZodType<Prisma.WalletCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional(),
  users: z.lazy(() => UserOnWalletCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateInputSchema: z.ZodType<Prisma.WalletUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUpdateInputSchema: z.ZodType<Prisma.WalletUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletCreateManyInputSchema: z.ZodType<Prisma.WalletCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletUpdateManyMutationInputSchema: z.ZodType<Prisma.WalletUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const EnumApiKeyStatusFilterSchema: z.ZodType<Prisma.EnumApiKeyStatusFilter> = z.object({
  equals: z.lazy(() => ApiKeyStatusSchema).optional(),
  in: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => NestedEnumApiKeyStatusFilterSchema) ]).optional(),
}).strict();

export const EnumApiKeyAccessLevelFilterSchema: z.ZodType<Prisma.EnumApiKeyAccessLevelFilter> = z.object({
  equals: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  in: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ApiKeyCountOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  accessLevel: z.lazy(() => SortOrderSchema).optional(),
  secret: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  accessLevel: z.lazy(() => SortOrderSchema).optional(),
  secret: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMinOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  accessLevel: z.lazy(() => SortOrderSchema).optional(),
  secret: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const EnumApiKeyStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumApiKeyStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApiKeyStatusSchema).optional(),
  in: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => NestedEnumApiKeyStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApiKeyStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApiKeyStatusFilterSchema).optional()
}).strict();

export const EnumApiKeyAccessLevelWithAggregatesFilterSchema: z.ZodType<Prisma.EnumApiKeyAccessLevelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  in: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => NestedEnumApiKeyAccessLevelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const EnumCommunityStatusFilterSchema: z.ZodType<Prisma.EnumCommunityStatusFilter> = z.object({
  equals: z.lazy(() => CommunityStatusSchema).optional(),
  in: z.lazy(() => CommunityStatusSchema).array().optional(),
  notIn: z.lazy(() => CommunityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => NestedEnumCommunityStatusFilterSchema) ]).optional(),
}).strict();

export const MembershipListRelationFilterSchema: z.ZodType<Prisma.MembershipListRelationFilter> = z.object({
  every: z.lazy(() => MembershipWhereInputSchema).optional(),
  some: z.lazy(() => MembershipWhereInputSchema).optional(),
  none: z.lazy(() => MembershipWhereInputSchema).optional()
}).strict();

export const TransactionListRelationFilterSchema: z.ZodType<Prisma.TransactionListRelationFilter> = z.object({
  every: z.lazy(() => TransactionWhereInputSchema).optional(),
  some: z.lazy(() => TransactionWhereInputSchema).optional(),
  none: z.lazy(() => TransactionWhereInputSchema).optional()
}).strict();

export const WalletListRelationFilterSchema: z.ZodType<Prisma.WalletListRelationFilter> = z.object({
  every: z.lazy(() => WalletWhereInputSchema).optional(),
  some: z.lazy(() => WalletWhereInputSchema).optional(),
  none: z.lazy(() => WalletWhereInputSchema).optional()
}).strict();

export const EventListRelationFilterSchema: z.ZodType<Prisma.EventListRelationFilter> = z.object({
  every: z.lazy(() => EventWhereInputSchema).optional(),
  some: z.lazy(() => EventWhereInputSchema).optional(),
  none: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const MembershipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MembershipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TransactionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WalletOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityCountOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  pointsTokenName: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  pointsTokenName: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityMinOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  pointsTokenName: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const EnumCommunityStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCommunityStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CommunityStatusSchema).optional(),
  in: z.lazy(() => CommunityStatusSchema).array().optional(),
  notIn: z.lazy(() => CommunityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => NestedEnumCommunityStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCommunityStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCommunityStatusFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const CommunityRelationFilterSchema: z.ZodType<Prisma.CommunityRelationFilter> = z.object({
  is: z.lazy(() => CommunityWhereInputSchema).optional(),
  isNot: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const EventCountOrderByAggregateInputSchema: z.ZodType<Prisma.EventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  conditions: z.lazy(() => SortOrderSchema).optional(),
  actions: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EventAvgOrderByAggregateInput> = z.object({
  version: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventMinOrderByAggregateInputSchema: z.ZodType<Prisma.EventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  version: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EventSumOrderByAggregateInputSchema: z.ZodType<Prisma.EventSumOrderByAggregateInput> = z.object({
  version: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumMembershipTierFilterSchema: z.ZodType<Prisma.EnumMembershipTierFilter> = z.object({
  equals: z.lazy(() => MembershipTierSchema).optional(),
  in: z.lazy(() => MembershipTierSchema).array().optional(),
  notIn: z.lazy(() => MembershipTierSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => NestedEnumMembershipTierFilterSchema) ]).optional(),
}).strict();

export const EnumCommunityRoleFilterSchema: z.ZodType<Prisma.EnumCommunityRoleFilter> = z.object({
  equals: z.lazy(() => CommunityRoleSchema).optional(),
  in: z.lazy(() => CommunityRoleSchema).array().optional(),
  notIn: z.lazy(() => CommunityRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => NestedEnumCommunityRoleFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const EnumMembershipStatusFilterSchema: z.ZodType<Prisma.EnumMembershipStatusFilter> = z.object({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => NestedEnumMembershipStatusFilterSchema) ]).optional(),
}).strict();

export const MembershipCountOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  teir: z.lazy(() => SortOrderSchema).optional(),
  communityRole: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  nftTokenId: z.lazy(() => SortOrderSchema).optional(),
  nftMetadata: z.lazy(() => SortOrderSchema).optional(),
  membershipMetadata: z.lazy(() => SortOrderSchema).optional(),
  membershipStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MembershipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  teir: z.lazy(() => SortOrderSchema).optional(),
  communityRole: z.lazy(() => SortOrderSchema).optional(),
  nftTokenId: z.lazy(() => SortOrderSchema).optional(),
  membershipStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MembershipMinOrderByAggregateInputSchema: z.ZodType<Prisma.MembershipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  teir: z.lazy(() => SortOrderSchema).optional(),
  communityRole: z.lazy(() => SortOrderSchema).optional(),
  nftTokenId: z.lazy(() => SortOrderSchema).optional(),
  membershipStatus: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumMembershipTierWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMembershipTierWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipTierSchema).optional(),
  in: z.lazy(() => MembershipTierSchema).array().optional(),
  notIn: z.lazy(() => MembershipTierSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => NestedEnumMembershipTierWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipTierFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipTierFilterSchema).optional()
}).strict();

export const EnumCommunityRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCommunityRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CommunityRoleSchema).optional(),
  in: z.lazy(() => CommunityRoleSchema).array().optional(),
  notIn: z.lazy(() => CommunityRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => NestedEnumCommunityRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCommunityRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCommunityRoleFilterSchema).optional()
}).strict();

export const EnumMembershipStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMembershipStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => NestedEnumMembershipStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const EnumTransactionTypeFilterSchema: z.ZodType<Prisma.EnumTransactionTypeFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeFilterSchema) ]).optional(),
}).strict();

export const EnumTransactionSubtypeFilterSchema: z.ZodType<Prisma.EnumTransactionSubtypeFilter> = z.object({
  equals: z.lazy(() => TransactionSubtypeSchema).optional(),
  in: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => NestedEnumTransactionSubtypeFilterSchema) ]).optional(),
}).strict();

export const EnumTransactionStatusFilterSchema: z.ZodType<Prisma.EnumTransactionStatusFilter> = z.object({
  equals: z.lazy(() => TransactionStatusSchema).optional(),
  in: z.lazy(() => TransactionStatusSchema).array().optional(),
  notIn: z.lazy(() => TransactionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => NestedEnumTransactionStatusFilterSchema) ]).optional(),
}).strict();

export const CommunityNullableRelationFilterSchema: z.ZodType<Prisma.CommunityNullableRelationFilter> = z.object({
  is: z.lazy(() => CommunityWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CommunityWhereInputSchema).optional().nullable()
}).strict();

export const WalletRelationFilterSchema: z.ZodType<Prisma.WalletRelationFilter> = z.object({
  is: z.lazy(() => WalletWhereInputSchema).optional(),
  isNot: z.lazy(() => WalletWhereInputSchema).optional()
}).strict();

export const EventNullableRelationFilterSchema: z.ZodType<Prisma.EventNullableRelationFilter> = z.object({
  is: z.lazy(() => EventWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => EventWhereInputSchema).optional().nullable()
}).strict();

export const TransactionCountOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  transactionType: z.lazy(() => SortOrderSchema).optional(),
  transactionSubtype: z.lazy(() => SortOrderSchema).optional(),
  transactionStatus: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  senderWalletId: z.lazy(() => SortOrderSchema).optional(),
  receiverWalletId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  transactionType: z.lazy(() => SortOrderSchema).optional(),
  transactionSubtype: z.lazy(() => SortOrderSchema).optional(),
  transactionStatus: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  senderWalletId: z.lazy(() => SortOrderSchema).optional(),
  receiverWalletId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionMinOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  transactionType: z.lazy(() => SortOrderSchema).optional(),
  transactionSubtype: z.lazy(() => SortOrderSchema).optional(),
  transactionStatus: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  senderWalletId: z.lazy(() => SortOrderSchema).optional(),
  receiverWalletId: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionSumOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const EnumTransactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTransactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional()
}).strict();

export const EnumTransactionSubtypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTransactionSubtypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionSubtypeSchema).optional(),
  in: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => NestedEnumTransactionSubtypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionSubtypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionSubtypeFilterSchema).optional()
}).strict();

export const EnumTransactionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTransactionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionStatusSchema).optional(),
  in: z.lazy(() => TransactionStatusSchema).array().optional(),
  notIn: z.lazy(() => TransactionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => NestedEnumTransactionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionStatusFilterSchema).optional()
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const CommunityListRelationFilterSchema: z.ZodType<Prisma.CommunityListRelationFilter> = z.object({
  every: z.lazy(() => CommunityWhereInputSchema).optional(),
  some: z.lazy(() => CommunityWhereInputSchema).optional(),
  none: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const UserOnWalletListRelationFilterSchema: z.ZodType<Prisma.UserOnWalletListRelationFilter> = z.object({
  every: z.lazy(() => UserOnWalletWhereInputSchema).optional(),
  some: z.lazy(() => UserOnWalletWhereInputSchema).optional(),
  none: z.lazy(() => UserOnWalletWhereInputSchema).optional()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ApiKeyListRelationFilterSchema: z.ZodType<Prisma.ApiKeyListRelationFilter> = z.object({
  every: z.lazy(() => ApiKeyWhereInputSchema).optional(),
  some: z.lazy(() => ApiKeyWhereInputSchema).optional(),
  none: z.lazy(() => ApiKeyWhereInputSchema).optional()
}).strict();

export const CommunityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CommunityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOnWalletOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOnWalletOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ApiKeyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  is2FAEnabled: z.lazy(() => SortOrderSchema).optional(),
  twoFactorSecret: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  resetPasswordToken: z.lazy(() => SortOrderSchema).optional(),
  managedById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  is2FAEnabled: z.lazy(() => SortOrderSchema).optional(),
  twoFactorSecret: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  resetPasswordToken: z.lazy(() => SortOrderSchema).optional(),
  managedById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  is2FAEnabled: z.lazy(() => SortOrderSchema).optional(),
  twoFactorSecret: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  resetPasswordToken: z.lazy(() => SortOrderSchema).optional(),
  managedById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const EnumWalletRoleFilterSchema: z.ZodType<Prisma.EnumWalletRoleFilter> = z.object({
  equals: z.lazy(() => WalletRoleSchema).optional(),
  in: z.lazy(() => WalletRoleSchema).array().optional(),
  notIn: z.lazy(() => WalletRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => NestedEnumWalletRoleFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserOnWalletUserIdWalletIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserOnWalletUserIdWalletIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  walletId: z.string()
}).strict();

export const UserOnWalletCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserOnWalletCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  walletId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  dailyLimit: z.lazy(() => SortOrderSchema).optional(),
  weeklyLimit: z.lazy(() => SortOrderSchema).optional(),
  monthlyLimit: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOnWalletAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserOnWalletAvgOrderByAggregateInput> = z.object({
  dailyLimit: z.lazy(() => SortOrderSchema).optional(),
  weeklyLimit: z.lazy(() => SortOrderSchema).optional(),
  monthlyLimit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOnWalletMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserOnWalletMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  walletId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  dailyLimit: z.lazy(() => SortOrderSchema).optional(),
  weeklyLimit: z.lazy(() => SortOrderSchema).optional(),
  monthlyLimit: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOnWalletMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserOnWalletMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  walletId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  dailyLimit: z.lazy(() => SortOrderSchema).optional(),
  weeklyLimit: z.lazy(() => SortOrderSchema).optional(),
  monthlyLimit: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOnWalletSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserOnWalletSumOrderByAggregateInput> = z.object({
  dailyLimit: z.lazy(() => SortOrderSchema).optional(),
  weeklyLimit: z.lazy(() => SortOrderSchema).optional(),
  monthlyLimit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumWalletRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumWalletRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => WalletRoleSchema).optional(),
  in: z.lazy(() => WalletRoleSchema).array().optional(),
  notIn: z.lazy(() => WalletRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => NestedEnumWalletRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWalletRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWalletRoleFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const WalletAddressTokenCompoundUniqueInputSchema: z.ZodType<Prisma.WalletAddressTokenCompoundUniqueInput> = z.object({
  address: z.string(),
  token: z.string()
}).strict();

export const WalletCountOrderByAggregateInputSchema: z.ZodType<Prisma.WalletCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  isShared: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WalletAvgOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WalletMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  isShared: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletMinOrderByAggregateInputSchema: z.ZodType<Prisma.WalletMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  isShared: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletSumOrderByAggregateInputSchema: z.ZodType<Prisma.WalletSumOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutApiKeysInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutApiKeysInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedCreateWithoutApiKeysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutApiKeysInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumApiKeyStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumApiKeyStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ApiKeyStatusSchema).optional()
}).strict();

export const EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumApiKeyAccessLevelFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ApiKeyAccessLevelSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutApiKeysNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutApiKeysNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedCreateWithoutApiKeysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutApiKeysInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutApiKeysInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutApiKeysInputSchema),z.lazy(() => UserUpdateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedUpdateWithoutApiKeysInputSchema) ]).optional(),
}).strict();

export const MembershipCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipCreateWithoutCommunityInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMyCommunitiesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutMyCommunitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMyCommunitiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TransactionCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionCreateWithoutCommunityInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WalletCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.WalletCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletCreateWithoutCommunityInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.EventCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventCreateWithoutCommunityInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipCreateWithoutCommunityInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionCreateWithoutCommunityInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WalletUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletCreateWithoutCommunityInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.EventUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventCreateWithoutCommunityInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const EnumCommunityStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCommunityStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CommunityStatusSchema).optional()
}).strict();

export const MembershipUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipCreateWithoutCommunityInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => MembershipUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => MembershipUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => MembershipUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMyCommunitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutMyCommunitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMyCommunitiesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMyCommunitiesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMyCommunitiesInputSchema),z.lazy(() => UserUpdateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMyCommunitiesInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionCreateWithoutCommunityInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WalletUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.WalletUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletCreateWithoutCommunityInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WalletUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => WalletUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WalletUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => WalletUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WalletUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => WalletUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.EventUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventCreateWithoutCommunityInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipCreateWithoutCommunityInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => MembershipUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => MembershipUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => MembershipUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionCreateWithoutCommunityInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletCreateWithoutCommunityInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => WalletCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WalletUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => WalletUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WalletUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => WalletUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WalletUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => WalletUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventCreateWithoutCommunityInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => EventCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutEventsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutEventsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CommunityCreateNestedOneWithoutEventsInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutEventsInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const TransactionCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionCreateWithoutEventInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutEventInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionCreateWithoutEventInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutEventsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEventsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutEventsInputSchema),z.lazy(() => UserUpdateWithoutEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEventsInputSchema) ]).optional(),
}).strict();

export const CommunityUpdateOneRequiredWithoutEventsNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutEventsInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutEventsInputSchema),z.lazy(() => CommunityUpdateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutEventsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionCreateWithoutEventInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionCreateWithoutEventInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutEventInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutEventInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutEventInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MembershipCreatetagsInputSchema: z.ZodType<Prisma.MembershipCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();

export const UserCreateNestedOneWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMembershipsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CommunityCreateNestedOneWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutMembershipsInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const EnumMembershipTierFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMembershipTierFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MembershipTierSchema).optional()
}).strict();

export const EnumCommunityRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCommunityRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CommunityRoleSchema).optional()
}).strict();

export const MembershipUpdatetagsInputSchema: z.ZodType<Prisma.MembershipUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const EnumMembershipStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMembershipStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MembershipStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutMembershipsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMembershipsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMembershipsInputSchema),z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]).optional(),
}).strict();

export const CommunityUpdateOneRequiredWithoutMembershipsNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutMembershipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutMembershipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutMembershipsInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutMembershipsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutMembershipsInputSchema),z.lazy(() => CommunityUpdateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutMembershipsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTransactionsSentInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsSentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionsSentInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTransactionsReceivedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsReceivedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionsReceivedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CommunityCreateNestedOneWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutTransactionsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const WalletCreateNestedOneWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletCreateNestedOneWithoutSentTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutSentTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutSentTransactionsInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional()
}).strict();

export const WalletCreateNestedOneWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletCreateNestedOneWithoutReceivedTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutReceivedTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutReceivedTransactionsInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional()
}).strict();

export const EventCreateNestedOneWithoutTransactionsInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutTransactionsInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumTransactionTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTransactionTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TransactionTypeSchema).optional()
}).strict();

export const EnumTransactionSubtypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTransactionSubtypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TransactionSubtypeSchema).optional()
}).strict();

export const EnumTransactionStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTransactionStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TransactionStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTransactionsSentNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsSentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionsSentInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTransactionsSentInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTransactionsSentInputSchema),z.lazy(() => UserUpdateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsSentInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTransactionsReceivedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsReceivedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionsReceivedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTransactionsReceivedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUpdateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsReceivedInputSchema) ]).optional(),
}).strict();

export const CommunityUpdateOneWithoutTransactionsNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneWithoutTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutTransactionsInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutTransactionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutTransactionsInputSchema),z.lazy(() => CommunityUpdateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutTransactionsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema: z.ZodType<Prisma.WalletUpdateOneRequiredWithoutSentTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutSentTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutSentTransactionsInputSchema).optional(),
  upsert: z.lazy(() => WalletUpsertWithoutSentTransactionsInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WalletUpdateToOneWithWhereWithoutSentTransactionsInputSchema),z.lazy(() => WalletUpdateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutSentTransactionsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema: z.ZodType<Prisma.WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutReceivedTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutReceivedTransactionsInputSchema).optional(),
  upsert: z.lazy(() => WalletUpsertWithoutReceivedTransactionsInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WalletUpdateToOneWithWhereWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUpdateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutReceivedTransactionsInputSchema) ]).optional(),
}).strict();

export const EventUpdateOneWithoutTransactionsNestedInputSchema: z.ZodType<Prisma.EventUpdateOneWithoutTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutTransactionsInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutTransactionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => EventWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => EventWhereInputSchema) ]).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutTransactionsInputSchema),z.lazy(() => EventUpdateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutTransactionsInputSchema) ]).optional(),
}).strict();

export const CommunityCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateWithoutCreatedByInputSchema).array(),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommunityCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MembershipCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MembershipCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipCreateWithoutUserInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionCreateNestedManyWithoutSenderInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutSenderInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionCreateWithoutSenderInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionCreateNestedManyWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutReceiverInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionCreateWithoutReceiverInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WalletCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.WalletCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletCreateWithoutOwnerInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateWithoutUserInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutManagedByMeInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByMeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutManagedByMeInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedManyWithoutManagedByInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutManagedByInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserCreateWithoutManagedByInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema),z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyManagedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.EventCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventCreateWithoutCreatedByInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApiKeyCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApiKeyCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateWithoutCreatedByInputSchema).array(),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommunityCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MembershipUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipCreateWithoutUserInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutSenderInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionCreateWithoutSenderInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutReceiverInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionCreateWithoutReceiverInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WalletUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletCreateWithoutOwnerInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateWithoutUserInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutManagedByInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutManagedByInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserCreateWithoutManagedByInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema),z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyManagedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventCreateWithoutCreatedByInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApiKeyCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const CommunityUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.CommunityUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateWithoutCreatedByInputSchema).array(),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommunityUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => CommunityUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommunityCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => CommunityUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommunityUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => CommunityUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommunityScalarWhereInputSchema),z.lazy(() => CommunityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MembershipUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipCreateWithoutUserInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutSenderNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutSenderNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionCreateWithoutSenderInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutReceiverNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutReceiverNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionCreateWithoutReceiverInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WalletUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.WalletUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletCreateWithoutOwnerInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WalletUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => WalletUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WalletUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => WalletUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WalletUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => WalletUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserOnWalletUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateWithoutUserInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutManagedByMeNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutManagedByMeNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByMeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutManagedByMeInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutManagedByMeInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutManagedByMeInputSchema),z.lazy(() => UserUpdateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedByMeInputSchema) ]).optional(),
}).strict();

export const UserUpdateManyWithoutManagedByNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutManagedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserCreateWithoutManagedByInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema),z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutManagedByInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutManagedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyManagedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutManagedByInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutManagedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutManagedByInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutManagedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.EventUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventCreateWithoutCreatedByInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ApiKeyUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.ApiKeyUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApiKeyUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApiKeyCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApiKeyUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApiKeyUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApiKeyScalarWhereInputSchema),z.lazy(() => ApiKeyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateWithoutCreatedByInputSchema).array(),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => CommunityCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommunityUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => CommunityUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommunityCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommunityWhereUniqueInputSchema),z.lazy(() => CommunityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => CommunityUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommunityUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => CommunityUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommunityScalarWhereInputSchema),z.lazy(() => CommunityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MembershipUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipCreateWithoutUserInputSchema).array(),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema),z.lazy(() => MembershipCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MembershipUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MembershipUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MembershipCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MembershipWhereUniqueInputSchema),z.lazy(() => MembershipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MembershipUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MembershipUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MembershipUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MembershipUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutSenderNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionCreateWithoutSenderInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutReceiverNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionCreateWithoutReceiverInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletCreateWithoutOwnerInputSchema).array(),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => WalletCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WalletUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => WalletUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WalletCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WalletWhereUniqueInputSchema),z.lazy(() => WalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WalletUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => WalletUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WalletUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => WalletUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateWithoutUserInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutManagedByNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutManagedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserCreateWithoutManagedByInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema),z.lazy(() => UserCreateOrConnectWithoutManagedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutManagedByInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutManagedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyManagedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutManagedByInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutManagedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutManagedByInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutManagedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventCreateWithoutCreatedByInputSchema).array(),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => EventCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => EventUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema),z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => EventUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => EventUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ApiKeyCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ApiKeyUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ApiKeyCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ApiKeyWhereUniqueInputSchema),z.lazy(() => ApiKeyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ApiKeyUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ApiKeyUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ApiKeyScalarWhereInputSchema),z.lazy(() => ApiKeyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSharedWalletsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSharedWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSharedWalletsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const WalletCreateNestedOneWithoutUsersInputSchema: z.ZodType<Prisma.WalletCreateNestedOneWithoutUsersInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutUsersInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional()
}).strict();

export const EnumWalletRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumWalletRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => WalletRoleSchema).optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutSharedWalletsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSharedWalletsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSharedWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSharedWalletsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSharedWalletsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSharedWalletsInputSchema),z.lazy(() => UserUpdateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSharedWalletsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateOneRequiredWithoutUsersNestedInputSchema: z.ZodType<Prisma.WalletUpdateOneRequiredWithoutUsersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WalletCreateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WalletCreateOrConnectWithoutUsersInputSchema).optional(),
  upsert: z.lazy(() => WalletUpsertWithoutUsersInputSchema).optional(),
  connect: z.lazy(() => WalletWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WalletUpdateToOneWithWhereWithoutUsersInputSchema),z.lazy(() => WalletUpdateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutUsersInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutWalletsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutWalletsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWalletsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TransactionCreateNestedManyWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutSenderWalletInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionCreateNestedManyWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutReceiverWalletInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommunityCreateNestedOneWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutWalletsInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutWalletsInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const UserOnWalletCreateNestedManyWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletCreateNestedManyWithoutWalletInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutSenderWalletInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutReceiverWalletInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedCreateNestedManyWithoutWalletInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyWalletInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutWalletsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutWalletsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWalletsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutWalletsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutWalletsInputSchema),z.lazy(() => UserUpdateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWalletsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutSenderWalletNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutSenderWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutReceiverWalletNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutReceiverWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityUpdateOneWithoutWalletsNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneWithoutWalletsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutWalletsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutWalletsInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutWalletsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutWalletsInputSchema),z.lazy(() => CommunityUpdateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutWalletsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUpdateManyWithoutWalletNestedInputSchema: z.ZodType<Prisma.UserOnWalletUpdateManyWithoutWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutSenderWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutSenderWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutSenderWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManySenderWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutSenderWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderWalletInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutSenderWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutReceiverWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutReceiverWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyReceiverWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutReceiverWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutReceiverWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateManyWithoutWalletNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema).array(),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema),z.lazy(() => UserOnWalletCreateOrConnectWithoutWalletInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpsertWithWhereUniqueWithoutWalletInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserOnWalletCreateManyWalletInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserOnWalletWhereUniqueInputSchema),z.lazy(() => UserOnWalletWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpdateWithWhereUniqueWithoutWalletInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutWalletInputSchema),z.lazy(() => UserOnWalletUpdateManyWithWhereWithoutWalletInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumApiKeyStatusFilterSchema: z.ZodType<Prisma.NestedEnumApiKeyStatusFilter> = z.object({
  equals: z.lazy(() => ApiKeyStatusSchema).optional(),
  in: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => NestedEnumApiKeyStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumApiKeyAccessLevelFilterSchema: z.ZodType<Prisma.NestedEnumApiKeyAccessLevelFilter> = z.object({
  equals: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  in: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumApiKeyStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumApiKeyStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApiKeyStatusSchema).optional(),
  in: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => NestedEnumApiKeyStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApiKeyStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApiKeyStatusFilterSchema).optional()
}).strict();

export const NestedEnumApiKeyAccessLevelWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumApiKeyAccessLevelWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  in: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  notIn: z.lazy(() => ApiKeyAccessLevelSchema).array().optional(),
  not: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => NestedEnumApiKeyAccessLevelWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumApiKeyAccessLevelFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCommunityStatusFilterSchema: z.ZodType<Prisma.NestedEnumCommunityStatusFilter> = z.object({
  equals: z.lazy(() => CommunityStatusSchema).optional(),
  in: z.lazy(() => CommunityStatusSchema).array().optional(),
  notIn: z.lazy(() => CommunityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => NestedEnumCommunityStatusFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumCommunityStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCommunityStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CommunityStatusSchema).optional(),
  in: z.lazy(() => CommunityStatusSchema).array().optional(),
  notIn: z.lazy(() => CommunityStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => NestedEnumCommunityStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCommunityStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCommunityStatusFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMembershipTierFilterSchema: z.ZodType<Prisma.NestedEnumMembershipTierFilter> = z.object({
  equals: z.lazy(() => MembershipTierSchema).optional(),
  in: z.lazy(() => MembershipTierSchema).array().optional(),
  notIn: z.lazy(() => MembershipTierSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => NestedEnumMembershipTierFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCommunityRoleFilterSchema: z.ZodType<Prisma.NestedEnumCommunityRoleFilter> = z.object({
  equals: z.lazy(() => CommunityRoleSchema).optional(),
  in: z.lazy(() => CommunityRoleSchema).array().optional(),
  notIn: z.lazy(() => CommunityRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => NestedEnumCommunityRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMembershipStatusFilterSchema: z.ZodType<Prisma.NestedEnumMembershipStatusFilter> = z.object({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => NestedEnumMembershipStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMembershipTierWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMembershipTierWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipTierSchema).optional(),
  in: z.lazy(() => MembershipTierSchema).array().optional(),
  notIn: z.lazy(() => MembershipTierSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => NestedEnumMembershipTierWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipTierFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipTierFilterSchema).optional()
}).strict();

export const NestedEnumCommunityRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCommunityRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CommunityRoleSchema).optional(),
  in: z.lazy(() => CommunityRoleSchema).array().optional(),
  notIn: z.lazy(() => CommunityRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => NestedEnumCommunityRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCommunityRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCommunityRoleFilterSchema).optional()
}).strict();

export const NestedEnumMembershipStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMembershipStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipStatusSchema).optional(),
  in: z.lazy(() => MembershipStatusSchema).array().optional(),
  notIn: z.lazy(() => MembershipStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => NestedEnumMembershipStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipStatusFilterSchema).optional()
}).strict();

export const NestedEnumTransactionTypeFilterSchema: z.ZodType<Prisma.NestedEnumTransactionTypeFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTransactionSubtypeFilterSchema: z.ZodType<Prisma.NestedEnumTransactionSubtypeFilter> = z.object({
  equals: z.lazy(() => TransactionSubtypeSchema).optional(),
  in: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => NestedEnumTransactionSubtypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTransactionStatusFilterSchema: z.ZodType<Prisma.NestedEnumTransactionStatusFilter> = z.object({
  equals: z.lazy(() => TransactionStatusSchema).optional(),
  in: z.lazy(() => TransactionStatusSchema).array().optional(),
  notIn: z.lazy(() => TransactionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => NestedEnumTransactionStatusFilterSchema) ]).optional(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedEnumTransactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTransactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional()
}).strict();

export const NestedEnumTransactionSubtypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTransactionSubtypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionSubtypeSchema).optional(),
  in: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionSubtypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => NestedEnumTransactionSubtypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionSubtypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionSubtypeFilterSchema).optional()
}).strict();

export const NestedEnumTransactionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTransactionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionStatusSchema).optional(),
  in: z.lazy(() => TransactionStatusSchema).array().optional(),
  notIn: z.lazy(() => TransactionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => NestedEnumTransactionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionStatusFilterSchema).optional()
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedEnumWalletRoleFilterSchema: z.ZodType<Prisma.NestedEnumWalletRoleFilter> = z.object({
  equals: z.lazy(() => WalletRoleSchema).optional(),
  in: z.lazy(() => WalletRoleSchema).array().optional(),
  notIn: z.lazy(() => WalletRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => NestedEnumWalletRoleFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumWalletRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumWalletRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => WalletRoleSchema).optional(),
  in: z.lazy(() => WalletRoleSchema).array().optional(),
  notIn: z.lazy(() => WalletRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => NestedEnumWalletRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWalletRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWalletRoleFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const UserCreateWithoutApiKeysInputSchema: z.ZodType<Prisma.UserCreateWithoutApiKeysInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutApiKeysInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutApiKeysInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutApiKeysInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutApiKeysInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedCreateWithoutApiKeysInputSchema) ]),
}).strict();

export const UserUpsertWithoutApiKeysInputSchema: z.ZodType<Prisma.UserUpsertWithoutApiKeysInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedUpdateWithoutApiKeysInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedCreateWithoutApiKeysInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutApiKeysInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutApiKeysInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutApiKeysInputSchema),z.lazy(() => UserUncheckedUpdateWithoutApiKeysInputSchema) ]),
}).strict();

export const UserUpdateWithoutApiKeysInputSchema: z.ZodType<Prisma.UserUpdateWithoutApiKeysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutApiKeysInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutApiKeysInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const MembershipCreateWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMembershipsInputSchema)
}).strict();

export const MembershipUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const MembershipCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.MembershipCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MembershipCreateManyCommunityInputSchema),z.lazy(() => MembershipCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserCreateWithoutMyCommunitiesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMyCommunitiesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMyCommunitiesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutMyCommunitiesInputSchema) ]),
}).strict();

export const TransactionCreateWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const TransactionCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyCommunityInputSchema),z.lazy(() => TransactionCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WalletCreateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const WalletCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.WalletCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WalletCreateManyCommunityInputSchema),z.lazy(() => WalletCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EventCreateWithoutCommunityInputSchema: z.ZodType<Prisma.EventCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutEventsInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const EventCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EventCreateManyCommunityInputSchema),z.lazy(() => EventCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MembershipUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MembershipUpdateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => MembershipCreateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const MembershipUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateWithoutCommunityInputSchema),z.lazy(() => MembershipUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const MembershipUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => MembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateManyMutationInputSchema),z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const MembershipScalarWhereInputSchema: z.ZodType<Prisma.MembershipScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MembershipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MembershipScalarWhereInputSchema),z.lazy(() => MembershipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  teir: z.union([ z.lazy(() => EnumMembershipTierFilterSchema),z.lazy(() => MembershipTierSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => EnumCommunityRoleFilterSchema),z.lazy(() => CommunityRoleSchema) ]).optional(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  nftTokenId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  nftMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipMetadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  membershipStatus: z.union([ z.lazy(() => EnumMembershipStatusFilterSchema),z.lazy(() => MembershipStatusSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUpsertWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserUpsertWithoutMyCommunitiesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMyCommunitiesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedCreateWithoutMyCommunitiesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMyCommunitiesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMyCommunitiesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMyCommunitiesInputSchema) ]),
}).strict();

export const UserUpdateWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserUpdateWithoutMyCommunitiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMyCommunitiesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMyCommunitiesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutCommunityInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const TransactionScalarWhereInputSchema: z.ZodType<Prisma.TransactionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  transactionType: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => EnumTransactionSubtypeFilterSchema),z.lazy(() => TransactionSubtypeSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => EnumTransactionStatusFilterSchema),z.lazy(() => TransactionStatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  senderId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  senderWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  receiverWalletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WalletUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WalletUpdateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const WalletUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WalletUpdateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const WalletUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => WalletScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WalletUpdateManyMutationInputSchema),z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const WalletScalarWhereInputSchema: z.ZodType<Prisma.WalletScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WalletScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WalletScalarWhereInputSchema),z.lazy(() => WalletScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isShared: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EventUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const EventUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutCommunityInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const EventUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema),z.lazy(() => EventUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const EventScalarWhereInputSchema: z.ZodType<Prisma.EventScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereInputSchema),z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  actions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  version: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutEventsInputSchema: z.ZodType<Prisma.UserCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutEventsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutEventsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutEventsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutEventsInputSchema) ]),
}).strict();

export const CommunityCreateWithoutEventsInputSchema: z.ZodType<Prisma.CommunityCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutCommunityInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutMyCommunitiesInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutEventsInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutEventsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutEventsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutEventsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutEventsInputSchema) ]),
}).strict();

export const TransactionCreateWithoutEventInputSchema: z.ZodType<Prisma.TransactionCreateWithoutEventInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
}).strict();

export const TransactionUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutEventInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutEventInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const TransactionCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyEventInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyEventInputSchema),z.lazy(() => TransactionCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutEventsInputSchema: z.ZodType<Prisma.UserUpsertWithoutEventsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEventsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutEventsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutEventsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutEventsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutEventsInputSchema) ]),
}).strict();

export const UserUpdateWithoutEventsInputSchema: z.ZodType<Prisma.UserUpdateWithoutEventsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutEventsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutEventsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const CommunityUpsertWithoutEventsInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutEventsInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutEventsInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutEventsInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutEventsInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutEventsInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutEventsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutEventsInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutEventsInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutEventsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutCommunityNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutEventsInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutEventsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutEventInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutEventInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutEventInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutEventInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutEventInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutEventInputSchema) ]),
}).strict();

export const UserCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateWithoutMembershipsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMembershipsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMembershipsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]),
}).strict();

export const CommunityCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityCreateWithoutMembershipsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutMyCommunitiesInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutMembershipsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutMembershipsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutMembershipsInputSchema) ]),
}).strict();

export const UserUpsertWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpsertWithoutMembershipsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMembershipsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMembershipsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMembershipsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMembershipsInputSchema) ]),
}).strict();

export const UserUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const CommunityUpsertWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutMembershipsInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutMembershipsInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutMembershipsInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutMembershipsInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutMembershipsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutMembershipsInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutMembershipsInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutMembershipsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserCreateWithoutTransactionsSentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTransactionsSentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTransactionsSentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsSentInputSchema) ]),
}).strict();

export const UserCreateWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserCreateWithoutTransactionsReceivedInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTransactionsReceivedInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTransactionsReceivedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsReceivedInputSchema) ]),
}).strict();

export const CommunityCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityCreateWithoutTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutCommunityInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutMyCommunitiesInputSchema),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutTransactionsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const WalletCreateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletCreateWithoutSentTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional(),
  users: z.lazy(() => UserOnWalletCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutSentTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutSentTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutSentTransactionsInputSchema) ]),
}).strict();

export const WalletCreateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletCreateWithoutReceivedTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional(),
  users: z.lazy(() => UserOnWalletCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutReceivedTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutReceivedTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutReceivedTransactionsInputSchema) ]),
}).strict();

export const EventCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.EventCreateWithoutTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutEventsInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutEventsInputSchema)
}).strict();

export const EventUncheckedCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutTransactionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.string(),
  communityId: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventCreateOrConnectWithoutTransactionsInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutTransactionsInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserUpsertWithoutTransactionsSentInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsSentInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsSentInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTransactionsSentInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTransactionsSentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsSentInputSchema) ]),
}).strict();

export const UserUpdateWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserUpdateWithoutTransactionsSentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTransactionsSentInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTransactionsSentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserUpsertWithoutTransactionsReceivedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsReceivedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionsReceivedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTransactionsReceivedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTransactionsReceivedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionsReceivedInputSchema) ]),
}).strict();

export const UserUpdateWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserUpdateWithoutTransactionsReceivedInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTransactionsReceivedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTransactionsReceivedInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const CommunityUpsertWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutTransactionsInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutTransactionsInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutTransactionsInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutTransactionsInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutCommunityNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const WalletUpsertWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUpsertWithoutSentTransactionsInput> = z.object({
  update: z.union([ z.lazy(() => WalletUpdateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutSentTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => WalletCreateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutSentTransactionsInputSchema) ]),
  where: z.lazy(() => WalletWhereInputSchema).optional()
}).strict();

export const WalletUpdateToOneWithWhereWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUpdateToOneWithWhereWithoutSentTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WalletUpdateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutSentTransactionsInputSchema) ]),
}).strict();

export const WalletUpdateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUpdateWithoutSentTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutSentTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUpsertWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUpsertWithoutReceivedTransactionsInput> = z.object({
  update: z.union([ z.lazy(() => WalletUpdateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutReceivedTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => WalletCreateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutReceivedTransactionsInputSchema) ]),
  where: z.lazy(() => WalletWhereInputSchema).optional()
}).strict();

export const WalletUpdateToOneWithWhereWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUpdateToOneWithWhereWithoutReceivedTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WalletUpdateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutReceivedTransactionsInputSchema) ]),
}).strict();

export const WalletUpdateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUpdateWithoutReceivedTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutReceivedTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const EventUpsertWithoutTransactionsInputSchema: z.ZodType<Prisma.EventUpsertWithoutTransactionsInput> = z.object({
  update: z.union([ z.lazy(() => EventUpdateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedCreateWithoutTransactionsInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional()
}).strict();

export const EventUpdateToOneWithWhereWithoutTransactionsInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutTransactionsInput> = z.object({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutTransactionsInputSchema),z.lazy(() => EventUncheckedUpdateWithoutTransactionsInputSchema) ]),
}).strict();

export const EventUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.EventUpdateWithoutTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneRequiredWithoutEventsNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommunityCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutCommunityInputSchema).optional(),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const CommunityCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.CommunityCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CommunityCreateManyCreatedByInputSchema),z.lazy(() => CommunityCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MembershipCreateWithoutUserInputSchema: z.ZodType<Prisma.MembershipCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutMembershipsInputSchema)
}).strict();

export const MembershipUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MembershipUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  communityId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MembershipCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MembershipCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MembershipCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MembershipCreateManyUserInputSchema),z.lazy(() => MembershipCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TransactionCreateWithoutSenderInputSchema: z.ZodType<Prisma.TransactionCreateWithoutSenderInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutSenderInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutSenderInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutSenderInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema) ]),
}).strict();

export const TransactionCreateManySenderInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManySenderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManySenderInputSchema),z.lazy(() => TransactionCreateManySenderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TransactionCreateWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionCreateWithoutReceiverInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutReceiverInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutReceiverInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema) ]),
}).strict();

export const TransactionCreateManyReceiverInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyReceiverInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyReceiverInputSchema),z.lazy(() => TransactionCreateManyReceiverInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const WalletCreateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional(),
  users: z.lazy(() => UserOnWalletCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const WalletCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.WalletCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WalletCreateManyOwnerInputSchema),z.lazy(() => WalletCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserOnWalletCreateWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletCreateWithoutUserInput> = z.object({
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  wallet: z.lazy(() => WalletCreateNestedOneWithoutUsersInputSchema)
}).strict();

export const UserOnWalletUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedCreateWithoutUserInput> = z.object({
  walletId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserOnWalletCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserOnWalletCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserOnWalletCreateManyUserInputSchema),z.lazy(() => UserOnWalletCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserCreateWithoutManagedByMeInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutManagedByMeInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutManagedByMeInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByMeInputSchema) ]),
}).strict();

export const UserCreateWithoutManagedByInputSchema: z.ZodType<Prisma.UserCreateWithoutManagedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutManagedByInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutManagedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutManagedByInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutManagedByInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema) ]),
}).strict();

export const UserCreateManyManagedByInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyManagedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyManagedByInputSchema),z.lazy(() => UserCreateManyManagedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const EventCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.EventCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutEventsInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  communityId: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutEventInputSchema).optional()
}).strict();

export const EventCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const EventCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => EventCreateManyCreatedByInputSchema),z.lazy(() => EventCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ApiKeyCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ApiKeyUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ApiKeyCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ApiKeyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const ApiKeyCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.ApiKeyCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ApiKeyCreateManyCreatedByInputSchema),z.lazy(() => ApiKeyCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommunityUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CommunityUpdateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const CommunityUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutCreatedByInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const CommunityUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => CommunityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CommunityUpdateManyMutationInputSchema),z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const CommunityScalarWhereInputSchema: z.ZodType<Prisma.CommunityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CommunityScalarWhereInputSchema),z.lazy(() => CommunityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityScalarWhereInputSchema),z.lazy(() => CommunityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  pointsTokenName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  status: z.union([ z.lazy(() => EnumCommunityStatusFilterSchema),z.lazy(() => CommunityStatusSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const MembershipUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MembershipUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MembershipUpdateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MembershipCreateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MembershipUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MembershipUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MembershipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateWithoutUserInputSchema),z.lazy(() => MembershipUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const MembershipUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MembershipUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => MembershipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MembershipUpdateManyMutationInputSchema),z.lazy(() => MembershipUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutSenderInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutSenderInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutSenderInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutSenderInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutSenderInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutSenderInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderInputSchema) ]),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutReceiverInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutReceiverInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutReceiverInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutReceiverInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutReceiverInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutReceiverInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverInputSchema) ]),
}).strict();

export const WalletUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WalletUpdateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const WalletUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WalletUpdateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const WalletUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => WalletScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WalletUpdateManyMutationInputSchema),z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const UserOnWalletUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserOnWalletUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserOnWalletUpdateWithoutUserInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserOnWalletUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserOnWalletScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserOnWalletUpdateManyMutationInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserOnWalletScalarWhereInputSchema: z.ZodType<Prisma.UserOnWalletScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserOnWalletScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserOnWalletScalarWhereInputSchema),z.lazy(() => UserOnWalletScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumWalletRoleFilterSchema),z.lazy(() => WalletRoleSchema) ]).optional(),
  dailyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  weeklyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  monthlyLimit: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUpsertWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserUpsertWithoutManagedByMeInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedByMeInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByMeInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutManagedByMeInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutManagedByMeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedByMeInputSchema) ]),
}).strict();

export const UserUpdateWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserUpdateWithoutManagedByMeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutManagedByMeInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutManagedByMeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUpsertWithWhereUniqueWithoutManagedByInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutManagedByInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedByInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedByInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutManagedByInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutManagedByInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutManagedByInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedByInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutManagedByInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutManagedByInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutManagedByInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  is2FAEnabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  twoFactorSecret: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  resetPasswordToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  managedById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const EventUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const EventUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutCreatedByInputSchema),z.lazy(() => EventUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const EventUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema),z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const ApiKeyUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ApiKeyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ApiKeyUpdateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => ApiKeyCreateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const ApiKeyUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ApiKeyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ApiKeyUpdateWithoutCreatedByInputSchema),z.lazy(() => ApiKeyUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const ApiKeyUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ApiKeyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ApiKeyUpdateManyMutationInputSchema),z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const ApiKeyScalarWhereInputSchema: z.ZodType<Prisma.ApiKeyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyScalarWhereInputSchema),z.lazy(() => ApiKeyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyScalarWhereInputSchema),z.lazy(() => ApiKeyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumApiKeyStatusFilterSchema),z.lazy(() => ApiKeyStatusSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => EnumApiKeyAccessLevelFilterSchema),z.lazy(() => ApiKeyAccessLevelSchema) ]).optional(),
  secret: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserCreateWithoutSharedWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSharedWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSharedWalletsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSharedWalletsInputSchema) ]),
}).strict();

export const WalletCreateWithoutUsersInputSchema: z.ZodType<Prisma.WalletCreateWithoutUsersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutUsersInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutUsersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutUsersInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedCreateWithoutUsersInputSchema) ]),
}).strict();

export const UserUpsertWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSharedWalletsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSharedWalletsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSharedWalletsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSharedWalletsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSharedWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSharedWalletsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSharedWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSharedWalletsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSharedWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const WalletUpsertWithoutUsersInputSchema: z.ZodType<Prisma.WalletUpsertWithoutUsersInput> = z.object({
  update: z.union([ z.lazy(() => WalletUpdateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutUsersInputSchema) ]),
  create: z.union([ z.lazy(() => WalletCreateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedCreateWithoutUsersInputSchema) ]),
  where: z.lazy(() => WalletWhereInputSchema).optional()
}).strict();

export const WalletUpdateToOneWithWhereWithoutUsersInputSchema: z.ZodType<Prisma.WalletUpdateToOneWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => WalletWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WalletUpdateWithoutUsersInputSchema),z.lazy(() => WalletUncheckedUpdateWithoutUsersInputSchema) ]),
}).strict();

export const WalletUpdateWithoutUsersInputSchema: z.ZodType<Prisma.WalletUpdateWithoutUsersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutUsersInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutUsersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutWalletsInputSchema: z.ZodType<Prisma.UserCreateWithoutWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletCreateNestedManyWithoutUserInputSchema).optional(),
  managedBy: z.lazy(() => UserCreateNestedOneWithoutManagedByMeInputSchema).optional(),
  managedByMe: z.lazy(() => UserCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutWalletsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  managedById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedCreateNestedManyWithoutManagedByInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutWalletsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWalletsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWalletsInputSchema) ]),
}).strict();

export const TransactionCreateWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionCreateWithoutSenderWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutSenderWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutSenderWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema) ]),
}).strict();

export const TransactionCreateManySenderWalletInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManySenderWalletInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManySenderWalletInputSchema),z.lazy(() => TransactionCreateManySenderWalletInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TransactionCreateWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionCreateWithoutReceiverWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutTransactionsSentInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutTransactionsReceivedInputSchema),
  community: z.lazy(() => CommunityCreateNestedOneWithoutTransactionsInputSchema).optional(),
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema),
  event: z.lazy(() => EventCreateNestedOneWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutReceiverWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutReceiverWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema) ]),
}).strict();

export const TransactionCreateManyReceiverWalletInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyReceiverWalletInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyReceiverWalletInputSchema),z.lazy(() => TransactionCreateManyReceiverWalletInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommunityCreateWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityCreateWithoutWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipCreateNestedManyWithoutCommunityInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutMyCommunitiesInputSchema),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutWalletsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdById: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutWalletsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutWalletsInputSchema) ]),
}).strict();

export const UserOnWalletCreateWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletCreateWithoutWalletInput> = z.object({
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSharedWalletsInputSchema)
}).strict();

export const UserOnWalletUncheckedCreateWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedCreateWithoutWalletInput> = z.object({
  userId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletCreateOrConnectWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletCreateOrConnectWithoutWalletInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema) ]),
}).strict();

export const UserOnWalletCreateManyWalletInputEnvelopeSchema: z.ZodType<Prisma.UserOnWalletCreateManyWalletInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserOnWalletCreateManyWalletInputSchema),z.lazy(() => UserOnWalletCreateManyWalletInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutWalletsInputSchema: z.ZodType<Prisma.UserUpsertWithoutWalletsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWalletsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedCreateWithoutWalletsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutWalletsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWalletsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutWalletsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutWalletsInputSchema) ]),
}).strict();

export const UserUpdateWithoutWalletsInputSchema: z.ZodType<Prisma.UserUpdateWithoutWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedBy: z.lazy(() => UserUpdateOneWithoutManagedByMeNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutWalletsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  managedById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutSenderWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutSenderWalletInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutSenderWalletInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutSenderWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutSenderWalletInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutSenderWalletInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutSenderWalletInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletInputSchema) ]),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutReceiverWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutReceiverWalletInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutReceiverWalletInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutReceiverWalletInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutReceiverWalletInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutReceiverWalletInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutReceiverWalletInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletInputSchema) ]),
}).strict();

export const CommunityUpsertWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutWalletsInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutWalletsInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutWalletsInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutWalletsInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutWalletsInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutCommunityNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutMyCommunitiesNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutWalletsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const UserOnWalletUpsertWithWhereUniqueWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUpsertWithWhereUniqueWithoutWalletInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserOnWalletUpdateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateWithoutWalletInputSchema) ]),
  create: z.union([ z.lazy(() => UserOnWalletCreateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedCreateWithoutWalletInputSchema) ]),
}).strict();

export const UserOnWalletUpdateWithWhereUniqueWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUpdateWithWhereUniqueWithoutWalletInput> = z.object({
  where: z.lazy(() => UserOnWalletWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserOnWalletUpdateWithoutWalletInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateWithoutWalletInputSchema) ]),
}).strict();

export const UserOnWalletUpdateManyWithWhereWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUpdateManyWithWhereWithoutWalletInput> = z.object({
  where: z.lazy(() => UserOnWalletScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserOnWalletUpdateManyMutationInputSchema),z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletInputSchema) ]),
}).strict();

export const MembershipCreateManyCommunityInputSchema: z.ZodType<Prisma.MembershipCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateManyCommunityInputSchema: z.ZodType<Prisma.TransactionCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletCreateManyCommunityInputSchema: z.ZodType<Prisma.WalletCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventCreateManyCommunityInputSchema: z.ZodType<Prisma.EventCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional()
}).strict();

export const MembershipUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.EventUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionCreateManyEventInputSchema: z.ZodType<Prisma.TransactionCreateManyEventInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionUpdateWithoutEventInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutEventInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutEventInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommunityCreateManyCreatedByInputSchema: z.ZodType<Prisma.CommunityCreateManyCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.lazy(() => CommunityStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const MembershipCreateManyUserInputSchema: z.ZodType<Prisma.MembershipCreateManyUserInput> = z.object({
  id: z.string().optional(),
  communityId: z.string(),
  teir: z.lazy(() => MembershipTierSchema).optional(),
  communityRole: z.lazy(() => CommunityRoleSchema).optional(),
  tags: z.union([ z.lazy(() => MembershipCreatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.string().optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.lazy(() => MembershipStatusSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateManySenderInputSchema: z.ZodType<Prisma.TransactionCreateManySenderInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateManyReceiverInputSchema: z.ZodType<Prisma.TransactionCreateManyReceiverInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  senderWalletId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletCreateManyOwnerInputSchema: z.ZodType<Prisma.WalletCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  isShared: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletCreateManyUserInputSchema: z.ZodType<Prisma.UserOnWalletCreateManyUserInput> = z.object({
  walletId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserCreateManyManagedByInputSchema: z.ZodType<Prisma.UserCreateManyManagedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional().nullable(),
  is2FAEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  resetPasswordToken: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const EventCreateManyCreatedByInputSchema: z.ZodType<Prisma.EventCreateManyCreatedByInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  communityId: z.string(),
  version: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ApiKeyCreateManyCreatedByInputSchema: z.ZodType<Prisma.ApiKeyCreateManyCreatedByInput> = z.object({
  id: z.string().optional(),
  key: z.string(),
  description: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => ApiKeyStatusSchema).optional(),
  accessLevel: z.lazy(() => ApiKeyAccessLevelSchema).optional(),
  secret: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CommunityUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutCommunityNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pointsTokenName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => CommunityStatusSchema),z.lazy(() => EnumCommunityStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipUpdateWithoutUserInputSchema: z.ZodType<Prisma.MembershipUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  community: z.lazy(() => CommunityUpdateOneRequiredWithoutMembershipsNestedInputSchema).optional()
}).strict();

export const MembershipUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MembershipUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MembershipUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teir: z.union([ z.lazy(() => MembershipTierSchema),z.lazy(() => EnumMembershipTierFieldUpdateOperationsInputSchema) ]).optional(),
  communityRole: z.union([ z.lazy(() => CommunityRoleSchema),z.lazy(() => EnumCommunityRoleFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => MembershipUpdatetagsInputSchema),z.string().array() ]).optional(),
  nftTokenId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nftMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipMetadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  membershipStatus: z.union([ z.lazy(() => MembershipStatusSchema),z.lazy(() => EnumMembershipStatusFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutSenderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutSenderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutSenderInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutSenderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutReceiverInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutReceiverInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutReceiverInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutReceiverInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  users: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isShared: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUpdateWithoutUserInput> = z.object({
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  wallet: z.lazy(() => WalletUpdateOneRequiredWithoutUsersNestedInputSchema).optional()
}).strict();

export const UserOnWalletUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateWithoutUserInput> = z.object({
  walletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateManyWithoutUserInput> = z.object({
  walletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateWithoutManagedByInputSchema: z.ZodType<Prisma.UserUpdateWithoutManagedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutManagedByInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutManagedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  sharedWallets: z.lazy(() => UserOnWalletUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  managedByMe: z.lazy(() => UserUncheckedUpdateManyWithoutManagedByNestedInputSchema).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  apiKeys: z.lazy(() => ApiKeyUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutManagedByInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutManagedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is2FAEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  twoFactorSecret: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  resetPasswordToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EventUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  community: z.lazy(() => CommunityUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutEventNestedInputSchema).optional()
}).strict();

export const EventUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  actions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  version: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ApiKeyUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => ApiKeyStatusSchema),z.lazy(() => EnumApiKeyStatusFieldUpdateOperationsInputSchema) ]).optional(),
  accessLevel: z.union([ z.lazy(() => ApiKeyAccessLevelSchema),z.lazy(() => EnumApiKeyAccessLevelFieldUpdateOperationsInputSchema) ]).optional(),
  secret: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionCreateManySenderWalletInputSchema: z.ZodType<Prisma.TransactionCreateManySenderWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  receiverWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionCreateManyReceiverWalletInputSchema: z.ZodType<Prisma.TransactionCreateManyReceiverWalletInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  transactionType: z.lazy(() => TransactionTypeSchema),
  transactionSubtype: z.lazy(() => TransactionSubtypeSchema),
  transactionStatus: z.lazy(() => TransactionStatusSchema).optional(),
  description: z.string().optional().nullable(),
  senderId: z.string(),
  receiverId: z.string(),
  senderWalletId: z.string(),
  communityId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserOnWalletCreateManyWalletInputSchema: z.ZodType<Prisma.UserOnWalletCreateManyWalletInput> = z.object({
  userId: z.string(),
  role: z.lazy(() => WalletRoleSchema),
  dailyLimit: z.number().optional().nullable(),
  weeklyLimit: z.number().optional().nullable(),
  monthlyLimit: z.number().optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TransactionUpdateWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutSenderWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutSenderWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutSenderWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutSenderWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutReceiverWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsSentNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutTransactionsReceivedNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutReceiverWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutReceiverWalletInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutReceiverWalletInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  transactionType: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionSubtype: z.union([ z.lazy(() => TransactionSubtypeSchema),z.lazy(() => EnumTransactionSubtypeFieldUpdateOperationsInputSchema) ]).optional(),
  transactionStatus: z.union([ z.lazy(() => TransactionStatusSchema),z.lazy(() => EnumTransactionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderWalletId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUpdateWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUpdateWithoutWalletInput> = z.object({
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSharedWalletsNestedInputSchema).optional()
}).strict();

export const UserOnWalletUncheckedUpdateWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateWithoutWalletInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserOnWalletUncheckedUpdateManyWithoutWalletInputSchema: z.ZodType<Prisma.UserOnWalletUncheckedUpdateManyWithoutWalletInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => WalletRoleSchema),z.lazy(() => EnumWalletRoleFieldUpdateOperationsInputSchema) ]).optional(),
  dailyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weeklyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  monthlyLimit: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ApiKeyFindFirstArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindManyArgsSchema: z.ZodType<Prisma.ApiKeyFindManyArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyAggregateArgsSchema: z.ZodType<Prisma.ApiKeyAggregateArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyGroupByArgsSchema: z.ZodType<Prisma.ApiKeyGroupByArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithAggregationInputSchema.array(),ApiKeyOrderByWithAggregationInputSchema ]).optional(),
  by: ApiKeyScalarFieldEnumSchema.array(),
  having: ApiKeyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyFindUniqueArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const CommunityFindFirstArgsSchema: z.ZodType<Prisma.CommunityFindFirstArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CommunityFindFirstOrThrowArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityFindManyArgsSchema: z.ZodType<Prisma.CommunityFindManyArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityAggregateArgsSchema: z.ZodType<Prisma.CommunityAggregateArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommunityGroupByArgsSchema: z.ZodType<Prisma.CommunityGroupByArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithAggregationInputSchema.array(),CommunityOrderByWithAggregationInputSchema ]).optional(),
  by: CommunityScalarFieldEnumSchema.array(),
  having: CommunityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommunityFindUniqueArgsSchema: z.ZodType<Prisma.CommunityFindUniqueArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CommunityFindUniqueOrThrowArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const EventFindFirstArgsSchema: z.ZodType<Prisma.EventFindFirstArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EventFindFirstOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventFindManyArgsSchema: z.ZodType<Prisma.EventFindManyArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema,EventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EventAggregateArgsSchema: z.ZodType<Prisma.EventAggregateArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(),EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventGroupByArgsSchema: z.ZodType<Prisma.EventGroupByArgs> = z.object({
  where: EventWhereInputSchema.optional(),
  orderBy: z.union([ EventOrderByWithAggregationInputSchema.array(),EventOrderByWithAggregationInputSchema ]).optional(),
  by: EventScalarFieldEnumSchema.array(),
  having: EventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EventFindUniqueArgsSchema: z.ZodType<Prisma.EventFindUniqueArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EventFindUniqueOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const MembershipFindFirstArgsSchema: z.ZodType<Prisma.MembershipFindFirstArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(),
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(),MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema,MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MembershipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MembershipFindFirstOrThrowArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(),
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(),MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema,MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MembershipFindManyArgsSchema: z.ZodType<Prisma.MembershipFindManyArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereInputSchema.optional(),
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(),MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MembershipScalarFieldEnumSchema,MembershipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MembershipAggregateArgsSchema: z.ZodType<Prisma.MembershipAggregateArgs> = z.object({
  where: MembershipWhereInputSchema.optional(),
  orderBy: z.union([ MembershipOrderByWithRelationInputSchema.array(),MembershipOrderByWithRelationInputSchema ]).optional(),
  cursor: MembershipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MembershipGroupByArgsSchema: z.ZodType<Prisma.MembershipGroupByArgs> = z.object({
  where: MembershipWhereInputSchema.optional(),
  orderBy: z.union([ MembershipOrderByWithAggregationInputSchema.array(),MembershipOrderByWithAggregationInputSchema ]).optional(),
  by: MembershipScalarFieldEnumSchema.array(),
  having: MembershipScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MembershipFindUniqueArgsSchema: z.ZodType<Prisma.MembershipFindUniqueArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema,
}).strict() ;

export const MembershipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MembershipFindUniqueOrThrowArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema,
}).strict() ;

export const TransactionFindFirstArgsSchema: z.ZodType<Prisma.TransactionFindFirstArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TransactionFindFirstOrThrowArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionFindManyArgsSchema: z.ZodType<Prisma.TransactionFindManyArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionAggregateArgsSchema: z.ZodType<Prisma.TransactionAggregateArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransactionGroupByArgsSchema: z.ZodType<Prisma.TransactionGroupByArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithAggregationInputSchema.array(),TransactionOrderByWithAggregationInputSchema ]).optional(),
  by: TransactionScalarFieldEnumSchema.array(),
  having: TransactionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransactionFindUniqueArgsSchema: z.ZodType<Prisma.TransactionFindUniqueArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TransactionFindUniqueOrThrowArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserOnWalletFindFirstArgsSchema: z.ZodType<Prisma.UserOnWalletFindFirstArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereInputSchema.optional(),
  orderBy: z.union([ UserOnWalletOrderByWithRelationInputSchema.array(),UserOnWalletOrderByWithRelationInputSchema ]).optional(),
  cursor: UserOnWalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserOnWalletScalarFieldEnumSchema,UserOnWalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserOnWalletFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserOnWalletFindFirstOrThrowArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereInputSchema.optional(),
  orderBy: z.union([ UserOnWalletOrderByWithRelationInputSchema.array(),UserOnWalletOrderByWithRelationInputSchema ]).optional(),
  cursor: UserOnWalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserOnWalletScalarFieldEnumSchema,UserOnWalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserOnWalletFindManyArgsSchema: z.ZodType<Prisma.UserOnWalletFindManyArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereInputSchema.optional(),
  orderBy: z.union([ UserOnWalletOrderByWithRelationInputSchema.array(),UserOnWalletOrderByWithRelationInputSchema ]).optional(),
  cursor: UserOnWalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserOnWalletScalarFieldEnumSchema,UserOnWalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserOnWalletAggregateArgsSchema: z.ZodType<Prisma.UserOnWalletAggregateArgs> = z.object({
  where: UserOnWalletWhereInputSchema.optional(),
  orderBy: z.union([ UserOnWalletOrderByWithRelationInputSchema.array(),UserOnWalletOrderByWithRelationInputSchema ]).optional(),
  cursor: UserOnWalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserOnWalletGroupByArgsSchema: z.ZodType<Prisma.UserOnWalletGroupByArgs> = z.object({
  where: UserOnWalletWhereInputSchema.optional(),
  orderBy: z.union([ UserOnWalletOrderByWithAggregationInputSchema.array(),UserOnWalletOrderByWithAggregationInputSchema ]).optional(),
  by: UserOnWalletScalarFieldEnumSchema.array(),
  having: UserOnWalletScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserOnWalletFindUniqueArgsSchema: z.ZodType<Prisma.UserOnWalletFindUniqueArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereUniqueInputSchema,
}).strict() ;

export const UserOnWalletFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserOnWalletFindUniqueOrThrowArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereUniqueInputSchema,
}).strict() ;

export const WalletFindFirstArgsSchema: z.ZodType<Prisma.WalletFindFirstArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereInputSchema.optional(),
  orderBy: z.union([ WalletOrderByWithRelationInputSchema.array(),WalletOrderByWithRelationInputSchema ]).optional(),
  cursor: WalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WalletScalarFieldEnumSchema,WalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WalletFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WalletFindFirstOrThrowArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereInputSchema.optional(),
  orderBy: z.union([ WalletOrderByWithRelationInputSchema.array(),WalletOrderByWithRelationInputSchema ]).optional(),
  cursor: WalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WalletScalarFieldEnumSchema,WalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WalletFindManyArgsSchema: z.ZodType<Prisma.WalletFindManyArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereInputSchema.optional(),
  orderBy: z.union([ WalletOrderByWithRelationInputSchema.array(),WalletOrderByWithRelationInputSchema ]).optional(),
  cursor: WalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WalletScalarFieldEnumSchema,WalletScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WalletAggregateArgsSchema: z.ZodType<Prisma.WalletAggregateArgs> = z.object({
  where: WalletWhereInputSchema.optional(),
  orderBy: z.union([ WalletOrderByWithRelationInputSchema.array(),WalletOrderByWithRelationInputSchema ]).optional(),
  cursor: WalletWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WalletGroupByArgsSchema: z.ZodType<Prisma.WalletGroupByArgs> = z.object({
  where: WalletWhereInputSchema.optional(),
  orderBy: z.union([ WalletOrderByWithAggregationInputSchema.array(),WalletOrderByWithAggregationInputSchema ]).optional(),
  by: WalletScalarFieldEnumSchema.array(),
  having: WalletScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WalletFindUniqueArgsSchema: z.ZodType<Prisma.WalletFindUniqueArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereUniqueInputSchema,
}).strict() ;

export const WalletFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WalletFindUniqueOrThrowArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyCreateArgsSchema: z.ZodType<Prisma.ApiKeyCreateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  data: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
}).strict() ;

export const ApiKeyUpsertArgsSchema: z.ZodType<Prisma.ApiKeyUpsertArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
  create: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
  update: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
}).strict() ;

export const ApiKeyCreateManyArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyAndReturnArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyDeleteArgsSchema: z.ZodType<Prisma.ApiKeyDeleteArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateArgsSchema: z.ZodType<Prisma.ApiKeyUpdateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  include: ApiKeyIncludeSchema.optional(),
  data: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateManyArgsSchema: z.ZodType<Prisma.ApiKeyUpdateManyArgs> = z.object({
  data: z.union([ ApiKeyUpdateManyMutationInputSchema,ApiKeyUncheckedUpdateManyInputSchema ]),
  where: ApiKeyWhereInputSchema.optional(),
}).strict() ;

export const ApiKeyDeleteManyArgsSchema: z.ZodType<Prisma.ApiKeyDeleteManyArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
}).strict() ;

export const CommunityCreateArgsSchema: z.ZodType<Prisma.CommunityCreateArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  data: z.union([ CommunityCreateInputSchema,CommunityUncheckedCreateInputSchema ]),
}).strict() ;

export const CommunityUpsertArgsSchema: z.ZodType<Prisma.CommunityUpsertArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
  create: z.union([ CommunityCreateInputSchema,CommunityUncheckedCreateInputSchema ]),
  update: z.union([ CommunityUpdateInputSchema,CommunityUncheckedUpdateInputSchema ]),
}).strict() ;

export const CommunityCreateManyArgsSchema: z.ZodType<Prisma.CommunityCreateManyArgs> = z.object({
  data: z.union([ CommunityCreateManyInputSchema,CommunityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CommunityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CommunityCreateManyAndReturnArgs> = z.object({
  data: z.union([ CommunityCreateManyInputSchema,CommunityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CommunityDeleteArgsSchema: z.ZodType<Prisma.CommunityDeleteArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityUpdateArgsSchema: z.ZodType<Prisma.CommunityUpdateArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  data: z.union([ CommunityUpdateInputSchema,CommunityUncheckedUpdateInputSchema ]),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityUpdateManyArgsSchema: z.ZodType<Prisma.CommunityUpdateManyArgs> = z.object({
  data: z.union([ CommunityUpdateManyMutationInputSchema,CommunityUncheckedUpdateManyInputSchema ]),
  where: CommunityWhereInputSchema.optional(),
}).strict() ;

export const CommunityDeleteManyArgsSchema: z.ZodType<Prisma.CommunityDeleteManyArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
}).strict() ;

export const EventCreateArgsSchema: z.ZodType<Prisma.EventCreateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
}).strict() ;

export const EventUpsertArgsSchema: z.ZodType<Prisma.EventUpsertArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
  create: z.union([ EventCreateInputSchema,EventUncheckedCreateInputSchema ]),
  update: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
}).strict() ;

export const EventCreateManyArgsSchema: z.ZodType<Prisma.EventCreateManyArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema,EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EventCreateManyAndReturnArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema,EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EventDeleteArgsSchema: z.ZodType<Prisma.EventDeleteArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateArgsSchema: z.ZodType<Prisma.EventUpdateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventUpdateInputSchema,EventUncheckedUpdateInputSchema ]),
  where: EventWhereUniqueInputSchema,
}).strict() ;

export const EventUpdateManyArgsSchema: z.ZodType<Prisma.EventUpdateManyArgs> = z.object({
  data: z.union([ EventUpdateManyMutationInputSchema,EventUncheckedUpdateManyInputSchema ]),
  where: EventWhereInputSchema.optional(),
}).strict() ;

export const EventDeleteManyArgsSchema: z.ZodType<Prisma.EventDeleteManyArgs> = z.object({
  where: EventWhereInputSchema.optional(),
}).strict() ;

export const MembershipCreateArgsSchema: z.ZodType<Prisma.MembershipCreateArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  data: z.union([ MembershipCreateInputSchema,MembershipUncheckedCreateInputSchema ]),
}).strict() ;

export const MembershipUpsertArgsSchema: z.ZodType<Prisma.MembershipUpsertArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema,
  create: z.union([ MembershipCreateInputSchema,MembershipUncheckedCreateInputSchema ]),
  update: z.union([ MembershipUpdateInputSchema,MembershipUncheckedUpdateInputSchema ]),
}).strict() ;

export const MembershipCreateManyArgsSchema: z.ZodType<Prisma.MembershipCreateManyArgs> = z.object({
  data: z.union([ MembershipCreateManyInputSchema,MembershipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MembershipCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MembershipCreateManyAndReturnArgs> = z.object({
  data: z.union([ MembershipCreateManyInputSchema,MembershipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MembershipDeleteArgsSchema: z.ZodType<Prisma.MembershipDeleteArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  where: MembershipWhereUniqueInputSchema,
}).strict() ;

export const MembershipUpdateArgsSchema: z.ZodType<Prisma.MembershipUpdateArgs> = z.object({
  select: MembershipSelectSchema.optional(),
  include: MembershipIncludeSchema.optional(),
  data: z.union([ MembershipUpdateInputSchema,MembershipUncheckedUpdateInputSchema ]),
  where: MembershipWhereUniqueInputSchema,
}).strict() ;

export const MembershipUpdateManyArgsSchema: z.ZodType<Prisma.MembershipUpdateManyArgs> = z.object({
  data: z.union([ MembershipUpdateManyMutationInputSchema,MembershipUncheckedUpdateManyInputSchema ]),
  where: MembershipWhereInputSchema.optional(),
}).strict() ;

export const MembershipDeleteManyArgsSchema: z.ZodType<Prisma.MembershipDeleteManyArgs> = z.object({
  where: MembershipWhereInputSchema.optional(),
}).strict() ;

export const TransactionCreateArgsSchema: z.ZodType<Prisma.TransactionCreateArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  data: z.union([ TransactionCreateInputSchema,TransactionUncheckedCreateInputSchema ]),
}).strict() ;

export const TransactionUpsertArgsSchema: z.ZodType<Prisma.TransactionUpsertArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereUniqueInputSchema,
  create: z.union([ TransactionCreateInputSchema,TransactionUncheckedCreateInputSchema ]),
  update: z.union([ TransactionUpdateInputSchema,TransactionUncheckedUpdateInputSchema ]),
}).strict() ;

export const TransactionCreateManyArgsSchema: z.ZodType<Prisma.TransactionCreateManyArgs> = z.object({
  data: z.union([ TransactionCreateManyInputSchema,TransactionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TransactionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TransactionCreateManyAndReturnArgs> = z.object({
  data: z.union([ TransactionCreateManyInputSchema,TransactionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TransactionDeleteArgsSchema: z.ZodType<Prisma.TransactionDeleteArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionUpdateArgsSchema: z.ZodType<Prisma.TransactionUpdateArgs> = z.object({
  select: TransactionSelectSchema.optional(),
  include: TransactionIncludeSchema.optional(),
  data: z.union([ TransactionUpdateInputSchema,TransactionUncheckedUpdateInputSchema ]),
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionUpdateManyArgsSchema: z.ZodType<Prisma.TransactionUpdateManyArgs> = z.object({
  data: z.union([ TransactionUpdateManyMutationInputSchema,TransactionUncheckedUpdateManyInputSchema ]),
  where: TransactionWhereInputSchema.optional(),
}).strict() ;

export const TransactionDeleteManyArgsSchema: z.ZodType<Prisma.TransactionDeleteManyArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserOnWalletCreateArgsSchema: z.ZodType<Prisma.UserOnWalletCreateArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  data: z.union([ UserOnWalletCreateInputSchema,UserOnWalletUncheckedCreateInputSchema ]),
}).strict() ;

export const UserOnWalletUpsertArgsSchema: z.ZodType<Prisma.UserOnWalletUpsertArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereUniqueInputSchema,
  create: z.union([ UserOnWalletCreateInputSchema,UserOnWalletUncheckedCreateInputSchema ]),
  update: z.union([ UserOnWalletUpdateInputSchema,UserOnWalletUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserOnWalletCreateManyArgsSchema: z.ZodType<Prisma.UserOnWalletCreateManyArgs> = z.object({
  data: z.union([ UserOnWalletCreateManyInputSchema,UserOnWalletCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserOnWalletCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserOnWalletCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserOnWalletCreateManyInputSchema,UserOnWalletCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserOnWalletDeleteArgsSchema: z.ZodType<Prisma.UserOnWalletDeleteArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  where: UserOnWalletWhereUniqueInputSchema,
}).strict() ;

export const UserOnWalletUpdateArgsSchema: z.ZodType<Prisma.UserOnWalletUpdateArgs> = z.object({
  select: UserOnWalletSelectSchema.optional(),
  include: UserOnWalletIncludeSchema.optional(),
  data: z.union([ UserOnWalletUpdateInputSchema,UserOnWalletUncheckedUpdateInputSchema ]),
  where: UserOnWalletWhereUniqueInputSchema,
}).strict() ;

export const UserOnWalletUpdateManyArgsSchema: z.ZodType<Prisma.UserOnWalletUpdateManyArgs> = z.object({
  data: z.union([ UserOnWalletUpdateManyMutationInputSchema,UserOnWalletUncheckedUpdateManyInputSchema ]),
  where: UserOnWalletWhereInputSchema.optional(),
}).strict() ;

export const UserOnWalletDeleteManyArgsSchema: z.ZodType<Prisma.UserOnWalletDeleteManyArgs> = z.object({
  where: UserOnWalletWhereInputSchema.optional(),
}).strict() ;

export const WalletCreateArgsSchema: z.ZodType<Prisma.WalletCreateArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  data: z.union([ WalletCreateInputSchema,WalletUncheckedCreateInputSchema ]),
}).strict() ;

export const WalletUpsertArgsSchema: z.ZodType<Prisma.WalletUpsertArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereUniqueInputSchema,
  create: z.union([ WalletCreateInputSchema,WalletUncheckedCreateInputSchema ]),
  update: z.union([ WalletUpdateInputSchema,WalletUncheckedUpdateInputSchema ]),
}).strict() ;

export const WalletCreateManyArgsSchema: z.ZodType<Prisma.WalletCreateManyArgs> = z.object({
  data: z.union([ WalletCreateManyInputSchema,WalletCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WalletCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WalletCreateManyAndReturnArgs> = z.object({
  data: z.union([ WalletCreateManyInputSchema,WalletCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const WalletDeleteArgsSchema: z.ZodType<Prisma.WalletDeleteArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  where: WalletWhereUniqueInputSchema,
}).strict() ;

export const WalletUpdateArgsSchema: z.ZodType<Prisma.WalletUpdateArgs> = z.object({
  select: WalletSelectSchema.optional(),
  include: WalletIncludeSchema.optional(),
  data: z.union([ WalletUpdateInputSchema,WalletUncheckedUpdateInputSchema ]),
  where: WalletWhereUniqueInputSchema,
}).strict() ;

export const WalletUpdateManyArgsSchema: z.ZodType<Prisma.WalletUpdateManyArgs> = z.object({
  data: z.union([ WalletUpdateManyMutationInputSchema,WalletUncheckedUpdateManyInputSchema ]),
  where: WalletWhereInputSchema.optional(),
}).strict() ;

export const WalletDeleteManyArgsSchema: z.ZodType<Prisma.WalletDeleteManyArgs> = z.object({
  where: WalletWhereInputSchema.optional(),
}).strict() ;
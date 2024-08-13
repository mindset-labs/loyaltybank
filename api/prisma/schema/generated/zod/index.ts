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

export const CommunityScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','metadata','pointsTokenName','isPublic','status','createdById','createdAt','updatedAt']);

export const MembershipScalarFieldEnumSchema = z.enum(['id','userId','communityId','teir','communityRole','tags','nftTokenId','nftMetadata','membershipMetadata','membershipStatus','createdAt','updatedAt']);

export const TransactionScalarFieldEnumSchema = z.enum(['id','amount','transactionType','transactionSubtype','transactionStatus','description','senderId','receiverId','senderWalletId','receiverWalletId','communityId','metadata','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','phoneNumber','is2FAEnabled','twoFactorSecret','role','resetPasswordToken','createdAt','updatedAt']);

export const WalletScalarFieldEnumSchema = z.enum(['id','address','token','communityId','balance','ownerId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const CommunityStatusSchema = z.enum(['DRAFT','ACTIVE','INACTIVE','ARCHIVED']);

export type CommunityStatusType = `${z.infer<typeof CommunityStatusSchema>}`

export const MembershipTierSchema = z.enum(['BASIC','PREMIUM','GOLD','PLATINUM']);

export type MembershipTierType = `${z.infer<typeof MembershipTierSchema>}`

export const CommunityRoleSchema = z.enum(['MEMBER','MODERATOR','ADMIN']);

export type CommunityRoleType = `${z.infer<typeof CommunityRoleSchema>}`

export const MembershipStatusSchema = z.enum(['PENDING','ACTIVE','INACTIVE','SUSPENDED','CANCELLED']);

export type MembershipStatusType = `${z.infer<typeof MembershipStatusSchema>}`

export const TransactionTypeSchema = z.enum(['DEPOSIT','WITHDRAW','TRANSFER','REWARDS']);

export type TransactionTypeType = `${z.infer<typeof TransactionTypeSchema>}`

export const TransactionSubtypeSchema = z.enum(['BANK_TRANSFER','CASH','BALANCE','CRYPTO','POINTS']);

export type TransactionSubtypeType = `${z.infer<typeof TransactionSubtypeSchema>}`

export const TransactionStatusSchema = z.enum(['PENDING','COMPLETED','FAILED']);

export type TransactionStatusType = `${z.infer<typeof TransactionStatusSchema>}`

export const RoleSchema = z.enum(['ADMIN','MANAGER','USER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

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
  metadata: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Transaction = z.infer<typeof TransactionSchema>

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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// WALLET SCHEMA
/////////////////////////////////////////

export const WalletSchema = z.object({
  id: z.string(),
  address: z.string(),
  token: z.string(),
  communityId: z.string().nullable(),
  balance: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Wallet = z.infer<typeof WalletSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// COMMUNITY
//------------------------------------------------------

export const CommunityIncludeSchema: z.ZodType<Prisma.CommunityInclude> = z.object({
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
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
  _count: z.union([z.boolean(),z.lazy(() => CommunityCountOutputTypeArgsSchema)]).optional(),
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
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  sender: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  receiver: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  senderWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
  receiverWallet: z.union([z.boolean(),z.lazy(() => WalletArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  myCommunities: z.union([z.boolean(),z.lazy(() => CommunityFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  transactionsSent: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  transactionsReceived: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
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
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  myCommunities: z.union([z.boolean(),z.lazy(() => CommunityFindManyArgsSchema)]).optional(),
  memberships: z.union([z.boolean(),z.lazy(() => MembershipFindManyArgsSchema)]).optional(),
  transactionsSent: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  transactionsReceived: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  wallets: z.union([z.boolean(),z.lazy(() => WalletFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WALLET
//------------------------------------------------------

export const WalletIncludeSchema: z.ZodType<Prisma.WalletInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  sentTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  receivedTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
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
}).strict();

export const WalletSelectSchema: z.ZodType<Prisma.WalletSelect> = z.object({
  id: z.boolean().optional(),
  address: z.boolean().optional(),
  token: z.boolean().optional(),
  communityId: z.boolean().optional(),
  balance: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  sentTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  receivedTransactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WalletCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

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
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional()
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
  wallets: z.lazy(() => WalletOrderByRelationAggregateInputSchema).optional()
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
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional()
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
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  senderWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  receiverWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
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
  metadata: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  sender: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  receiver: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  senderWallet: z.lazy(() => WalletOrderByWithRelationInputSchema).optional(),
  receiverWallet: z.lazy(() => WalletOrderByWithRelationInputSchema).optional()
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
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
  senderWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
  receiverWallet: z.union([ z.lazy(() => WalletRelationFilterSchema),z.lazy(() => WalletWhereInputSchema) ]).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  myCommunities: z.lazy(() => CommunityListRelationFilterSchema).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  transactionsSent: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional()
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
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  myCommunities: z.lazy(() => CommunityOrderByRelationAggregateInputSchema).optional(),
  memberships: z.lazy(() => MembershipOrderByRelationAggregateInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  wallets: z.lazy(() => WalletOrderByRelationAggregateInputSchema).optional()
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  myCommunities: z.lazy(() => CommunityListRelationFilterSchema).optional(),
  memberships: z.lazy(() => MembershipListRelationFilterSchema).optional(),
  transactionsSent: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  wallets: z.lazy(() => WalletListRelationFilterSchema).optional()
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
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const WalletWhereInputSchema: z.ZodType<Prisma.WalletWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WalletWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WalletWhereInputSchema),z.lazy(() => WalletWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
}).strict();

export const WalletOrderByWithRelationInputSchema: z.ZodType<Prisma.WalletOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional(),
  community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional()
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
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionListRelationFilterSchema).optional(),
  community: z.union([ z.lazy(() => CommunityNullableRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional().nullable(),
}).strict());

export const WalletOrderByWithAggregationInputSchema: z.ZodType<Prisma.WalletOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
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
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
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
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletCreateInputSchema: z.ZodType<Prisma.WalletCreateInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional()
}).strict();

export const WalletUncheckedCreateInputSchema: z.ZodType<Prisma.WalletUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletUpdateInputSchema: z.ZodType<Prisma.WalletUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
}).strict();

export const WalletCreateManyInputSchema: z.ZodType<Prisma.WalletCreateManyInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletUpdateManyMutationInputSchema: z.ZodType<Prisma.WalletUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
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

export const MembershipListRelationFilterSchema: z.ZodType<Prisma.MembershipListRelationFilter> = z.object({
  every: z.lazy(() => MembershipWhereInputSchema).optional(),
  some: z.lazy(() => MembershipWhereInputSchema).optional(),
  none: z.lazy(() => MembershipWhereInputSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
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

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
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

export const CommunityRelationFilterSchema: z.ZodType<Prisma.CommunityRelationFilter> = z.object({
  is: z.lazy(() => CommunityWhereInputSchema).optional(),
  isNot: z.lazy(() => CommunityWhereInputSchema).optional()
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

export const CommunityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CommunityOrderByRelationAggregateInput> = z.object({
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

export const WalletAddressTokenCompoundUniqueInputSchema: z.ZodType<Prisma.WalletAddressTokenCompoundUniqueInput> = z.object({
  address: z.string(),
  token: z.string()
}).strict();

export const WalletCountOrderByAggregateInputSchema: z.ZodType<Prisma.WalletCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WalletAvgOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WalletMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletMinOrderByAggregateInputSchema: z.ZodType<Prisma.WalletMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  communityId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WalletSumOrderByAggregateInputSchema: z.ZodType<Prisma.WalletSumOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
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

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const EnumCommunityStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCommunityStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CommunityStatusSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
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
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutCommunityInputSchema),z.lazy(() => WalletUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const WalletCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.WalletCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WalletCreateManyCommunityInputSchema),z.lazy(() => WalletCreateManyCommunityInputSchema).array() ]),
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
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  communityId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutOwnerInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutTransactionsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutTransactionsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutTransactionsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const WalletCreateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletCreateWithoutSentTransactionsInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutSentTransactionsInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutSentTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutSentTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutSentTransactionsInputSchema) ]),
}).strict();

export const WalletCreateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletCreateWithoutReceivedTransactionsInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutWalletsInputSchema),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutReceivedTransactionsInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutReceivedTransactionsInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutReceivedTransactionsInputSchema),z.lazy(() => WalletUncheckedCreateWithoutReceivedTransactionsInputSchema) ]),
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
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutSentTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutSentTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
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
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutReceivedTransactionsInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutReceivedTransactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletCreateNestedManyWithoutCommunityInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
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
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
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
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionCreateNestedManyWithoutReceiverWalletInputSchema).optional(),
  community: z.lazy(() => CommunityCreateNestedOneWithoutWalletsInputSchema).optional()
}).strict();

export const WalletUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderWalletInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverWalletInputSchema).optional()
}).strict();

export const WalletCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.WalletCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => WalletWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WalletCreateWithoutOwnerInputSchema),z.lazy(() => WalletUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const WalletCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.WalletCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => WalletCreateManyOwnerInputSchema),z.lazy(() => WalletCreateManyOwnerInputSchema).array() ]),
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
  transactionsReceived: z.lazy(() => TransactionCreateNestedManyWithoutReceiverInputSchema).optional()
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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  myCommunities: z.lazy(() => CommunityUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutReceiverInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletCreateNestedOneWithoutReceivedTransactionsInputSchema)
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
  senderWallet: z.lazy(() => WalletCreateNestedOneWithoutSentTransactionsInputSchema)
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
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutCommunityInputSchema).optional()
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
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutWalletsInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutWalletsInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutWalletsInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutWalletsInputSchema) ]),
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
  transactionsReceived: z.lazy(() => TransactionUpdateManyWithoutReceiverNestedInputSchema).optional()
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
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  myCommunities: z.lazy(() => CommunityUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  memberships: z.lazy(() => MembershipUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  transactionsSent: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  transactionsReceived: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional()
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
  transactions: z.lazy(() => TransactionUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletCreateManyCommunityInputSchema: z.ZodType<Prisma.WalletCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  balance: z.number().optional(),
  ownerId: z.string(),
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
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
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
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutWalletsNestedInputSchema).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const WalletCreateManyOwnerInputSchema: z.ZodType<Prisma.WalletCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  address: z.string(),
  token: z.string().optional(),
  communityId: z.string().optional().nullable(),
  balance: z.number().optional(),
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
  wallets: z.lazy(() => WalletUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  wallets: z.lazy(() => WalletUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
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
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
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
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WalletUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUpdateManyWithoutReceiverWalletNestedInputSchema).optional(),
  community: z.lazy(() => CommunityUpdateOneWithoutWalletsNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sentTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutSenderWalletNestedInputSchema).optional(),
  receivedTransactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutReceiverWalletNestedInputSchema).optional()
}).strict();

export const WalletUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.WalletUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  communityId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
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
  receiverWallet: z.lazy(() => WalletUpdateOneRequiredWithoutReceivedTransactionsNestedInputSchema).optional()
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
  senderWallet: z.lazy(() => WalletUpdateOneRequiredWithoutSentTransactionsNestedInputSchema).optional()
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
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

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
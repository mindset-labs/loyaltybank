## Models

### User
The User model represents a user in the system. It contains basic information about the user such as their name, email, and password hash. Users can be members of communities and have roles within those communities.

> Fields can be found in the [userModel schema](../prisma/schema/userModel.prisma).

### Community
The Community model represents a group or organization within the system. Communities can have multiple users as members and can issue points, set up achievements, and manage wallets for their members.

> Fields can be found in the [communityModel schema](../prisma/schema/communityModel.prisma).

### Membership
The Membership model represents the relationship between a User and a Community. It includes information such as the user's role within the community and their current tier.

> Fields can be found in the [membershipModel schema](../prisma/schema/membershipModel.prisma).

### Wallet
The Wallet model represents a user's balance within a specific community. It tracks the amount of points a user has accumulated in that community.

> Fields can be found in the [walletModel schema](../prisma/schema/walletModel.prisma).

### Transaction
The Transaction model records all point-related activities within the system. It includes details such as the type of transaction (e.g., credit, debit), the amount, and references to the associated user, community, and wallet.

> Fields can be found in the [transactionModel schema](../prisma/schema/transactionModel.prisma).

### Event
The Event model defines **the blueprint** of specific actions or occurrences that can trigger achievements or other responses within the system. Events are typically associated with a community and can be logged for individual users.

> Fields can be found in the [eventModel schema](../prisma/schema/eventModel.prisma).

### EventLog
The EventLog model records instances of events occurring for specific users. It links a user to an event and includes any relevant metadata about the occurrence.

> Fields can be found in the [eventLogModel schema](../prisma/schema/eventLogModel.prisma).

### Achievement
The Achievement model defines goals or milestones that users can reach within a community. Achievements have conditions that need to be met and can offer rewards when completed.

> Fields can be found in the [achievementModel schema](../prisma/schema/achievementModel.prisma).

### AchievementReward
The AchievementReward model defines the instance of an achievement which has been completed by a user. This is used to track the progress and completion status of achievements.

> Fields can be found in the [achievementRewardModel schema](../prisma/schema/achievementRewardModel.prisma).

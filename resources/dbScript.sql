USE mydb;

CREATE TABLE F_USER(
	userId BIGINT unsigned NOT NULL AUTO_INCREMENT,
	userName varchar(200) NULL,
	profilePicPath varchar(500) NULL,
	email varchar(100) NULL,
	phone varchar(20) NULL,
	city varchar(50) NULL,
	zipCode varchar(10) NULL,
	browniePoints int NULL,
	password varchar(200) NULL,
	forgotPasswordCode varchar(200) NULL,
	isPasswordVerified bit NULL,
	createdDate date NULL,
	modifiedDate date NULL,
	active bit not null,
	PRIMARY KEY (userId)
) ENGINE=InnoDB;

CREATE TABLE F_TAG(
	tagId int NOT NULL,
	tagName varchar(50) NULL,
	tagDescription varchar(200) NULL,
	createdDate date NULL,
	active bit not null,
	PRIMARY KEY (tagId)
) ENGINE=InnoDB;

CREATE TABLE F_GOAL_TYPE(
	goalTypeId int NOT NULL,
	goalTypeName varchar(100) NULL,
	active bit not null,
	PRIMARY KEY (goalTypeId)
) ENGINE=InnoDB;

CREATE TABLE F_GOAL(
	goalId BIGINT unsigned NOT NULL AUTO_INCREMENT,
	tagId int NOT NULL,
	goalTypeId int NOT NULL,
	goalName varchar(100) NULL,
	goalDescription varchar(500) NULL,
	goalTargetValue int NULL,
	goalUnit varchar(12) NULL,
	createdDate date NULL,
	createdBy BIGINT NULL,
	modifiedDate date NULL,
	modifiedBy BIGINT NULL,
	active bit not null,
	PRIMARY KEY (goalId),
	foreign key(`tagId`) references F_TAG(`tagId`),
  	foreign key(`goalTypeId`) references F_GOAL_TYPE(`goalTypeId`)
)ENGINE=InnoDB;

CREATE TABLE F_USER_GOAL(
	userGoalId BIGINT unsigned NOT NULL AUTO_INCREMENT,
	userId BIGINT unsigned NOT NULL,
	goalId BIGINT unsigned NOT NULL,
	goalProgressPercent int NULL,
	
	goalStartDate date NULL,
	goalEndDate date NULL,
	timePer int NULL,
	period varchar(1) NULL,

	isGoalAchieved bit null DEFAULT false,
	isPrivateGoal bit NULL DEFAULT false,
	createdDate date NULL,
	createdBy int NULL,
	modifiedDate date NULL,
	modifiedBy date NULL,
	active bit not NULL,
	PRIMARY KEY (userGoalId),
	foreign key(`userId`) references F_USER(`userId`),
	foreign key(`goalId`) references F_GOAL(`goalId`)
)ENGINE=InnoDB;
ALTER TABLE `F_USER_GOAL` ADD INDEX `userId` (`userId`);
ALTER TABLE `F_USER_GOAL` ADD INDEX `goalId` (`goalId`);


CREATE TABLE F_GOAL_TRACKER(
	goalTrackerId BIGINT unsigned NOT NULL AUTO_INCREMENT,
	userGoalId BIGINT unsigned NOT NULL,
	logValue int NULL,
	logUnit varchar(12) NULL,
	logNotes varchar(1000) NULL,
	logDate date NOT NULL,
	PRIMARY KEY (goalTrackerId),
	foreign key(`userGoalId`) references F_USER_GOAL(`userGoalId`)
)ENGINE=InnoDB;
ALTER TABLE `F_GOAL_TRACKER` ADD INDEX `userGoalId` (`userGoalId`);

------------------------------------------------------------------------
------------------------------------------------------------------------





-- Below tables not used till now right now...




CREATE TABLE [dbo].[T_TRACKER_TYPE](
	[TRACKER_TYPE_ID] [int] IDENTITY(1,1) NOT NULL,
	[TRACKER_TYPE_DESC] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[TRACKER_TYPE_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[T_BADGE](
	[BADGE_ID] [int] IDENTITY(1,1) NOT NULL,
	[BADGE_DESC] [varchar](100) NULL,
	[IMAGE] [varchar](100) NULL,
	[CREATED_DATE] [date] NULL,
	[CREATED_BY] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[BADGE_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO

GO
CREATE TABLE [dbo].[T_USER_BADGE](
	[USER_ID] [int] NULL,
	[BADGE_ID] [int] NULL,
	[ACHIEVED_DATE] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_STEP]    Script Date: 09/25/2015 11:42:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_STEP](
	[STEP_ID] [int] NOT NULL,
	[GOAL_ID] [int] NULL,
	[STEP_DESC] [varchar](50) NULL,
	[STEP_TARGET_VALUE] [int] NULL,
	[STEP_UNIT] [varchar](10) NULL,
	[STEP_START_DATE] [date] NULL,
	[STEP_END_DATE] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[STEP_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_TRACKER_INDEX_ARCHIEVE]    Script Date: 09/25/2015 11:42:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_TRACKER_INDEX_ARCHIEVE](
	[INDEX_ID] [int] NOT NULL,
	[USER_GOAL_ID] [int] NULL,
	[ACHIEVED_VALUE] [int] NULL,
	[TRACK_DATE] [date] NULL,
	[STEP_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[INDEX_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_TRACKER_INDEX]    Script Date: 09/25/2015 11:42:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_TRACKER_INDEX](
	[INDEX_ID] [int] NOT NULL,
	[USER_GOAL_ID] [int] NULL,
	[ACHIEVED_VALUE] [int] NULL,
	[TRACK_DATE] [date] NULL,
	[STEP_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[INDEX_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_TRACKER]    Script Date: 09/25/2015 11:42:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_TRACKER](
	[TRACKER_ID] [int] NOT NULL,
	[GOAL_ACHIEVEMENT] [numeric](5, 3) NULL,
	[PERCENTAGE_ACHIEVED] [numeric](5, 3) NULL,
	[GOAL_UNIT] [varchar](10) NULL,
	[GOAL_TARGET] [numeric](5, 3) NULL,
	[USER_GOAL_ID] [int] NULL,
	[UPDATED_DATE] [timestamp] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[TRACKER_ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  ForeignKey [FK__T_GOAL__GOAL_TYP__1920BF5C]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_GOAL]  WITH CHECK ADD FOREIGN KEY([GOAL_TYPE_ID])
REFERENCES [dbo].[T_GOAL_TYPE] ([GOAL_TYPE_ID])
GO
/****** Object:  ForeignKey [FK__T_GOAL__TAG_ID__1B0907CE]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_GOAL]  WITH CHECK ADD FOREIGN KEY([TAG_ID])
REFERENCES [dbo].[T_TAG] ([TAG_ID])
GO
/****** Object:  ForeignKey [FK__T_BADGE__CREATED__440B1D61]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_BADGE]  WITH CHECK ADD  CONSTRAINT [FK__T_BADGE__CREATED__440B1D61] FOREIGN KEY([CREATED_BY])
REFERENCES [dbo].[T_USER] ([USER_ID])
GO
ALTER TABLE [dbo].[T_BADGE] CHECK CONSTRAINT [FK__T_BADGE__CREATED__440B1D61]
GO
/****** Object:  ForeignKey [FK__T_USER_GO__GOAL___29572725]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_USER_GOAL]  WITH CHECK ADD FOREIGN KEY([GOAL_ID])
REFERENCES [dbo].[T_GOAL] ([GOAL_ID])
GO
/****** Object:  ForeignKey [FK__T_USER_GO__USER___2A4B4B5E]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_USER_GOAL]  WITH CHECK ADD  CONSTRAINT [FK__T_USER_GO__USER___2A4B4B5E] FOREIGN KEY([USER_ID])
REFERENCES [dbo].[T_USER] ([USER_ID])
GO
ALTER TABLE [dbo].[T_USER_GOAL] CHECK CONSTRAINT [FK__T_USER_GO__USER___2A4B4B5E]
GO
/****** Object:  ForeignKey [FK__T_USER_BA__BADGE__46E78A0C]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_USER_BADGE]  WITH CHECK ADD FOREIGN KEY([BADGE_ID])
REFERENCES [dbo].[T_BADGE] ([BADGE_ID])
GO
/****** Object:  ForeignKey [FK__T_USER_BA__USER___45F365D3]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_USER_BADGE]  WITH CHECK ADD  CONSTRAINT [FK__T_USER_BA__USER___45F365D3] FOREIGN KEY([USER_ID])
REFERENCES [dbo].[T_USER] ([USER_ID])
GO
ALTER TABLE [dbo].[T_USER_BADGE] CHECK CONSTRAINT [FK__T_USER_BA__USER___45F365D3]
GO
/****** Object:  ForeignKey [FK__T_STEP__GOAL_ID__24927208]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_STEP]  WITH CHECK ADD FOREIGN KEY([GOAL_ID])
REFERENCES [dbo].[T_GOAL] ([GOAL_ID])
GO
/****** Object:  ForeignKey [FK__T_TRACKER__STEP___398D8EEE]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_TRACKER_INDEX_ARCHIEVE]  WITH CHECK ADD FOREIGN KEY([STEP_ID])
REFERENCES [dbo].[T_STEP] ([STEP_ID])
GO
/****** Object:  ForeignKey [FK__T_TRACKER__USER___38996AB5]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_TRACKER_INDEX_ARCHIEVE]  WITH CHECK ADD FOREIGN KEY([USER_GOAL_ID])
REFERENCES [dbo].[T_USER_GOAL] ([USER_GOAL_ID])
GO
/****** Object:  ForeignKey [FK__T_TRACKER__STEP___33D4B598]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_TRACKER_INDEX]  WITH CHECK ADD FOREIGN KEY([STEP_ID])
REFERENCES [dbo].[T_STEP] ([STEP_ID])
GO
/****** Object:  ForeignKey [FK__T_TRACKER__USER___32E0915F]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_TRACKER_INDEX]  WITH CHECK ADD FOREIGN KEY([USER_GOAL_ID])
REFERENCES [dbo].[T_USER_GOAL] ([USER_GOAL_ID])
GO
/****** Object:  ForeignKey [FK__T_TRACKER__USER___5CD6CB2B]    Script Date: 09/25/2015 11:42:56 ******/
ALTER TABLE [dbo].[T_TRACKER]  WITH CHECK ADD FOREIGN KEY([USER_GOAL_ID])
REFERENCES [dbo].[T_USER_GOAL] ([USER_GOAL_ID])
GO

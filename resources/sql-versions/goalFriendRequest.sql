-- ----------------------------
-- Table structure for `f_friend_request_type`
-- ----------------------------
CREATE TABLE `f_friend_request_type` (
  `friendRequestTypeId` int(5) NOT NULL,
  `friendRequestTypeName` varchar(100) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`friendRequestTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_friend_request_type
-- ----------------------------
INSERT INTO `f_friend_request_type` VALUES (1, 'SHARED_PENDING', 1);
INSERT INTO `f_friend_request_type` VALUES (2, 'PENDING	', 1);
INSERT INTO `f_friend_request_type` VALUES (3, 'CONFIRMED', 1);
INSERT INTO `f_friend_request_type` VALUES (4, 'REVOKED', 1);
INSERT INTO `f_friend_request_type` VALUES (5, 'REJECTED', 1);


Alter table `f_goal` add column `goalMembersCount` int(10) NOT NULL DEFAULT 1 after `isPrivateGoal`;

Alter table `f_user_goal` drop column `active`;
Alter table `f_user_goal` add column `statusType` int(5) after `modifiedBy`;




/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : mgame

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 29/06/2019 09:42:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_bet
-- ----------------------------
DROP TABLE IF EXISTS `t_bet`;
CREATE TABLE `t_bet`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `gameid` int(11) NOT NULL,
  `roomid` int(11) NOT NULL,
  `roundid` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bet` decimal(10, 0) NOT NULL,
  `paid` decimal(10, 0) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 67 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_bet
-- ----------------------------
INSERT INTO `t_bet` VALUES (1, 1, 1000, 4, '1561633854198', 1700, 0, '2019-06-27 17:41:59');
INSERT INTO `t_bet` VALUES (2, 1, 1000, 4, '1561633854198', 1700, 0, '2019-06-27 17:43:28');
INSERT INTO `t_bet` VALUES (3, 1, 1000, 4, '1561634041906', 500, 800, '2019-06-27 17:47:24');
INSERT INTO `t_bet` VALUES (4, 1, 1000, 4, '1561634719914', 1600, 2600, '2019-06-27 17:55:36');
INSERT INTO `t_bet` VALUES (5, 1, 1000, 4, '1561634982079', 1900, 1950, '2019-06-27 17:59:55');
INSERT INTO `t_bet` VALUES (6, 1, 1000, 4, '1561689543087', 1700, 195, '2019-06-28 09:09:14');
INSERT INTO `t_bet` VALUES (7, 1, 1000, 4, '1561689603483', 1700, 975, '2019-06-28 09:10:18');
INSERT INTO `t_bet` VALUES (8, 4, 1000, 4, '1561689603483', 600, 0, '2019-06-28 09:10:18');
INSERT INTO `t_bet` VALUES (9, 1, 1000, 4, '1561689767899', 1800, 0, '2019-06-28 09:12:58');
INSERT INTO `t_bet` VALUES (10, 4, 1000, 4, '1561689767899', 300, 0, '2019-06-28 09:12:58');
INSERT INTO `t_bet` VALUES (11, 1, 1000, 4, '1561689797933', 800, 0, '2019-06-28 09:13:30');
INSERT INTO `t_bet` VALUES (12, 4, 1000, 4, '1561689797933', 900, 900, '2019-06-28 09:13:30');
INSERT INTO `t_bet` VALUES (13, 1, 1000, 4, '1561689829493', 1000, 0, '2019-06-28 09:14:02');
INSERT INTO `t_bet` VALUES (14, 4, 1000, 4, '1561689829493', 700, 975, '2019-06-28 09:14:02');
INSERT INTO `t_bet` VALUES (15, 1, 1000, 4, '1561689867757', 2000, 0, '2019-06-28 09:14:34');
INSERT INTO `t_bet` VALUES (16, 4, 1000, 4, '1561689867757', 1000, 800, '2019-06-28 09:14:34');
INSERT INTO `t_bet` VALUES (17, 4, 1000, 4, '1561689898068', 1000, 990, '2019-06-28 09:15:06');
INSERT INTO `t_bet` VALUES (18, 1, 1000, 4, '1561689988154', 500, 1000, '2019-06-28 09:16:42');
INSERT INTO `t_bet` VALUES (19, 4, 1000, 4, '1561689988154', 100, 0, '2019-06-28 09:16:42');
INSERT INTO `t_bet` VALUES (20, 4, 1000, 1, '1561690609448', 100, 0, '2019-06-28 09:27:06');
INSERT INTO `t_bet` VALUES (21, 4, 1000, 1, '1561690643777', 100, 0, '2019-06-28 09:27:38');
INSERT INTO `t_bet` VALUES (22, 4, 1000, 1, '1561690683342', 800, 0, '2019-06-28 09:28:10');
INSERT INTO `t_bet` VALUES (23, 1, 1000, 1, '1561690746498', 600, 1000, '2019-06-28 09:29:14');
INSERT INTO `t_bet` VALUES (24, 1, 1000, 1, '1561692474103', 300, 0, '2019-06-28 09:58:02');
INSERT INTO `t_bet` VALUES (25, 1, 1000, 1, '1561692498497', 800, 1000, '2019-06-28 09:58:34');
INSERT INTO `t_bet` VALUES (26, 1, 1000, 1, '1561692530452', 700, 2000, '2019-06-28 09:59:06');
INSERT INTO `t_bet` VALUES (27, 1, 1000, 1, '1561692567712', 600, 200, '2019-06-28 09:59:38');
INSERT INTO `t_bet` VALUES (28, 1, 1000, 1, '1561692596349', 800, 400, '2019-06-28 10:00:10');
INSERT INTO `t_bet` VALUES (29, 1, 1000, 1, '1561692661936', 800, 600, '2019-06-28 10:01:14');
INSERT INTO `t_bet` VALUES (30, 1, 1000, 1, '1561692699466', 800, 200, '2019-06-28 10:01:46');
INSERT INTO `t_bet` VALUES (31, 1, 1000, 1, '1561699644461', 600, 195, '2019-06-28 11:57:56');
INSERT INTO `t_bet` VALUES (32, 1, 1000, 1, '1561699943241', 400, 400, '2019-06-28 12:02:37');
INSERT INTO `t_bet` VALUES (33, 1, 1000, 1, '1561703121054', 800, 600, '2019-06-28 12:55:39');
INSERT INTO `t_bet` VALUES (34, 1, 1000, 1, '1561703154756', 800, 800, '2019-06-28 12:56:13');
INSERT INTO `t_bet` VALUES (35, 1, 1000, 1, '1561709127121', 800, 800, '2019-06-28 14:35:44');
INSERT INTO `t_bet` VALUES (36, 1, 1000, 1, '1561709162776', 100, 100, '2019-06-28 14:36:18');
INSERT INTO `t_bet` VALUES (37, 1, 1000, 1, '1561709358584', 100, 0, '2019-06-28 14:39:27');
INSERT INTO `t_bet` VALUES (38, 1, 1000, 1, '1561709388291', 500, 0, '2019-06-28 14:40:01');
INSERT INTO `t_bet` VALUES (39, 1, 1000, 1, '1561709794696', 700, 0, '2019-06-28 14:46:50');
INSERT INTO `t_bet` VALUES (40, 1, 1000, 1, '1561709828010', 800, 975, '2019-06-28 14:47:24');
INSERT INTO `t_bet` VALUES (41, 1, 1000, 1, '1561710848822', 800, 1000, '2019-06-28 15:04:24');
INSERT INTO `t_bet` VALUES (42, 1, 1000, 1, '1561711154031', 500, 400, '2019-06-28 15:09:30');
INSERT INTO `t_bet` VALUES (43, 1, 1000, 1, '1561711288919', 800, 0, '2019-06-28 15:11:46');
INSERT INTO `t_bet` VALUES (44, 4, 1000, 1, '1561711288919', 800, 800, '2019-06-28 15:11:46');
INSERT INTO `t_bet` VALUES (45, 1, 1000, 1, '1561711330568', 800, 0, '2019-06-28 15:12:20');
INSERT INTO `t_bet` VALUES (46, 4, 1000, 1, '1561711330568', 800, 1000, '2019-06-28 15:12:20');
INSERT INTO `t_bet` VALUES (47, 1, 1000, 1, '1561711358496', 800, 1400, '2019-06-28 15:12:54');
INSERT INTO `t_bet` VALUES (48, 1, 1000, 1, '1561711396236', 100, 0, '2019-06-28 15:13:28');
INSERT INTO `t_bet` VALUES (49, 4, 1000, 1, '1561711396236', 800, 975, '2019-06-28 15:13:28');
INSERT INTO `t_bet` VALUES (50, 1, 1000, 1, '1561711464396', 800, 0, '2019-06-28 15:14:36');
INSERT INTO `t_bet` VALUES (51, 4, 1000, 1, '1561711464396', 800, 1000, '2019-06-28 15:14:36');
INSERT INTO `t_bet` VALUES (52, 1, 1000, 1, '1561711493115', 800, 0, '2019-06-28 15:15:10');
INSERT INTO `t_bet` VALUES (53, 4, 1000, 1, '1561711493115', 800, 0, '2019-06-28 15:15:10');
INSERT INTO `t_bet` VALUES (54, 5, 1000, 1, '1561711671439', 800, 600, '2019-06-28 15:18:00');
INSERT INTO `t_bet` VALUES (55, 1, 1000, 1, '1561711699515', 800, 0, '2019-06-28 15:18:34');
INSERT INTO `t_bet` VALUES (56, 4, 1000, 1, '1561711699515', 800, 780, '2019-06-28 15:18:34');
INSERT INTO `t_bet` VALUES (57, 5, 1000, 1, '1561711699515', 800, 0, '2019-06-28 15:18:34');
INSERT INTO `t_bet` VALUES (58, 1, 1000, 1, '1561714912676', 600, 1000, '2019-06-28 16:12:10');
INSERT INTO `t_bet` VALUES (59, 1, 1000, 1, '1561715064002', 700, 1000, '2019-06-28 16:14:41');
INSERT INTO `t_bet` VALUES (60, 1, 1000, 1, '1561715378485', 400, 800, '2019-06-28 16:20:11');
INSERT INTO `t_bet` VALUES (61, 1, 1000, 1, '1561715521044', 700, 0, '2019-06-28 16:22:10');
INSERT INTO `t_bet` VALUES (62, 1, 1000, 1, '1561719361172', 400, 0, '2019-06-28 17:26:15');
INSERT INTO `t_bet` VALUES (63, 1, 1000, 1, '1561719535139', 200, 0, '2019-06-28 17:29:05');
INSERT INTO `t_bet` VALUES (64, 1, 1000, 2, '1561719992148', 1300, 0, '2019-06-28 17:36:50');
INSERT INTO `t_bet` VALUES (65, 1, 1000, 2, '1561720028704', 1100, 195, '2019-06-28 17:37:24');
INSERT INTO `t_bet` VALUES (66, 1, 1000, 1, '1561720642961', 1000, 0, '2019-06-28 17:47:36');

-- ----------------------------
-- Table structure for t_game
-- ----------------------------
DROP TABLE IF EXISTS `t_game`;
CREATE TABLE `t_game`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `gameid` int(11) NOT NULL,
  `roomid` int(11) NOT NULL,
  `roundid` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `room_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `game_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_game
-- ----------------------------
INSERT INTO `t_game` VALUES (1, 1000, 4, '1561633854198', '百家乐B2', '0|0|8|6', '2019-06-27 17:43:28');
INSERT INTO `t_game` VALUES (2, 1000, 4, '1561634041906', '百家乐B2', '0|2|9|1', '2019-06-27 17:47:24');
INSERT INTO `t_game` VALUES (3, 1000, 4, '1561634719914', '百家乐B2', '1|2|3|6', '2019-06-27 17:55:36');
INSERT INTO `t_game` VALUES (4, 1000, 4, '1561634982079', '百家乐B2', '0|1|6|4', '2019-06-27 17:59:55');
INSERT INTO `t_game` VALUES (5, 1000, 4, '1561689543087', '百家乐B2', '0|0|8|7', '2019-06-28 09:09:14');
INSERT INTO `t_game` VALUES (6, 1000, 4, '1561689603483', '百家乐B2', '0|0|9|5', '2019-06-28 09:10:18');
INSERT INTO `t_game` VALUES (7, 1000, 4, '1561689767899', '百家乐B2', '0|1|8|7', '2019-06-28 09:12:58');
INSERT INTO `t_game` VALUES (8, 1000, 4, '1561689797933', '百家乐B2', '2|0|5|5', '2019-06-28 09:13:30');
INSERT INTO `t_game` VALUES (9, 1000, 4, '1561689829493', '百家乐B2', '0|0|5|4', '2019-06-28 09:14:02');
INSERT INTO `t_game` VALUES (10, 1000, 4, '1561689867757', '百家乐B2', '1|0|3|7', '2019-06-28 09:14:34');
INSERT INTO `t_game` VALUES (11, 1000, 4, '1561689898068', '百家乐B2', '0|2|4|2', '2019-06-28 09:15:06');
INSERT INTO `t_game` VALUES (12, 1000, 4, '1561689988154', '百家乐B2', '0|2|6|2', '2019-06-28 09:16:42');
INSERT INTO `t_game` VALUES (13, 1000, 1, '1561690609448', '百家乐A1', '0|2|7|2', '2019-06-28 09:27:06');
INSERT INTO `t_game` VALUES (14, 1000, 1, '1561690643777', '百家乐A1', '1|0|5|9', '2019-06-28 09:27:38');
INSERT INTO `t_game` VALUES (15, 1000, 1, '1561690683342', '百家乐A1', '0|2|6|4', '2019-06-28 09:28:10');
INSERT INTO `t_game` VALUES (16, 1000, 1, '1561690746498', '百家乐A1', '1|0|2|9', '2019-06-28 09:29:14');
INSERT INTO `t_game` VALUES (17, 1000, 1, '1561692474103', '百家乐A1', '0|1|8|6', '2019-06-28 09:58:02');
INSERT INTO `t_game` VALUES (18, 1000, 1, '1561692498497', '百家乐A1', '1|0|4|8', '2019-06-28 09:58:34');
INSERT INTO `t_game` VALUES (19, 1000, 1, '1561692530452', '百家乐A1', '2|0|9|9', '2019-06-28 09:59:06');
INSERT INTO `t_game` VALUES (20, 1000, 1, '1561692567712', '百家乐A1', '1|2|4|8', '2019-06-28 09:59:38');
INSERT INTO `t_game` VALUES (21, 1000, 1, '1561692596349', '百家乐A1', '1|0|0|5', '2019-06-28 10:00:10');
INSERT INTO `t_game` VALUES (22, 1000, 1, '1561692661936', '百家乐A1', '1|0|2|3', '2019-06-28 10:01:14');
INSERT INTO `t_game` VALUES (23, 1000, 1, '1561692699466', '百家乐A1', '1|0|3|9', '2019-06-28 10:01:46');
INSERT INTO `t_game` VALUES (24, 1000, 1, '1561699644461', '百家乐A1', '0|0|7|4', '2019-06-28 11:57:56');
INSERT INTO `t_game` VALUES (25, 1000, 1, '1561699943241', '百家乐A1', '1|0|5|6', '2019-06-28 12:02:37');
INSERT INTO `t_game` VALUES (26, 1000, 1, '1561703121054', '百家乐A1', '1|0|3|8', '2019-06-28 12:55:39');
INSERT INTO `t_game` VALUES (27, 1000, 1, '1561703154756', '百家乐A1', '1|0|3|7', '2019-06-28 12:56:13');
INSERT INTO `t_game` VALUES (28, 1000, 1, '1561709127121', '百家乐A1', '1|0|6|9', '2019-06-28 14:35:44');
INSERT INTO `t_game` VALUES (29, 1000, 1, '1561709162776', '百家乐A1', '2|0|4|4', '2019-06-28 14:36:18');
INSERT INTO `t_game` VALUES (30, 1000, 1, '1561709358584', '百家乐A1', '1|0|2|7', '2019-06-28 14:39:27');
INSERT INTO `t_game` VALUES (31, 1000, 1, '1561709388291', '百家乐A1', '0|1|9|3', '2019-06-28 14:40:01');
INSERT INTO `t_game` VALUES (32, 1000, 1, '1561709794696', '百家乐A1', '1|0|2|8', '2019-06-28 14:46:50');
INSERT INTO `t_game` VALUES (33, 1000, 1, '1561709828010', '百家乐A1', '0|0|9|1', '2019-06-28 14:47:24');
INSERT INTO `t_game` VALUES (34, 1000, 1, '1561710848822', '百家乐A1', '1|0|6|7', '2019-06-28 15:04:24');
INSERT INTO `t_game` VALUES (35, 1000, 1, '1561711154031', '百家乐A1', '1|0|1|8', '2019-06-28 15:09:30');
INSERT INTO `t_game` VALUES (36, 1000, 1, '1561711288919', '百家乐A1', '1|0|3|7', '2019-06-28 15:11:46');
INSERT INTO `t_game` VALUES (37, 1000, 1, '1561711330568', '百家乐A1', '1|0|6|7', '2019-06-28 15:12:20');
INSERT INTO `t_game` VALUES (38, 1000, 1, '1561711358496', '百家乐A1', '1|0|2|6', '2019-06-28 15:12:54');
INSERT INTO `t_game` VALUES (39, 1000, 1, '1561711396236', '百家乐A1', '0|0|4|0', '2019-06-28 15:13:28');
INSERT INTO `t_game` VALUES (40, 1000, 1, '1561711464396', '百家乐A1', '1|0|4|5', '2019-06-28 15:14:36');
INSERT INTO `t_game` VALUES (41, 1000, 1, '1561711493115', '百家乐A1', '0|0|9|3', '2019-06-28 15:15:10');
INSERT INTO `t_game` VALUES (42, 1000, 1, '1561711671439', '百家乐A1', '1|0|5|6', '2019-06-28 15:18:00');
INSERT INTO `t_game` VALUES (43, 1000, 1, '1561711699515', '百家乐A1', '0|0|9|5', '2019-06-28 15:18:34');
INSERT INTO `t_game` VALUES (44, 1000, 1, '1561714912676', '百家乐A1', '1|0|5|6', '2019-06-28 16:12:10');
INSERT INTO `t_game` VALUES (45, 1000, 1, '1561715064002', '百家乐A1', '1|0|2|9', '2019-06-28 16:14:41');
INSERT INTO `t_game` VALUES (46, 1000, 1, '1561715378485', '百家乐A1', '1|0|1|8', '2019-06-28 16:20:11');
INSERT INTO `t_game` VALUES (47, 1000, 1, '1561715521044', '百家乐A1', '0|0|6|2', '2019-06-28 16:22:10');
INSERT INTO `t_game` VALUES (48, 1000, 1, '1561719361172', '百家乐A1', '0|0|5|4', '2019-06-28 17:26:15');
INSERT INTO `t_game` VALUES (49, 1000, 1, '1561719535139', '百家乐A1', '1|0|3|8', '2019-06-28 17:29:05');
INSERT INTO `t_game` VALUES (50, 1000, 2, '1561719992148', '百家乐B1', '0|0|8|3', '2019-06-28 17:36:50');
INSERT INTO `t_game` VALUES (51, 1000, 2, '1561720028704', '百家乐B1', '0|0|8|6', '2019-06-28 17:37:24');
INSERT INTO `t_game` VALUES (52, 1000, 1, '1561720642961', '百家乐A1', '0|0|5|1', '2019-06-28 17:47:36');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `nick_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `gold` decimal(10, 0) NOT NULL DEFAULT 0,
  `roomcard` int(11) NOT NULL DEFAULT 0,
  `sex` int(11) NOT NULL DEFAULT 0,
  `head` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (1, 'test1', 'test1', NULL, '7c4a8d09ca3762af61e59520943dc26494f8941b', '2019-06-06 16:11:24', 20154, 0, 0, NULL);
INSERT INTO `t_user` VALUES (4, 'test2', '测试2', NULL, '7c4a8d09ca3762af61e59520943dc26494f8941b', '2019-06-21 13:59:54', 8118, 0, 0, NULL);
INSERT INTO `t_user` VALUES (5, 'test3', '测试3', NULL, '7c4a8d09ca3762af61e59520943dc26494f8941b', '2019-06-28 15:16:25', 9000, 0, 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;

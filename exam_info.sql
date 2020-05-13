/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50634
Source Host           : localhost:3306
Source Database       : exam_info

Target Server Type    : MYSQL
Target Server Version : 50634
File Encoding         : 65001

Date: 2020-05-13 20:00:45
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first` varchar(50) DEFAULT NULL,
  `last` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_register` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `address` text,
  `phone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', 'Ronaldo', 'Joven', 'ronijoven@gmail.com', null, 'Napindan, Taguig', null);

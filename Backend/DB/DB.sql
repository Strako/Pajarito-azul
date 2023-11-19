/*
    This script contains all MySQL Querys
    from the database gpsdb

    entities:
        user, tweet, follow, like
    relations:
        user <- many-many -> user (table followers)
        user <- one-many -> tweet
        user <- one-many -> like (table usersLikes)


*/

DROP DATABASE IF EXISTS `gpsdb`;
CREATE DATABASE IF NOT EXISTS `gpsdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `gpsdb`;

/*
    Table structure for table user
    atributte: userid, user, name, email, password, userImage, desciption
*/

DROP TABLE IF EXISTS `users`;
CREATE  TABLE IF NOT EXISTS `users` (
  `userid` INT NOT NULL AUTO_INCREMENT ,
  `user` VARCHAR(15) NOT NULL UNIQUE,
  `name` VARCHAR(45) NOT NULL ,
  `password` VARCHAR(250) NOT NULL ,
  `userImage` VARCHAR(100) NULL ,
  `description` VARCHAR(200) NULL ,
  PRIMARY KEY (`userid`) );


/*
    Table structure for table tweet
    atributte: tweetid, userid, tweet, tweetImage, date
*/

DROP TABLE IF EXISTS `tweets`;
CREATE  TABLE IF NOT EXISTS `tweets` (
  `tweetid` INT NOT NULL AUTO_INCREMENT ,
  `userid` INT NOT NULL ,
  `description` VARCHAR(255) NOT NULL ,
  `tweetImage` VARCHAR(90) NULL ,
  `datetime` VARCHAR(30) NOT NULL ,
  PRIMARY KEY (`tweetid`) ,
  FOREIGN KEY (`userid` ) REFERENCES `users` (`userid` ));

/*
  Table structure for table likes
  atributte: likeid, userid, tweetid, date
*/

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `likeid` INT NOT NULL AUTO_INCREMENT ,
  `userid` INT NOT NULL ,
  `tweetid` INT NOT NULL ,
  `datetime` VARCHAR(30) NULL,
  PRIMARY KEY (`likeid`) ,
  FOREIGN KEY (`userid` ) REFERENCES `users` (`userid` ),
  CONSTRAINT `fk_likes_tweet` FOREIGN KEY (`tweetid` ) REFERENCES `tweets` (`tweetid` ));

/*
  Table structure for comments
  atributte: commentid, userid, tweetid, date, comment
*/
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `commentid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL ,
  `tweetid` INT NOT NULL ,
  `comment` VARCHAR(255) NOT NULL ,
  `datetime` VARCHAR(30) NULL,
  PRIMARY KEY (`commentid`) ,
  FOREIGN KEY (`userid` ) REFERENCES `users` (`userid` ),
  CONSTRAINT `fk_comments_tweet` FOREIGN KEY (`tweetid` ) REFERENCES `tweets` (`tweetid` ));

/*
  Table structure for table follows
  atributte: followid, followerid, followingid, date
*/
DROP TABLE IF EXISTS `follows`;
CREATE TABLE IF NOT EXISTS `follows`(
  `followid` INT NOT NULL AUTO_INCREMENT ,
  `followerid` INT NOT NULL ,
  `followingid` INT NOT NULL,
  `followdate` VARCHAR(30) NULL,
  PRIMARY KEY (`followid`) ,
  FOREIGN KEY (`followerid` ) REFERENCES `users` (`userid` ),
  FOREIGN KEY (`followingid` ) REFERENCES `users` (`userid` ));

/*
  Table structure for table notifications
  atributte: notificationid, emitterid, receiverid, date, action, status
*/
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications`(
  `notificationid` INT NOT NULL AUTO_INCREMENT ,
  `emitterid` INT NOT NULL ,
  `receiverid` INT NOT NULL,
  `datetime` VARCHAR(30) NOT NULL,
  `interaction` VARCHAR(15) NOT NULL,
  `commentid` INT NULL DEFAULT NULL,
  `likeid` INT NULL DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`notificationid`) ,
  FOREIGN KEY (`emitterid` ) REFERENCES `users` (`userid` ),
  FOREIGN KEY (`receiverid` ) REFERENCES `users` (`userid` ));

/*
  Triggers for the table tweets
*/
DROP TRIGGER IF EXISTS after_insert_like;
DELIMITER //
CREATE TRIGGER after_insert_like
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
  INSERT INTO notifications (emitterid, receiverid, datetime, interaction,likeid, status)
  VALUES (NEW.userid, (SELECT userid FROM tweets WHERE tweetid = NEW.tweetid), NOW(), 'like',NEW.likeid, 0);
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_delete_like;
DELIMITER //
CREATE TRIGGER after_delete_like
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
  DELETE FROM notifications WHERE emitterid = OLD.userid AND interaction = 'like' AND receiverid = (SELECT userid FROM tweets WHERE tweetid = OLD.tweetid);
END;
//
DELIMITER ;


/*
  -- Triggers for the table follows
*/
DROP TRIGGER IF EXISTS after_insert_follow;
DELIMITER //
CREATE TRIGGER after_insert_follow
AFTER INSERT ON follows
FOR EACH ROW
BEGIN
  INSERT INTO notifications (emitterid, receiverid, datetime, interaction, status)
  VALUES (NEW.followerid, NEW.followingid, NOW(), 'follow', 0);
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_delete_follow;
DELIMITER //
CREATE TRIGGER after_delete_follow
AFTER DELETE ON follows
FOR EACH ROW
BEGIN
  DELETE FROM notifications WHERE emitterid = OLD.followerid AND interaction = 'follow' AND receiverid = OLD.followingid;
END;
//
DELIMITER ;

/*
  -- Triggers for the table comments
*/
DROP TRIGGER IF EXISTS after_insert_comment;
DELIMITER //
CREATE TRIGGER after_insert_comment
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
  INSERT INTO notifications (emitterid, receiverid, datetime, interaction,commentid, status)
  VALUES (NEW.userid, (SELECT userid FROM tweets WHERE tweetid = NEW.tweetid), NOW(), 'comment',NEW.commentid, 0);
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_delete_comment;
DELIMITER //
CREATE TRIGGER after_delete_comment
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
  DELETE FROM notifications WHERE emitterid = OLD.userid AND interaction = 'comment' AND receiverid = (SELECT userid FROM tweets WHERE tweetid = OLD.tweetid);
END;
//
DELIMITER ;


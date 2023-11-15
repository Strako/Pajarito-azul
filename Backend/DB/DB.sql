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
  `description` VARCHAR(140) NOT NULL ,
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
  `date` VARCHAR(15) NULL,
  PRIMARY KEY (`likeid`) ,
  FOREIGN KEY (`userid` ) REFERENCES `users` (`userid` ),
  CONSTRAINT `fk_likes_tweet` FOREIGN KEY (`tweetid` ) REFERENCES `tweets` (`tweetid` ));

/*
  Table structure for table follows
  atributte: followid, followerid, followingid, date
*/
DROP TABLE IF EXISTS `follows`;
CREATE TABLE IF NOT EXISTS `follows`(
  `followid` INT NOT NULL AUTO_INCREMENT ,
  `followerid` INT NOT NULL ,
  `followingid` INT NOT NULL,
  `followdate` VARCHAR(15) NULL,
  PRIMARY KEY (`followid`) ,
  FOREIGN KEY (`followerid` ) REFERENCES `users` (`userid` ),
  FOREIGN KEY (`followingid` ) REFERENCES `users` (`userid` ));

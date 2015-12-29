CREATE TABLE users (
    userid varchar(32),
    name varchar(32),
    PRIMARY KEY (userid)
);

CREATE TABLE rooms (
    id varchar(17) NOT NULL,
    title varchar(140) NOT NULL,
    user_id varchar(32) NOT NULL,
    game_id varchar(45) DEFAULT NULL,
    created datetime DEFAULT NULL,
    modified datetime DEFAULT NULL,
    deleted datetime DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE messages (
    id int(11) NOT NULL AUTO_INCREMENT,
    room_id varchar(17) CHARACTER SET utf8 NOT NULL,
    user_id varchar(32) CHARACTER SET utf8 NOT NULL,
    name varchar(45) CHARACTER SET utf8 NOT NULL,
    message text CHARACTER SET utf8 NOT NULL,
    character_url varchar(200) CHARACTER SET utf8 DEFAULT NULL,
    icon_id varchar(17) CHARACTER SET utf8 DEFAULT NULL,
    created datetime DEFAULT NULL,
    modified datetime DEFAULT NULL,
    deleted datetime DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE icons (
  id char(17) NOT NULL,
  user_id varchar(32) DEFAULT NULL,
  name varchar(45) DEFAULT NULL,
  type varchar(45) DEFAULT NULL,
  data mediumblob,
  created datetime DEFAULT NULL,
  modified datetime DEFAULT NULL,
  deleted datetime DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE VIEW room_histories AS
    SELECT
        messages.room_id AS id,
        messages.user_id AS user_id,
        rooms.title AS title,
        rooms.deleted AS deleted,
        max(messages.modified) AS modified
    FROM messages JOIN rooms ON rooms.id = messages.room_id
    WHERE rooms.deleted IS NULL
    GROUP BY messages.room_id, messages.user_id;

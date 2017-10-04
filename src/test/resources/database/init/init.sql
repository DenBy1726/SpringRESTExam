Drop table userlist;
CREATE TABLE userlist (
  id SERIAL NOT NULL ,
  first_name varchar(45) NOT NULL,
  last_name varchar(64) NOT NULL,
  PRIMARY KEY (id)
);

drop table users;
CREATE TABLE users (
  id SERIAL NOT NULL ,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role int NOT NULL,
  PRIMARY KEY (id)
);

drop table list;
CREATE TABLE list (
  id       SERIAL          NOT NULL  PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  userlists int NOT NULL
);

drop table notes;
CREATE TABLE notes (
  id SERIAL NOT NULL ,
  name varchar(255) NOT NULL,
  checkmark boolean NOT NULL,
  listsid int NOT NULL,
  PRIMARY KEY (id)
);
drop table contact;
CREATE TABLE contact (
  id SERIAL NOT NULL ,
  firstname VARCHAR(255) NOT NULL ,
  lastname VARCHAR(255) ,
  birthday VARCHAR(255) ,
  email VARCHAR(255) ,
  userid int  ,
  PRIMARY KEY (id)
);

drop table persistent_logins;
create table persistent_logins (
  username VARCHAR(64) NOT NULL ,
  series VARCHAR(64) NOT NULL PRIMARY KEY,
  token VARCHAR(64) NOT NULL ,
  last_used TIMESTAMP NOT NULL
)
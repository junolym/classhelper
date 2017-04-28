/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/04/28 14:29:04                          */
/*==============================================================*/


drop trigger addstudent;

drop trigger delstudent;

drop trigger delete_sign;

drop table if exists courses;

drop table if exists coz_stu;

drop table if exists exams;

drop table if exists signup;

drop index Index_sign_id on stu_sign;

drop table if exists stu_sign;

drop table if exists students;

drop table if exists users;

/*==============================================================*/
/* Table: courses                                               */
/*==============================================================*/
create table courses
(
   coz_account          char(20),
   course_id            int not null auto_increment,
   course_name          char(20),
   course_time          text,
   course_info          text,
   student_num          int default 0,
   primary key (course_id)
);

/*==============================================================*/
/* Table: coz_stu                                               */
/*==============================================================*/
create table coz_stu
(
   cs_coz_id            int,
   cs_stu_id            int,
   cs_stu_name          char(40) not null
);

/*==============================================================*/
/* Table: exams                                                 */
/*==============================================================*/
create table exams
(
   exam_id              int not null auto_increment,
   exam_name            char(20),
   exam_state           tinyint,
   exam_time            datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   ex_coz_id            int,
   exam_question        text,
   primary key (exam_id)
);

/*==============================================================*/
/* Table: signup                                                */
/*==============================================================*/
create table signup
(
   sign_id              int not null auto_increment,
   sign_time            datetime default CURRENT_TIMESTAMP,
   sg_coz_id            int,
   primary key (sign_id)
);

/*==============================================================*/
/* Table: stu_sign                                              */
/*==============================================================*/
create table stu_sign
(
   ss_sign_id           int not null,
   ss_stu_id            int not null,
   stu_sign_time        datetime not null default CURRENT_TIMESTAMP,
   primary key (ss_stu_id, ss_sign_id)
);

/*==============================================================*/
/* Index: Index_sign_id                                         */
/*==============================================================*/
create index Index_sign_id on stu_sign
(
   ss_sign_id
);

/*==============================================================*/
/* Table: students                                              */
/*==============================================================*/
create table students
(
   student_id           int not null,
   student_name         char(40) not null,
   primary key (student_id)
);

/*==============================================================*/
/* Table: users                                                 */
/*==============================================================*/
create table users
(
   account              char(20) not null,
   password             char(32) not null,
   username             char(40) not null,
   email                char(40),
   phone                char(20),
   admin                tinyint default 0,
   primary key (account)
);

alter table courses add constraint FK_user_course foreign key (coz_account)
      references users (account) on delete restrict on update restrict;

alter table coz_stu add constraint FK_Reference_6 foreign key (cs_coz_id)
      references courses (course_id) on delete restrict on update restrict;

alter table coz_stu add constraint FK_Reference_7 foreign key (cs_stu_id)
      references students (student_id) on delete restrict on update restrict;

alter table exams add constraint FK_course_exam foreign key (ex_coz_id)
      references courses (course_id) on delete restrict on update restrict;

alter table signup add constraint FK_couser_sign foreign key (sg_coz_id)
      references courses (course_id) on delete restrict on update restrict;


create trigger addstudent after insert
on coz_stu for each row
update courses set student_num=student_num+1 where course_id=new.cs_coz_id;


create trigger delstudent after delete
on coz_stu for each row
update courses set student_num=student_num-1 where coz_id=old.cs_coz_id;


create trigger delete_sign after delete
on signup for each row
delete from stu_sign where ss_sign_id=old.sign_id;

insert into users set account='root', password='4F3CC6E16818F2E5F728D5E75D93D157', username='admin', admin=1;
insert into users set account='test', password='FDB6C662D36651211F14977097250CCA', username='test', admin=0;


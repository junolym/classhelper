/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/05/16 23:27:24                          */
/*==============================================================*/


drop trigger addans;

drop trigger addstudent;

drop trigger delstudent;

drop trigger delete_exam;

drop trigger delete_sign;

drop trigger stusign;

drop table if exists answers;

drop table if exists courses;

drop table if exists coz_stu;

drop table if exists exams;

drop table if exists signup;

drop index Index_sign_id on stu_sign;

drop table if exists stu_sign;

drop table if exists users;

/*==============================================================*/
/* Table: answers                                               */
/*==============================================================*/
create table answers
(
   ans_ex_id            int not null,
   ans_stu_id           int not null,
   ans_stu_name         char(40),
   ans_score            char(10),
   ans_answer           text,
   ans_time             datetime default CURRENT_TIMESTAMP,
   primary key (ans_ex_id, ans_stu_id)
);

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
   cs_coz_id            int not null,
   cs_stu_id            bigint not null,
   cs_stu_name          char(40) not null,
   primary key (cs_coz_id, cs_stu_id)
);

/*==============================================================*/
/* Table: exams                                                 */
/*==============================================================*/
create table exams
(
   exam_id              int not null auto_increment,
   ex_coz_id            int,
   exam_name            char(20),
   exam_state           tinyint default 0,
   exam_time            datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   exam_question        text,
   exam_statistics      text,
   exam_stu_num         int default 0,
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
   sg_stu_num           int default 0,
   primary key (sign_id)
);

/*==============================================================*/
/* Table: stu_sign                                              */
/*==============================================================*/
create table stu_sign
(
   ss_sign_id           int not null,
   ss_stu_id            int not null,
   ss_stu_name          char(40),
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
      references users (account) on delete cascade on update restrict;

alter table coz_stu add constraint FK_Reference_6 foreign key (cs_coz_id)
      references courses (course_id) on delete cascade on update restrict;

alter table exams add constraint FK_course_exam foreign key (ex_coz_id)
      references courses (course_id) on delete cascade on update restrict;

alter table signup add constraint FK_couser_sign foreign key (sg_coz_id)
      references courses (course_id) on delete cascade on update restrict;


create trigger addans after insert
on answers for each row
update exams set exam_stu_num=exam_stu_num+1
where exam_id=new.ans_ex_id;


create trigger addstudent after insert
on coz_stu for each row
update courses set student_num=student_num+1 where course_id=new.cs_coz_id;


create trigger delstudent after delete
on coz_stu for each row
update courses set student_num=student_num-1 where course_id=old.cs_coz_id;


create trigger delete_exam after delete
on exams for each row
delete from answers where ans_ex_id=old.exam_id;


create trigger delete_sign after delete
on signup for each row
delete from stu_sign where ss_sign_id=old.sign_id;


create trigger stusign after insert
on stu_sign for each row
update signup set sg_stu_num=sg_stu_num+1
where sign_id=new.ss_sign_id;

insert into users set account='root', password='4F3CC6E16818F2E5F728D5E75D93D157', username='admin', admin=1;


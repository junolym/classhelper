/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/04/24 15:37:26                          */
/*==============================================================*/


drop table if exists course_student;

drop table if exists courses;

drop table if exists exams;

drop table if exists sign_up_sheet;

drop table if exists student_sign;

drop table if exists students;

drop table if exists users;

/*==============================================================*/
/* Table: course_student                                        */
/*==============================================================*/
create table course_student
(
   course_id            int,
   student_id           int
);

/*==============================================================*/
/* Table: courses                                               */
/*==============================================================*/
create table courses
(
   account              char(20),
   course_id            int not null auto_increment,
   course_name          char(20),
   course_time          text,
   course_info          text,
   primary key (course_id)
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
   course_id            int,
   exam_question        text,
   primary key (exam_id)
);

/*==============================================================*/
/* Table: sign_up_sheet                                         */
/*==============================================================*/
create table sign_up_sheet
(
   sign_id              int not null auto_increment,
   sign_time            datetime,
   course_id            int,
   primary key (sign_id)
);

/*==============================================================*/
/* Table: student_sign                                          */
/*==============================================================*/
create table student_sign
(
   student_sign_time    datetime default CURRENT_TIMESTAMP,
   sign_id              int,
   student_id           int
);

/*==============================================================*/
/* Table: students                                              */
/*==============================================================*/
create table students
(
   student_id           int not null,
   student_name         char(20) not null,
   primary key (student_id)
);

/*==============================================================*/
/* Table: users                                                 */
/*==============================================================*/
create table users
(
   account              char(20) not null,
   password             char(20) not null,
   username             char(40) not null,
   email                char(40),
   phone                char(20),
   admin                tinyint default 0,
   primary key (account)
);

alter table course_student add constraint FK_Reference_6 foreign key (course_id)
      references courses (course_id) on delete cascade on update restrict;

alter table course_student add constraint FK_Reference_7 foreign key (student_id)
      references students (student_id) on delete cascade on update restrict;

alter table courses add constraint FK_user_course foreign key (account)
      references users (account) on delete cascade on update restrict;

alter table exams add constraint FK_course_exam foreign key (course_id)
      references courses (course_id) on delete cascade on update restrict;

alter table sign_up_sheet add constraint FK_couser_sign foreign key (course_id)
      references courses (course_id) on delete cascade on update restrict;

alter table student_sign add constraint FK_Reference_8 foreign key (student_id)
      references course_student (student_id) on delete cascade on update restrict;

alter table student_sign add constraint FK_student_sign foreign key (sign_id)
      references sign_up_sheet (sign_id) on delete cascade on update restrict;

insert into users set account='root', password='root', username='admin', admin=1;

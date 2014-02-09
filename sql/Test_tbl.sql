drop table if exists Test_tbl;

create table Test_tbl (
    id int primary key,
    name varchar(300)
);

insert into Test_tbl (id, name) values
    (1, 'peter'),
    (2, 'joe');
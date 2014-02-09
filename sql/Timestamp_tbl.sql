-- contains all the timestamps at which data has been collected
drop table if exists Timestamp_tbl;
drop sequence if exists timestamp_seq;

create sequence timestamp_seq;
create table Timestamp_tbl (
  executionTimeId smallint primary key default nextval('timestamp_seq'),
  executionTime timestamp
);
alter sequence timestamp_seq owned by Timestamp_tbl.executionTimeId;

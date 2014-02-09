-- Station_tbl contains all the station metrics, but not how many bikes are available
drop table if exists Station_tbl;

create table Station_tbl (
  stationId smallint primary key,
  stationName varchar(300),
  totalDocks smallint,
  latitude double precision,
  longitude double precision,
  stAddress1 varchar(300),
  stAddress2 varchar(300),
  city varchar(200),
  postalCode varchar(10),
  location varchar(300),
  altitude double precision,
  testStation boolean,
  landMark varchar(300)
);

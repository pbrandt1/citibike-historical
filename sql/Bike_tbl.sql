-- Bike_tbl contains the historical information about how many bikes are at each station
drop table if exists Bike_tbl;

create table Bike_tbl (
  stationId int references Station_tbl(stationId),
  executionTime: date,
  availableDocks: int,
  availableBikes: int
);

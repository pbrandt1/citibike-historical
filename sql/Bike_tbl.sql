-- Bike_tbl contains the historical information about how many bikes are at each station
drop table if exists Bike_tbl;

create table Bike_tbl (
  stationId smallint references Station_tbl(stationId),
  executionTimeId smallint references Timestamp_tbl,
  availableDocks smallint,
  availableBikes smallint
);

drop function if exists StationInfo_prc(int);
create function StationInfo_prc(int)
returns table(
    stationId smallint,
    stationName varchar(300),
    totalDocks smallint,
    bikesAvailable smallint,
    docksAvailable smallint,
    updatedAt
)
$$

select *
from
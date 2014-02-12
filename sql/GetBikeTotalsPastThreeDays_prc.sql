-- notes: aggregate functions return bigint to minimize overflow risk
drop function if exists GetBikeTotalsPastThreeDays_prc();
create or replace function GetBikeTotalsPastThreeDays_prc()
returns table(date timestamp, bikes_available bigint, docks_available bigint, bikes_in_use bigint) as $$

select
    t.executionTime as date
    , x.availableBikes
    , x.availableDocks
    , 3510 - x.availableBikes as bikes_in_use
from timestamp_tbl t
inner join (
	select sum(b.availablebikes) as availableBikes
		, sum(b.availableDocks) as availableDocks
		, b.executiontimeid
	from bike_tbl b
	group by b.executionTimeId
) x on x.executionTimeId = t.executionTimeId
where t.executionTime > now() - interval '3 days';

$$ language 'sql';

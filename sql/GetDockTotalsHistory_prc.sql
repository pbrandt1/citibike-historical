
select
    t.executionTime
    , x.availableBikes
    , x.availableDocks
    , 3510 - x.availableBikes as bikesInUse
from timestamp_tbl t
inner join (
	select sum(b.availablebikes) as availableBikes
		, sum(b.availableDocks) as availableDocks
		, b.executiontimeid
	from bike_tbl b
	group by b.executionTimeId
) x on x.executionTimeId = t.executionTimeId
where t.executionTime > now() - interval '3 days'
#Statistical Analysis of Download Statistics
#Top 10 Downloaded Videos in the Last 7 Days
select video_id,title,album,artist from download_stats WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 7 DAY group by video_id order by count(video_id) desc limit 10;

#Most Popular Artists of the Month
select artist from download_stats WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 30 DAY group by artist order by count(artist) desc limit 5;

#Top 3 Highest Downloaded Albums of All time
select album from download_stats group by album order by count(album) desc limit 3;

#Highest Traffic(Countries) in the last 7 days
select country from download_stats WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 7 DAY group by country order by count(country) desc limit 5;

#Statistical Analysis of Download Statistics
#Top 10 Downloaded Videos in the Last 7 Days
SELECT video_id,title,album,artist 
FROM download_stats 
WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 7 DAY 
GROUP BY video_id 
ORDER BY COUNT(video_id) DESC 
LIMIT 10;

#Most Popular Artists of the Month
SELECT artist 
FROM download_stats 
WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 30 DAY 
GROUP BY artist 
ORDER BY COUNT(artist) DESC 
LIMIT 5;

#Top 3 Highest Downloaded Albums of All time
SELECT album 
FROM download_stats 
GROUP BY album 
ORDER BY COUNT(album) DESC 
LIMIT 3;

#Highest Traffic(Countries) in the last 7 days
SELECT country 
FROM download_stats 
WHERE timestamp <= NOW() AND timestamp >= NOW() - INTERVAL 7 DAY 
GROUP BY country 
ORDER BY COUNT(country) DESC 
LIMIT 5;

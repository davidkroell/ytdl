#Statistical Analysis of Download Statistics
#Top 10 Downloaded Videos in the Last 7 Days
SELECT video_id, title, album, artist
FROM download_stats
WHERE timestamp <= NOW()
  AND timestamp >= NOW() - INTERVAL 7 DAY
GROUP BY video_id
ORDER BY COUNT(video_id) DESC
LIMIT 10;

#Most Popular Artists of the Month
SELECT artist
FROM download_stats
WHERE timestamp <= NOW()
  AND timestamp >= NOW() - INTERVAL 30 DAY
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
WHERE timestamp <= NOW()
  AND timestamp >= NOW() - INTERVAL 7 DAY
GROUP BY country
ORDER BY COUNT(country) DESC
LIMIT 5;

# Number of Downloads in percent per browser type
SELECT browser, count(browser) /
                (SELECT count(browser) AS total FROM download_stats) AS percentage
FROM download_stats
GROUP BY browser;

# Number of Downloads per download type (button on UI or by using link)
SELECT CASE direct_download
         WHEN 0 THEN 'direct'
         WHEN 1 THEN 'linked'
           END                                                      AS download_type,
       COUNT(direct_download) /
       (SELECT COUNT(direct_download) AS total FROM download_stats) AS percent
FROM download_stats
GROUP BY direct_download;

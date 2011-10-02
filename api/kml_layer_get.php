<?php
include_once(dirname(__FILE__) . '/ft_login_data.php');
$FT_URL = 'http://www.google.com/fusiontables/exporttable?query=select+col2+from+' . $FUSION_TABLES_PARAMS['table_id'] . '+&o=kmllink&g=col2';

header('Content-type: application/vnd.google-earth.kml+xml');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $FT_URL);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_exec($ch);
curl_close($ch);
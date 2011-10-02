<?php
include_once(dirname(__FILE__) . '/ft_login_data.php');
include_once(dirname(__FILE__) . '/fusion-tables-client-php/constants.php');
include_once(dirname(__FILE__) . '/fusion-tables-client-php/sql.php');
include_once(dirname(__FILE__) . '/fusion-tables-client-php/clientlogin.php');

$row_ft = array(
    'name' => str_replace("'", '', $_POST['name']), 
    'geometry' => '<LineString><coordinates>' . preg_replace('/[^0-9\.,\s]/', '', $_POST['points']) . '</coordinates></LineString>',
);
$sql = "INSERT INTO " . $FUSION_TABLES_PARAMS['table_id'] . " (name, geometry) VALUES ('" . $row_ft['name'] . "', '" . $row_ft['geometry'] . "')";

$token = ClientLogin::getAuthToken($FUSION_TABLES_PARAMS['user'], $FUSION_TABLES_PARAMS['password']);
$client = new FTClientLogin($token);
$response = $client->query($sql);

echo $response;
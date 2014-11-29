<?php 
header('Content-type: application/json');
require_once '/usr/share/php/takiri/user.inc.php';
$user = user::getCurrentUser();
echo json_encode([
    'id' => $user->userid,
    'name' => $user->name
]);

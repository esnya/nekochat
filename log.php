<?php
if (array_key_exists('id', $_REQUEST)) {
    header('Content-Type: text/plain; charset=utf-8');

    $id = '#' . $_REQUEST['id'];

    $mysqli = new mysqli('localhost', 'beniimo_online', 'gtkjIKvjEl3SrI5E0JH1hH5mjlXBNZBYmwTGdkiT', 'beniimo_online');

    if ($mysqli->connect_errno) {
        echo $mysql->connect_error;
    }

    if (!($stmt = $mysqli->prepare('SELECT user_id, name, message, modified FROM messages WHERE room_id = ?'))) {
        echo $mysql->error;
    }

    if (!$stmt->bind_param('s', $id)) {
        echo $stmt->error;
    }

    if (!$stmt->execute()) {
        echo $stmt->error;
    } else {
        $stmt->bind_result($user_id, $name, $message, $modified);

        echo "// room: $id\r\n";
        echo "user\tname\tmessage\ttime\r\n";
        while ($stmt->fetch()) {
            echo "$user_id\t$name\t$message\t$modified\r\n";
        }

        $stmt->close();
    }

} else {
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script>location.href = location.href.replace('#', '?id=')</script>
</head>
<body>
</body>
</html>
<?php
}

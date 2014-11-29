<?php
$html = file_get_contents('index.php');
$script = implode(array_map(function ($src) {
    return "<script src=$src></script>";
}, array_merge(['http://code.jquery.com/qunit/qunit-1.15.0.js'], glob('test/*.js'))));
echo str_replace('</body>', $script . '</body>', 
    str_replace('</head>', '<link rel=stylesheet href="http://code.jquery.com/qunit/qunit-1.15.0.css"></head>',
    str_replace('<body>', '<body><div id=qunit></div><div id=qunit-fixture></div>', $html)));

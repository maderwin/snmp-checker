<?php
    define('APP_PATH', realpath(__DIR__ . '/..'));
    define('PROTECTED_PATH', __DIR__ );
    define('LIB_PATH', __DIR__ . '/lib');
    define('TPL_PATH', __DIR__ . '/tpl');

    define('IP_FILE_PATH', PROTECTED_PATH . '/fetch/ip.txt');

    define('ENV', @file_get_contents(PROTECTED_PATH . '/environment'));
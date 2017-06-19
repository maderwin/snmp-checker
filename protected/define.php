<?php
    define('APP_PATH', realpath(__DIR__ . '/..'));
    define('PROTECTED_PATH', __DIR__ );
    define('LIB_PATH', __DIR__ . '/lib');

    define('IP_FILE_PATH', PROTECTED_PATH . '/fetch/ip');

    define('ENV', @file_get_contents(PROTECTED_PATH . '/environment'));
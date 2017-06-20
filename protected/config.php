<?php

$config = new PhinxConfig(PROTECTED_PATH  . '/phinx.yml', trim(!!ENV ? ENV : 'production'));

ORM::configure([
    'connection_string' => 'mysql:host='.$config['host'].';port='.$config['port'].';dbname='.$config['name'],
    'username' => $config['user'],
    'password' => $config['pass'],
    'logging' => true,
]);
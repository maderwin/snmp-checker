<?php
require_once "vendor/autoload.php";
spl_autoload_register(function ($className) {
    $path = LIB_PATH . "/" . str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $className) . '.php';

    if (file_exists($path)) {
        require_once $path;
        return true;
    }
    return false;
}, false);
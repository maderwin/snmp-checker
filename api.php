<?php
require_once "protected/core.php";

$app = new Silex\Application();

//$app->get('/', function () use ($app) {
//    ob_start();
////    require TPL_PATH . '/index.php';
//    return ob_get_clean();
//});

$app->get('/points.json', function () use ($app) {
    try {
        return $app->json(AccessPoint::getPoints());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/stat/latest.json', function () use ($app) {
    try {
        return $app->json(AccessPoint::getStatLatest());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/stat/mean.json', function () use ($app) {
    try {
        return $app->json(AccessPoint::getStatMean());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/record.json', function() use ($app) {
    try {
        return $app->json(ORM::forTable('record')->select('*')->findArray());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->put('/record.json', function() use ($app) {
    try {
        return $app->json(AccessPoint::getStatMean());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->post('/record/{id}.json', function($id) use ($app) {
    try {

        return $app->json(AccessPoint::getStatMean());
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->run();
<?php
require_once "protected/core.php";

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

Request::enableHttpMethodParameterOverride();

$app = new Application();

$app->get('/', function (Application $app, Request $request) {
    if ($method = $request->get('api', false)) {
        try {
            switch ($method) {
                case 'stat': {
                    $period = $request->get('period', 'latest');
                    $field = $request->get('field', 'both');
                    $endDate = $request->get('end', (new DateTime())->format('Y-m-d 23:59:59'));
                    $startDate = $request->get('start', (new DateTime())->sub(new DateInterval('P1W'))->format('Y-m-d 00:00:00'));

                    if ($period == 'latest') {
                        return $app->json(
                            StatModel::GetList(
                                new GroupFieldEnum($field),
                                new DateTime($startDate),
                                new DateTime($endDate)
                            )
                        );
                    } else {
                        return $app->json(
                            StatModel::GetGroupList(
                                new GroupPeriodEnum($period),
                                new GroupFieldEnum($field),
                                new DateTime($startDate),
                                new DateTime($endDate)
                            )
                        );
                    }
                }
                case 'ip': {
                    $action = $request->get('action', 'list');
                    $ip = $request->get('ip', false);

                    switch ($action) {
                        case 'list': {
                            return $app->json(
                                IpModel::GetList()
                            );
                        }
                        case 'add': {
                            return $app->json(
                                IpModel::Add($ip)
                            );
                        }
                        case 'delete': {
                            return $app->json(
                                IpModel::Delete($ip)
                            );
                        }
                    }
                }
            }
        } catch (Exception $e) {
            return $app->abort(500, $e->getMessage());
        }
    }
    return $app->redirect('./index.html');
});

$app->get('/latest/{field}.json', function (Application $app, Request $request, $field) {
    $startDate = $request->get('start', (new DateTime())->sub(new DateInterval('P1W'))->format('Y-m-d 00:00:00'));
    $endDate = $request->get('end', (new DateTime())->format('Y-m-d 23:59:59'));
    try {
        return $app->json(StatModel::GetList(
            new GroupFieldEnum($field),
            new DateTime($startDate),
            new DateTime($endDate)));
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/{period}/{field}.json', function (Application $app, Request $request, $period, $field) {
    $startDate = $request->get('start', (new DateTime())->sub(new DateInterval('P1W'))->format('Y-m-d 00:00:00'));
    $endDate = $request->get('end', (new DateTime())->format('Y-m-d 23:59:59'));
    try {
        return $app->json(
            StatModel::GetGroupList(
                new GroupPeriodEnum($period),
                new GroupFieldEnum($field),
                new DateTime($startDate),
                new DateTime($endDate)
            )
        );
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/ip.json', function (Application $app, Request $request) {
    try {
        return $app->json(
            IpModel::GetList()
        );
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
});

$app->get('/ip/add/{ip}', function (Application $app, $ip) {
    try {
        return $app->json(
            IpModel::Add($ip)
        );
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
})->assert('ip', '\d+\.\d+\.\d+\.\d+');

$app->get('/ip/delete/{ip}', function (Application $app, $ip) {
    try {
        return $app->json(
            IpModel::Delete($ip)
        );
    } catch (Exception $e) {
        return $app->abort(500, $e->getMessage());
    }
})->assert('ip', '\d+\.\d+\.\d+\.\d+');;

$app->run();
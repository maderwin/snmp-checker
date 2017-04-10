<?php

class AccessPoint {
    public static function getPoints(){
        $points = ORM::forTable('record')
            ->select('ip')
            ->select('ssid')
            ->groupBy('ssid')
            ->groupBy('ip');

        return $points->findArray();
    }

    public static function getStatLatest() {
        $stat = ORM::forTable('record')
            ->tableAlias('s1')
            ->select('s1.*')
            ->leftOuterJoin('stat',
                's1.ip = s2.ip AND s1.ssid = s2.ssid AND s1.id < s2.id',
                's2'
            )
            ->whereNull('s2.id');

        return $stat->findArray();
    }

    public static function getStatMean() {
        $stat = ORM::forTable('record')
            ->select('ip')
            ->selectExpr('extract(hour FROM date)', 'hour')
            ->selectExpr('avg(users)', 'users')
            ->groupBy('hour')
            ->groupBy('ip');

        return $stat->findArray();
    }
}
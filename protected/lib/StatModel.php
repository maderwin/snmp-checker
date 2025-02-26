<?php

class StatModel
{
    static $table = 'stat';

    public static function GetList(
        GroupFieldEnum $groupField,
        DateTime $startDate = null,
        DateTime $endDate = null)
    {

        $strGroupField = $groupField->__toString();

        $table = ORM::forTable(static::$table)
            ->select('record_date', 'record_date')
            ->orderByAsc('record_date');

        if ($strGroupField == 'both') {
            $table->selectExpr("CONCAT(ip, ':', ssid)", 'both');
        } else {
            $table->select($strGroupField);
        }
        $table->groupBy($strGroupField);
        $table->groupBy('record_date');
        $table->selectExpr('SUM(users)', 'users');

        if ($startDate) {
            $table->whereGte('record_date', $startDate->format('Y-m-d 00:00:00'));
            if (!$endDate) {
                $table->whereLte('record_date', $startDate->add(new DateInterval('P1W'))->format('Y-m-d 23:59:59'));
            }
        }

        if ($endDate) {
            $table->whereLte('record_date', $endDate->format('Y-m-d 23:59:59'));
            if (!$startDate) {
                $table->whereGte('record_date', $startDate->sub(new DateInterval('P1W'))->format('Y-m-d 00:00:00'));
            }
        }

        $res = $table->findArray();

        $arResult = [
            $strGroupField => [],
            'keys' => []
        ];

        foreach ($res as $arRecord) {
            $date = $arRecord['record_date'];
            $date = static::roundDate($date);

            if (!isset($arResult[$strGroupField][$date])) {
                $arResult[$strGroupField][$date] = [];
            }

            if (!isset($arResult[$strGroupField][$date][$arRecord[$strGroupField]])) {
                $arResult[$strGroupField][$date][$arRecord[$strGroupField]] = [];
                $arResult[$strGroupField][$date]['date'] = $date;
            }

            $arResult[$strGroupField][$date][$arRecord[$strGroupField]][] = $arRecord['users'];

            $arResult['keys'][$arRecord[$strGroupField]] = $arRecord[$strGroupField];

        }

        $arResult[$strGroupField] = array_values($arResult[$strGroupField]);
        $arResult['keys'] = array_keys($arResult['keys']);
        $arResult['query'] = ORM::getLastQuery();

        foreach ($arResult[$strGroupField] as $k => $arRecord) {
            foreach ($arResult['keys'] as $key) {
                if (!isset($arRecord[$key])) {
                    $arRecord[$key] = 0;
                }else{
                    $arRecord[$key] = array_sum($arRecord[$key]);
                }
            }
            $arResult[$strGroupField][$k] = $arRecord;
        }
        return $arResult;
    }

    public static function GetGroupList(
        GroupPeriodEnum $groupPeriod,
        GroupFieldEnum $groupField,
        DateTime $startDate = null,
        DateTime $endDate = null
    )
    {
        $strGroupPeriod = $groupPeriod->__toString();
        $strGroupField = $groupField->__toString();

        $table = ORM::forTable(static::$table);

        switch ($groupPeriod) {
            case 'hour':
                $table->selectExpr('extract(hour FROM record_date)', 'hour');
                $table->groupBy('hour');
                break;
            case 'weekday':
                $table->selectExpr('WEEKDAY(record_date)', 'weekday');
                $table->groupBy('weekday');
                break;
        }

        switch ($groupField) {
            case 'ip':
                $table->select('ip', 'ip');
                $table->groupBy('ip');
                break;
            case 'ssid':
                $table->select('ssid', 'ssid');
                $table->groupBy('ssid');
                break;
            case 'both':
                $table->selectExpr("CONCAT(ip, ':', ssid)", 'both');
                $table->groupBy('ip');
                $table->groupBy('ssid');
                break;
        }

        $table->selectExpr('avg(users)', 'avg');
        $table->selectExpr('sum(users)', 'sum');

        if ($startDate) {
            $table->whereGte('record_date', $startDate->format('Y-m-d 00:00:00'));
            if (!$endDate) {
                $table->whereLte('record_date', $startDate->add(new DateInterval('P1W'))->format('Y-m-d 23:59:59'));
            }
        }

        if ($endDate) {
            $table->whereLte('record_date', $endDate->format('Y-m-d 23:59:59'));
            if (!$startDate) {
                $table->whereGte('record_date', $startDate->sub(new DateInterval('P1W'))->format('Y-m-d 00:00:00'));
            }
        }

        $res = $table->findArray();

        $arResult = [
            'sum' => [],
            'avg' => [],
            'keys' => []
        ];

        foreach ($res as $arRecord) {
            $groupPeriodValue = $arRecord[$strGroupPeriod];
            if ($strGroupPeriod == 'hour') {
                $groupPeriodValue .= ':00';
            }
            if ($strGroupPeriod == 'weekday') {
                $arWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                $groupPeriodValue = $arWeekdays[$groupPeriodValue];
            }
            if (!isset($arResult['sum'][$groupPeriodValue])) {
                $arResult['sum'][$groupPeriodValue] = [
                    $strGroupPeriod => $groupPeriodValue
                ];
            }
            if (!isset($arResult['avg'][$groupPeriodValue])) {
                $arResult['avg'][$groupPeriodValue] = [
                    $strGroupPeriod => $groupPeriodValue
                ];
            }

            $arResult['sum'][$groupPeriodValue][$arRecord[$strGroupField]] = floatval($arRecord['sum']);
            $arResult['avg'][$groupPeriodValue][$arRecord[$strGroupField]] = floatval($arRecord['avg']);
            $arResult['keys'][$arRecord[$strGroupField]] = $arRecord[$strGroupField];
        }

        $arResult['avg'] = array_values($arResult['avg']);
        $arResult['sum'] = array_values($arResult['sum']);
        $arResult['keys'] = array_keys($arResult['keys']);
        $arResult['query'] = ORM::getLastQuery();

        return $arResult;
    }

    protected
    static function roundDate($t)
    {
        $precision = 5 * 60;
        $date = \DateTime::createFromFormat('Y-m-d H:i:s', $t, new \DateTimezone('UTC'));
        $date2 = \DateTime::createFromFormat('U', round($date->getTimestamp() / $precision) * $precision, new \DateTimezone('UTC'));

        return $date2->format('Y-m-d H:i:s');
    }
}
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
            ->select('ip', 'ip')
            ->select('ssid', 'ssid')
            ->select('users', 'users')
            ->select('record_date', 'record_date')
            ->selectExpr("CONCAT(ip, ':', ssid)", 'both')
            ->orderByDesc('record_date');

        if($startDate){
            $table->whereGte('record_date', $startDate->format('Y-m-d H:i:s'));
            if(!$endDate){
                $table->whereLte('record_date', $startDate->add(new DateInterval('P1W'))->format('Y-m-d H:i:s'));
            }
        }

        if($endDate){
            $table->whereLte('record_date', $endDate->format('Y-m-d H:i:s'));
            if(!$startDate){
                $table->whereGte('record_date', $startDate->sub(new DateInterval('P1W'))->format('Y-m-d H:i:s'));
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

            if(!isset($arResult['ip'][$date])) {
                $arResult[$strGroupField][$date] = [];
            }

            if(!isset($arResult['ip'][$date][$arRecord['ip']])) {
                $arResult[$strGroupField][$date][$arRecord[$strGroupField]] = 0;
                $arResult[$strGroupField][$date]['date'] = $date;
            }

            $arResult[$strGroupField][$date][$arRecord[$strGroupField]] += $arRecord['users'];

            $arResult['keys'][$arRecord[$strGroupField]] = $arRecord[$strGroupField];

        }

        $arResult[$strGroupField] = array_values($arResult[$strGroupField]);
        $arResult['keys']= array_keys($arResult['keys']);

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

        switch($groupPeriod){
            case 'hour':
                $table->selectExpr('extract(hour FROM record_date)', 'hour');
                $table->groupBy('hour');
                break;
            case 'weekday':
                $table->selectExpr('WEEKDAY(record_date)', 'weekday');
                $table->groupBy('weekday');
                break;
        }

        switch ($groupField){
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

        if($startDate){
            $table->whereGte('record_date', $startDate->format('Y-m-d H:i:s'));
        }

        if($endDate){
            $table->whereLte('record_date', $endDate->format('Y-m-d H:i:s'));
        }
        
        $res = $table->findArray();

        $arResult = [
            'sum' => [],
            'avg' => [],
            'keys' => []
        ];

        foreach ($res as $arRecord) {
            $groupPeriodValue = $arRecord[$strGroupPeriod];
            if($strGroupPeriod == 'hour'){
                $groupPeriodValue .= ':00';
            }
            if($strGroupPeriod == 'weekday'){
                $arWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                $groupPeriodValue = $arWeekdays[$groupPeriodValue];
            }
            if(!isset($arResult['sum'][$groupPeriodValue])){
                $arResult['sum'][$groupPeriodValue] = [
                    $strGroupPeriod => $groupPeriodValue
                ];
            }
            if(!isset($arResult['avg'][$groupPeriodValue])){
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

        return $arResult;
    }

    protected static function roundDate($t){
        $precision = 15 * 60;
        $date = \DateTime::createFromFormat('Y-m-d H:i:s', $t, new \DateTimezone('UTC'));
        $date2 = \DateTime::createFromFormat('U', round($date->getTimestamp() / $precision) * $precision, new \DateTimezone('UTC'));

        return $date2->format('Y-m-d H:i:s');
    }
}
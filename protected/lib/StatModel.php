<?php

class StatModel
{
    static $table = 'Statistick';

    public static function GetList(
        GroupFieldEnum $groupField,
        DateTime $startDate = null,
        DateTime $endDate = null)
    {

        $strGroupField = $groupField->__toString();

        $table = ORM::forTable(static::$table)
            ->select('IP', 'ip')
            ->select('SSID', 'ssid')
            ->selectExpr("CONCAT(ip, ':', ssid)", 'both')
            ->select('COUNT', 'users')
            ->select('DATE', 'date')
            ->orderByDesc('DATE');

        if($startDate){
            $table->whereGte('DATE', $startDate->format('Y-m-d H:i:s'));
            if(!$endDate){
                $table->whereLte('DATE', $startDate->add(new DateInterval('P1W'))->format('Y-m-d H:i:s'));
            }
        }

        if($endDate){
            $table->whereLte('DATE', $endDate->format('Y-m-d H:i:s'));
            if(!$startDate){
                $table->whereGte('DATE', $startDate->sub(new DateInterval('P1W'))->format('Y-m-d H:i:s'));
            }
        }

        $res = $table->findArray();

        $arResult = [
            $strGroupField => [],
            'keys' => []
        ];

        foreach ($res as $arRecord) {
            $date = $arRecord['date'];
            $date = DateTime::createFromFormat('Y-m-d H:i:s', $date)->format('Y-m-d H:m:00');

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
                $table->selectExpr('extract(hour FROM date)', 'hour');
                $table->groupBy('hour');
                break;
            case 'weekday':
                $table->selectExpr('WEEKDAY(date)', 'weekday');
                $table->groupBy('weekday');
                break;
        }

        switch ($groupField){
            case 'ip':
                $table->select('IP', 'ip');
                $table->groupBy('ip');
                break;
            case 'ssid':
                $table->select('SSID', 'ssid');
                $table->groupBy('ssid');
                break;
            case 'both':
                $table->selectExpr("CONCAT(ip, ':', ssid)", 'both');
                $table->groupBy('ip');
                $table->groupBy('ssid');
                break;
        }

        $table->selectExpr('avg(COUNT)', 'avg');
        $table->selectExpr('sum(COUNT)', 'sum');

        if($startDate){
            $table->whereGte('DATE', $startDate->format('Y-m-d H:i:s'));
        }

        if($endDate){
            $table->whereLte('DATE', $endDate->format('Y-m-d H:i:s'));
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
                $groupPeriodValue = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][$groupPeriodValue];
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
}
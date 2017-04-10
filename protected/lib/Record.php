<?php

class Record {
    static function create($ip, $ssid, $users){
        $record = ORM::forTable('record')->create();

        $record->ip = $ip;
        $record->ssid = $ssid;
        $record->users = $users;
        $record->setExpr('date', 'NOW()');

        $record->save();
    }

    static function delete($id){
        $record = ORM::forTable('record')->create();

        $record->ip = $ip;
        $record->ssid = $ssid;
        $record->users = $users;
        $record->date = (new \DateTime())->format('Y-m-d H:i:s');

        $record->save();
    }
}
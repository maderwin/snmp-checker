<?php

class IpModel
{
    static $file = IP_FILE_PATH;

    public static function Add($ip){
        $ip = trim($ip);

        if(!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)){
            throw new Exception('Not valid IP address');
        }

        $arIp = array_merge( static::read(), [$ip]);
        static::write($arIp);


        return static::read();
    }

    public static function Delete($ip){
        $ip = trim($ip);

        if(!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)){
            throw new Exception('Not valid IP address');
        }

        $arIp = static::read();

        foreach ($arIp as $k => $item) {
            if($item == $ip){
                unset($arIp[$k]);
            }
        }

        static::write($arIp);

        return static::read();
    }

    public static function GetList(){
        return static::read();
    }

    protected static function read()
    {
        $file = @file_get_contents(static::$file);
        $file = preg_replace('/(\r|\n|\s)+/', "\n", $file);
        $arIp = explode("\n", $file);

        foreach ($arIp as $k => $ip){
            $ip = trim($ip);
            if(filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)){
                $arIp[$k] = $ip;
            }else{
                unset($arIp[$k]);
            }
        }

        return $arIp;
    }

    protected static function write($arIp){
        $arIp = array_filter(array_unique($arIp));
        file_put_contents(static::$file, implode("\n",$arIp));
    }
}
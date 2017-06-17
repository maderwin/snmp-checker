<?php

class GroupFieldEnum extends \Ducks\Component\SplTypes\SplEnum {
    const __default = self::Both;

    const IP = 'ip';
    const SSID = 'ssid';
    const Both = 'both';
}
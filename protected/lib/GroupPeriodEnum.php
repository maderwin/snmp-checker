<?php

class GroupPeriodEnum extends \Ducks\Component\SplTypes\SplEnum {
    const __default = self::Hour;

    const Hour = 'hour';
    const Weekday = 'weekday';
}
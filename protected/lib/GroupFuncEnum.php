<?php

class GroupFuncEnum extends \Ducks\Component\SplTypes\SplEnum {
    const __default = self::Avg;

    const Avg = 'avg';
    const Sum = 'sum';
}
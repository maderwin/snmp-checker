<?php

use Phinx\Seed\AbstractSeed;

class StatSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     */
    public function run()
    {
        $faker = Faker\Factory::create();


        $text = preg_replace(['/[^\w\s]/', '/\s+/', '/^\s+/', '/\s+$/'], [' ', ' ', '', ''], strtolower($faker->realText(3000)));
        $arWords = explode(' ', $text);
        $arWords = array_unique(array_filter($arWords, function ($str) {
            return strlen($str) > 4 && strlen($str) < 10;
        }));

        $arAP = [];

        for ($i = 0; $i < 10; $i++) {
            $arAP[] = [
                'ssid' => implode('', [
                    ucfirst($arWords[array_rand($arWords)]),
                    ucfirst($arWords[array_rand($arWords)])
                ]) . rand(100, 999),
                'ip' => $faker->ipv4
            ];
        }

        $arData = [];

        for($i = 0; $i < 10000; $i++){
            $ap = $arAP[array_rand($arAP)];
            $date = $faker->dateTimeThisMonth;
            $hour = $date->format('G');
            $arData[] = [
                'IP' => $ap['ip'],
                'DATE' => $date->format('Y-m-d H:i:s'),
                'SSID' => $ap['ssid'],
                'COUNT' =>
                    ($hour >= 9 && $hour <= 18)
                    ? $faker->biasedNumberBetween(1,100, function($x) {
                        return exp(-0.5 * $x * $x) / sqrt(2 * M_PI);
                    })
                    : $faker->biasedNumberBetween(1,10, function($x) {
                        return exp(-0.5 * $x * $x) / sqrt(2 * M_PI);
                    })

            ];
        }

        $table = $this->table('stat');

        $table->truncate();

        $table->insert($arData)->save();

    }
}

#!/bin/sh
# получаем текущее время и дату
D=`date +%y-%m-%d/%H:%M:%S`

# проходим по файлу с именем ip, где хранятся адреса
cat ./ip | while read myline
do
    # узнаем уникальные названия ssid для каждого ip
    ssid_name=`snmpwalk -c public -v1 $myline 1.3.6.1.4.1.171.11.37.4.4.5.2|grep SSID|cut -d " " -f4,5|uniq|awk '!x[$0]++'|sed 's/"//g'>name`

    # проходим по файлу name, где хранятся названия ssid
    cat ./name| while read line
    do
	# берем для каждого ip его ssid и подсчитываем кол-во для каждого ssid
        count=`snmpwalk -c public -v1 $myline 1.3.6.1.4.1.171.11.37.4.4.5.2|grep "$line" |wc -l`
	echo $myline, $D, $line, $count >> out
    done
done

# данные для входа в БД
user="ap-stat"
db="ap-stat"
pass="vUFemV7X4AKPSPm6"
lh="localhost"

# загружаем в БД данные, хранящиеся в вайле out
sql1="LOAD DATA LOCAL INFILE '/var/www/wifi/protected/fetch/out' replace  INTO TABLE Statistick fields terminated by ','"

# соединение с БД
mysql -h "$lh" -u"$user" -p"$pass" "$db" -e "$sql1" --local-infile

# удаляем файл out
rm ./out

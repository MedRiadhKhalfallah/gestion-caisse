<?php

class DATABASE_CONFIG {

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => true,
        'host' => 'localhost',
        'login' => 'root',
        'password' => '',
        'database' => 'amy_erp',
        'prefix' => '',
        'encoding' => 'utf8'
    );
//    public $default = array(
//        'datasource' => 'Database/Mysql',
//        'persistent' => true,
//        'host' => 'localhost',
//        'login' => 'amy',
//        'password' => 'amyrootmysql',
////        'login' => 'root',
////        'password' => '',
//        'database' => 'amy_erp',
//        'prefix' => '',
//        'encoding' => 'utf8'
//    );
    public $client = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'amy',
        'password' => 'amyrootmysql',
        'database' => 'cliens_erp',
        'prefix' => '',
        'encoding' => 'utf8'
    );

}

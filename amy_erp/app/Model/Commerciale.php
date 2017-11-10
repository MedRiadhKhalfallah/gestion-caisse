<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('User', 'Model');

/**
 * CakePHP Commerciale
 * @author famille
 */
class Commerciale extends User {

    public $virtualFields = array(
        'full_name' => 'CONCAT(Commercial.first_name, " ", Commercial.last_name)'
    );
    public $displayField = 'full_name';
    public $_schema = array(
        'id' => array(
            'type' => 'integer',
            'length' => 11
        ),
        'email' => array(
            'type' => 'string',
            'length' => 254
        ),
        'type_client' => array(
            'type' => 'string',
            'length' => 254
        ),
        'first_name' => array(
            'type' => 'string',
            'length' => 254
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 254
        ),
        'adress' => array(
            'type' => 'string',
            'length' => 254
        ),
        'postal' => array(
            'type' => 'string',
            'length' => 254
        ),
        'ville' => array(
            'type' => 'string',
            'length' => 254
        ),
        'raison_social' => array(
            'type' => 'string',
            'length' => 254
        ),
        'phone' => array(
            'type' => 'string',
            'length' => 254
        ),
        'user_count' => array(
            'type' => 'integer',
            'length' => 11
    ));
    public $hasMany = array(
        'User' => array(
            'className' => 'User',
            'foreignKey' => 'commerciale_id',
            'dependent' => false,
//            'conditions' => array(
//                'id' => 'User.commerciale_id',
//            ,
            'fields' => array('full_name', 'id', 'email', 'adress', 'phone', 'ville_id', 'raison_social'),
//            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => 'commerciale_id',
            'recursive' => 2,
            'dependent' => false,
        ),
        'Facture' => array(
            'className' => 'Facture',
            'foreignKey' => 'commerciale_id',
            'recursive' => 2,
            'dependent' => false,
        )
    );

}

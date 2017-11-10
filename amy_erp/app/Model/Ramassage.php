<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP Ramassage
 * @author famille
 */
class Ramassage extends AppModel {

    public $useTable = 'commandes';
    public $hasMany = array(
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => 'ramassage_id',
            'dependent' => false,
//            'fields' => array('id', 'ref', 'commerciale_id', 'created', 'modified', 'user_id', 'receiver_id'),
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Historique' => array(
            'className' => 'Historique',
            'foreignKey' => 'commande_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );
    public $belongsTo = array(
        'Commercial' => array(
            'className' => 'Commerciale',
            'foreignKey' => "commerciale_id",
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'counterCache' => true
        ),
        'Livreur' => array(
            'className' => 'Livreur',
            'foreignKey' => 'livreur_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'User' => array(
            'className' => 'User',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

}

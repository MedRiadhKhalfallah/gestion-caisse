<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP Entree
 * @author famille
 */
class Entree extends AppModel {

    public $useTable = 'commandes';
    public $hasMany = array(
        'Bon' => array(
            'className' => 'Bon',
            'foreignKey' => 'commande_id',
            'dependent' => true,
            'conditions' => '',
            'fields' => '',
            'order' => 'Bon.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );
    public $hasOne = array(
        'Sortie' => array(
            'className' => 'Commande',
            'foreignKey' => 'sortie_id'
        )
    );

}
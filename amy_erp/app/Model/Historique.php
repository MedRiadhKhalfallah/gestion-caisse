<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP Historique
 * @author famille
 */
class Historique extends AppModel {

    public $belongsTo = array(
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => "commande_id",
            'fields' => '',
            'counterCache' => true
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

<?php

App::uses('AppModel', 'Model');
App::uses('Commande', 'Model');
App::uses('PrimesUser', 'Model');

/**
 * Prime Model
 *
 */
class Prime extends AppModel {

    /**
     * Display field
     *
     * @var string
     */
    public $displayField = 'name';
    /**
     * hasMany associations
     *
     * @var array
     */
    public $hasMany = array(
        'PrimesUser' => array(
            'className' => 'PrimesUser',
            'foreignKey' => 'prime_id',
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

}

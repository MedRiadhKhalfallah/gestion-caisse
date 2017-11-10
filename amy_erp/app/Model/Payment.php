<?php

App::uses('AppModel', 'Model');

/**
 * Payment Model
 *
 */
class Payment extends AppModel {

    public $hasAndBelongsToMany = array(
        'User' => array(
            'className' => 'User',
            'joinTable' => 'payments_users',
            'foreignKey' => 'payment_id',
            'associationForeignKey' => 'user_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
            'counterCache' => true
        )
    );

}

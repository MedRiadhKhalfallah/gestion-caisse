<?php

App::uses('AppModel', 'Model');

/**
 * PrimesUser Model
 *
 * @property User $User
 * @property Prime $Prime
 */
class PrimesUser extends AppModel {
    /**
     * Validation rules
     *
     * @var array
     */
    // The Associations below have been created with all possible keys, those that are not needed can be removed

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'User' => array(
            'className' => 'User',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Prime' => array(
            'className' => 'Prime',
            'foreignKey' => 'prime_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

}

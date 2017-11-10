<?php

App::uses('AppModel', 'Model');

/**
 * Presence Model
 *
 * @property User $User
 */
class Presence extends AppModel {

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
        )
    );
 
}

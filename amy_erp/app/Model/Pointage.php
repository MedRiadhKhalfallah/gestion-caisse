<?php

App::uses('AppModel', 'Model');

/**
 * Pointage Model
 *
 * @property User $User
 */
class Pointage extends AppModel {

    public $useTable = 'pointages';

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
    public $hasMany = array(
        'SortiesPointage' => array(
            'className' => 'SortiesPointage',
            'foreignKey' => 'pointage_id',
            'conditions' => '',
            'fields' => '',
            'order' => 'SortiesPointage.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
    );

}

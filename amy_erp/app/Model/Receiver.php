<?php

App::uses('AppModel', 'Model');
App::uses('AuthComponent', 'Controller/Component');

/**
 * Receiver Model
 *
 * @property Region $Region
 * @property Role $Role
 * @property Devi $Devi
 * @property Profile $Profile
 */
class Receiver extends AppModel {

    public $useTable = "receivers";
    public $virtualFields = array(
        'full_name' => 'CONCAT(Receiver.name, " ", Receiver.last_name)',
    );
    public $displayField = 'full_name';
    public $belongsTo = array(
        'Ville' => array(
            'className' => 'Ville',
            'foreignKey' => 'ville_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Delegation' => array(
            'className' => 'Delegation',
            'foreignKey' => 'delegation_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Localite' => array(
            'className' => 'Localite',
            'foreignKey' => 'localite_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );

}

<?php

App::uses('AppModel', 'Model');

/**
 * CakePHP Compte
 * @author hedi
 */
class Compte extends AppModel {

    public $virtualFields = array('compte' => 'CONCAT(Compte.code ," - ", Compte.name)');
    //The Associations below have been created with all possible keys, those that are not needed can be removed
    public $displayField = "compte";
    public $hasMany = array(
        'Ecriture' => array(
            'className' => 'Ecriture',
            'foreignKey' => 'compte_id',
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

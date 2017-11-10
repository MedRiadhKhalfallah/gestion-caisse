<?php

App::uses('AppModel', 'Model');

/**
 * Facture Model
 *
 */
class Ecriture extends AppModel {

    public $belongsTo = array(
        'Compte' => array(
            'className' => 'Compte',
            'foreignKey' => 'compte_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
    

}

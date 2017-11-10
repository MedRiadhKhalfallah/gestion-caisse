<?php

App::uses('AppModel', 'Model');

/**
 * Fournisseur Model
 *
 */
class Fournisseur extends AppModel {

    public $validate = array(
        'name' => array(
            'notBlank' => array(
                'rule' => array('notBlank'),
                'message' => "Name Invalid",
            )
        ),
        'phone' => array(
            'notBlank' => array(
                'rule' => array('notBlank'),
                'message' => "Phone Invalid"
            )
        ),
        'email' => array(
            'notBlank' => array(
                'rule' => array('notBlank'),
                'message' => "Email Invalid"
            )
        )
    );
    public $belongsTo = array(
        'Compte',
    );
    public $hasMany = array(
        'Vente' => array(
            'className' => 'Vente',
            'foreignKey' => 'fournisseur_id',
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

<?php

App::uses('AppModel', 'Model');

/**
 * Commande Model
 *
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 * @property User $User
 */
class Devi extends AppModel {

    public $useTable = "commandes";

    /**
     * Validation rules
     *
     * @var array
     */
    public $hasMany = array(
        'Bon' => array(
            'className' => 'Bon',
            'foreignKey' => 'commande_id',
            'dependent' => true,
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );

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

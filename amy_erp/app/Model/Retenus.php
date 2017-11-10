<?php

App::uses('AppModel', 'Model');

/**
 * Retenus Model
 *
 * @property Facture $Facture
 * @property Fournisseur $Fournisseur
 */
class Retenus extends AppModel {

    /**
     * Use table
     *
     * @var mixed False or table name
     */
    public $useTable = 'retenus';

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
        'Fournisseur' => array(
            'className' => 'Fournisseur',
            'foreignKey' => 'fournisseur_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
    public $hasMany = array(
        'Facture' => array(
            'className' => 'Facture',
            'foreignKey' => 'retenu_id',
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

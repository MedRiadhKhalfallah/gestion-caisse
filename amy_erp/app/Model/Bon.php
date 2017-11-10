<?php

App::uses('AppModel', 'Model');

/**
 * Bon Model
 *
 * @property Commande $Commande
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 */
class Bon extends AppModel {

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
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => 'commande_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Product' => array(
            'className' => 'Product',
            'foreignKey' => 'product_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Fournisseur' => array(
            'className' => 'Fournisseur',
            'foreignKey' => 'fournisseur_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

}

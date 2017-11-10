<?php

App::uses('AppModel', 'Model');

/**
 * Bon Model
 *
 * @property Commande $Commande
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 */
class Notification extends AppModel {
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
        'Product' => array(
            'className' => 'Product',
            'foreignKey' => 'product_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

}

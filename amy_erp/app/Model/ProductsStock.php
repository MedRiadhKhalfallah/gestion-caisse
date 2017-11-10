<?php

App::uses('AppModel', 'Model');

/**
 * ProductsStock Model
 *
 * @property Allergy $Allergy
 * @property Patient $Patient
 */
class ProductsStock extends AppModel {

    public $name = "ProductsStock";
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
            'order' => '',
            'counterCache' => true
        ),
        'Emplacement' => array(
            'className' => 'Emplacement',
            'foreignKey' => 'emplacement_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Sousemplacement' => array(
            'className' => 'Sousemplacement',
            'foreignKey' => 'sousemplacement_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Indication' => array(
            'className' => 'Indication',
            'foreignKey' => 'indication_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Stock' => array(
            'className' => 'Stock',
            'foreignKey' => 'stock_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );

}

<?php

App::uses('AppModel', 'Model');

/**
 * Facture Model
 *
 */
class Facture extends AppModel {

    public $belongsTo = array(
        'Payment' => array(
            'className' => 'Payment',
            'foreignKey' => 'payment_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Retenus' => array(
            'className' => 'Retenus',
            'foreignKey' => 'retenu_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Cp' => array(
            'className' => 'Cp',
            'foreignKey' => 'cp_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Devise' => array(
            'className' => 'Devise',
            'foreignKey' => 'devise_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Tva' => array(
            'className' => 'Tva',
            'foreignKey' => 'tva_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Type' => array(
            'className' => 'Type',
            'foreignKey' => 'type_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Compte' => array(
            'className' => 'Compte',
            'foreignKey' => 'compte_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Fournisseur' => array(
            'className' => 'Fournisseur',
            'foreignKey' => 'fournisseur_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
        ),
        'Commercial' => array(
            'className' => 'Commerciale',
            'foreignKey' => "commerciale_id",
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone', 'email'),
            'counterCache' => true
        ),
        'Livreur' => array(
            'className' => 'Livreur',
            'foreignKey' => "livreur_id",
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone', 'email'),
            'counterCache' => true
        ),
        'User' => array(
            'className' => 'User',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
    public $hasAndBelongsToMany = array(
        'Product' => array(
            'className' => 'Product',
            'joinTable' => 'factures_products',
            'foreignKey' => 'facture_id',
            'associationForeignKey' => 'product_id',
//            'unique' => true,
            'conditions' => array('product_id <>' => 0),
            'fields' => '',
            'order' => 'FacturesProduct.id ASC',
//            'limit' => '',
//            'offset' => '',
//            'finderQuery' => '',
//            'with' => ''
        ),
        'Colis' => array(
            'className' => 'Product',
            'joinTable' => 'factures_products',
            'foreignKey' => 'facture_id',
            'associationForeignKey' => 'product_id',
//            'unique' => true,
            'conditions' => array('product_id' => 0),
            'fields' => '',
            'order' => 'FacturesProduct.id ASC',
//            'limit' => '',
//            'offset' => '',
//            'finderQuery' => '',
//            'with' => ''
        )
    );
    public $hasMany = array(
        'Reglement' => array(
            'className' => 'Reglement',
            'foreignKey' => 'facture_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => 'facture_id',
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
    public $hasOne = array(
        'Avoir' => array(
            'className' => 'Avoir',
            'foreignKey' => 'facture_id'
        )
    );

}

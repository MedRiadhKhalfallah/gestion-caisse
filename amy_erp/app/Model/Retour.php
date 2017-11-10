<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP Retour
 * @author famille
 */
class Retour extends AppModel {

    public $useTable = 'commandes';
    public $displayField = 'ref';
    public $hasMany = array(
        'Bon' => array(
            'className' => 'Bon',
            'foreignKey' => 'commande_id',
            'dependent' => true,
            'conditions' => '',
            'fields' => '',
            'order' => 'Bon.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Reglement' => array(
            'className' => 'Reglement',
            'foreignKey' => 'commande_id',
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
        'Historique' => array(
            'className' => 'Historique',
            'foreignKey' => 'commande_id',
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
        'Facture' => array(
            'className' => 'Facture',
            'foreignKey' => 'commande_id'
        ),
        'Commande' => array(
            'className' => 'Commande',
            'foreignKey' => 'commande_id'
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
        ),
        'Getby' => array(
            'className' => 'Commerciale',
            'foreignKey' => 'com_id',
            'conditions' => '',
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'order' => ''
        ),
        'Livreur' => array(
            'className' => 'Livreur',
            'foreignKey' => 'livreur_id',
            'conditions' => '',
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone', 'full_name'),
            'order' => ''
        ),
        'Receiver' => array(
            'className' => 'Receiver',
            'foreignKey' => 'receiver_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
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
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'counterCache' => true
        ),
        'Tva' => array(
            'className' => 'Tva',
            'foreignKey' => 'tva_id',
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
        )
    );

}

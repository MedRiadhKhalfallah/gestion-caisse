<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');

/**
 * CakePHP FacturesCommande
 * @author famille
 */
class FacturesCommande extends AppModel {

    public $useTable = 'factures';
    public $hasMany = array(
        'Facture' => array(
            'className' => 'Facture',
            'foreignKey' => 'comm_id',
            'dependent' => false,
//            'fields' => array('id', 'ref', 'commerciale_id', 'created', 'modified', 'user_id', 'receiver_id'),
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );
    public $belongsTo = array(
        'Commercial' => array(
            'className' => 'Commerciale',
            'foreignKey' => "commerciale_id",
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'counterCache' => true
        ),
        'User' => array(
            'className' => 'User',
            'foreignKey' => "user_id",
//            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'fields' => '',
            'counterCache' => true
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
    );
    public $hasAndBelongsToMany = array(
        'Product' => array(
            'className' => 'Product',
            'joinTable' => 'factures_products',
            'foreignKey' => 'facture_id',
            'associationForeignKey' => 'product_id',
//            'unique' => true,
            'conditions' => '',
            'fields' => '',
            'order' => 'FacturesProduct.id ASC',
//            'limit' => '',
//            'offset' => '',
//            'finderQuery' => '',
//            'with' => ''
    ));

//    public function afterFind($results, $primary = false) {
//        parent::afterFind($results, $primary);
//        foreach ($results as $k => $result):
//            $totalLivree = 0;
//            $facture = new Facture();
//            $facture->recursive = -1;
//            if (!empty($result['User']['id'])) {
//                $facturesTransport = $facture->find('all', array(
//                    'conditions' => array('Facture.isTransport' => true)
//                ));
//                if (!empty($facturesTransport)) {
//                    foreach ($facturesTransport as $index => $cmd):
//                        //case Wait
//                        foreach ($cmd . Facture as $fc):
////                            $qte = v.Colis.l;
////                                $totalFrais = parseFloat(v.frais_livraison) * qte;
////                                $mantant = parseFloat(v.frais_livraison).toFixed(3);
////                                $totalHT = parseFloat(v.frais_livraison) * qte;
////                            $totalLivree += 
//
//                        endforeach;
//                    endforeach;
//                    $result['Facture']['totalLivree'] = $totalLivree;
//                    $results[$k] = $result;
//                } else {
//                    $result['Facture']['totalLivree'] = 0;
//                    $results[$k] = $result;
//                }
//            }
//        endforeach;
//        return $results;
//    }

}

<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP BonsController
 * @author hedi
 */
class BonsController extends AppController {

    public $uses = array('Bon', 'Commande', 'Stock', 'User', 'Facture', 'FactureProduct');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('send_avoir_by_product');
    }

    public function send_avoir_by_product() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            $this->Bon->id = $data['Bon']['id'];
            $avoir = false; 
            if ($data['Bon']['avoir'] === 'true') { 
                $avoir = true;
            }
            $this->Facture->recursive = -1;
            $ifFactureExist = $this->Facture->find('first', array(
                'conditions' => array('Facture.commande_id' => $data['Bon']['commande_id'])
            ));
            $factureUpdated = 'none';
            $facture_product = array();
            if (!empty($ifFactureExist)) {
                $facture_product = $this->FactureProduct->find('first', array(
                    'conditions' => array(
                        'FactureProduct.facture_id' => $ifFactureExist['Facture']['id'],
                        'FactureProduct.product_id' => $this->Bon->read('product_id')['Bon']['product_id'],
                    )
                ));
                if (!empty($facture_product)) {
                    $this->FactureProduct->id = $facture_product['FactureProduct']['id'];
                    $this->FactureProduct->saveField('avoir', $avoir);
                    $this->FactureProduct->saveField('qte_avoir', $data['Bon']['qte_avoir']);
                    $factureUpdated = "true";
                }
            }
            if ($this->Bon->saveField('avoir', $avoir)) {
                $this->Bon->saveField('qte_avoir', $data['Bon']['qte_avoir']);
                $this->Commande->contain('Bon');
                $this->Commande->id = $data['Bon']['commande_id'];
                $countProductAvoir = 0;
                foreach ($this->Commande->read()['Bon'] as $bons):
//                    debug($bons['avoir']);
                    if ($bons['avoir'] == true) {
                        $countProductAvoir = $countProductAvoir + 1;
                    }
                endforeach;
//                debug($countProductAvoir);
                if ($countProductAvoir > 0) {
                    $this->Commande->id = $data['Bon']['commande_id'];
                    if ($this->Commande->saveField('countProductAvoir', $countProductAvoir)) {
                        
                    }
                }
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __("Ligne de bon mise à jour avec succès"),
                    'ifFacture' => $factureUpdated,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            }
        }
//        header('HTTP/1.0 403 Forbidden');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'success'
//        ));
//        die();
    }

//    public function admin_update_avoir($id = null) {
//        $this->Facture->recursive = -1;
//        $this->Facture->id = $id;
//        $facture = $this->Facture->read(array('old_ref', 'user_id'));
//        $oldFacture = $this->Facture->find('first', array(
//            'conditions' => array('Facture.old_ref' => $facture['Facture']['old_ref'], 'Facture.user_id' => $facture['Facture']['user_id'])
//        ));
//        $this->Commande->contain('Bon');
//        $commande = $this->Commande->find('first', array(
//            'conditions' => array('Commande.id' => $oldFacture['Facture']['commande_id'])
//        ));
//        $bon_avoir = array();
//        foreach ($commande['Bon'] as $bon):
//            if ($bon['avoir'] == true) {
//                array_push($bon_avoir, $bon);
//            }
//        endforeach;
//        $factures_products = $this->FactureProduct->find('all', array(
//            'conditions' => array('FactureProduct.facture_id' => $id)
//        ));
//        foreach ($factures_products as $fp):
//            $this->FactureProduct->id = $fp['FactureProduct']['id'];
//            $this->FactureProduct->delete();
//        endforeach;
////        die();
////        if()
//        foreach ($bon_avoir as $bonAvoir):
//            $this->FactureProduct->create();
//            $newFacturesProduct = array(
//                'FactureProduct' => array(
//                    'id' => null,
//                    'facture_id' => $id,
//                    'product_id' => $bonAvoir['product_id'],
//                    'qte' => $bonAvoir['qte'],
//                    'qte_avoir' => $bonAvoir['qte_avoir'],
//                    'tx_ch' => 0,
//                    'remise' => $bonAvoir['remise'],
//                    'tva_id' => 1,
//                    'last_unit_price' => $bonAvoir['last_unit_price'],
//                    'avoir' => true,
//                    'pu_euro' => 0,
//                    'avoir' => 0
//                )
//            );
////                    $fp['FacturesProduct']['id'] = null;
////                    $fp['FacturesProduct']['facture_id'] = $lastInsertID;
//            $this->FactureProduct->save($newFacturesProduct);
//        endforeach;
//        $this->Flash->set(__("MAJ Facture d'avoir effectuée avec succès"), array(
//            'element' => 'notif',
//        ));
//        $this->redirect(array('controller' => 'factures', 'action' => 'view_avoir', 'admin' => true, $id));
//    }
}

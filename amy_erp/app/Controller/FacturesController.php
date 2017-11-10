<?php

App::uses('AppController', 'Controller');

/**
 * Factures Controller
 *
 * @property Facture $Facture
 * @property PaginatorComponent $Paginator
 */
class FacturesController extends AppController {

    public $uses = array('Avoir', 'Historique', 'FacturesCommande', 'Notification', 'User', 'Ville', 'Stock', 'Configuration', 'Product', 'Facture', 'Commande', 'Fournisseur', 'FactureProduct', 'Facture', 'FactureProduct', 'Payment', 'Reglement', 'Commercial', 'Retenus', 'Bon', 'Retour');
    public $Qtepass = false;

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('avoir_by_product', 'generer_avoir', 'facturer_annulee', 'commandes_user', 'view_facturescommande', 'commandes_finalisee_user', 'generer_facturer_grouped', 'test_com', 'index', 'index_avoir', 'add', 'delete', 'view', 'index_achat', 'add_achat', 'index_user', 'index_fournisseur', 'achats_fournisseur', 'show_reglement_fournisseur', 'add_reglement_fournisseur', 'index_commerciale', 'declaration_fiscale', 'reglement_grouped', 'etat_facture_vente', 'avoir');
    }

    public function test_com($id = null) {
        $this->factureTotal($id);
        die();
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $factures = $this->Facture->find('all', array(
                'conditions' => array('Facture.avoir' => 0, 'Facture.isCommande' => 0, 'Facture.type_id' => $this->factureTypeID('vente')),
                'order' => array('Facture.created DESC')
            ));
            http_response_code(200);
            echo json_encode($factures);
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

    // list factures avoir
    function index_avoir() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Avoir->contain('User', 'Facture', 'Commande');
            $facturesavoir = $this->Avoir->find('all', array(
                'conditions' => array('Avoir.avoir' => 1, 'Avoir.type_id' => $this->factureTypeID('vente'), 'Avoir.isCommande' => 0),
                'order' => array('Avoir.created DESC')
            ));
            http_response_code(200);
            echo json_encode($facturesavoir);
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

    // list facture for custom user 
    public function index_user() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $factures = $this->Facture->find('all', array(
                'conditions' => array(
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.user_id' => $data['Facture']['user_id'],
                    'Facture.isCommande' => 0
                ),
                'order' => array('Facture.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($factures);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    // list facture for custom fournisseur 
    public function index_fournisseur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $factures = $this->Facture->find('all', array(
                'conditions' => array(
                    'Facture.type_id' => $this->factureTypeID('achat'),
                    'Facture.fournisseur_id' => $data['Facture']['fournisseur_id']
                ),
                'order' => array('Facture.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($factures);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function achats_fournisseur() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $facturesfournisseur = $this->Facture->find('all', array(
                'conditions' => array('Facture.avoir' => 0, 'Facture.type_id' => $this->factureTypeID('achat')),
                'order' => array('Facture.created DESC')
            ));
            http_response_code(200);
            echo json_encode($facturesfournisseur);
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

    public function commandes_user() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandesfinalisee = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => array('Transport'), 'Commande.user_id' => $this->request->data['Commande']['user_id'], 'Commande.state IN' => array('Finalisée', 'Livrée')),
                'order' => array('Commande.created DESC')
            ));
            $commandesannulee = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => array('Transport'), 'Commande.user_id' => $this->request->data['Commande']['user_id'], 'Commande.state' => 'Annulée'),
                'order' => array('Commande.created DESC')
            ));
//            debug($commandesfinalisee);die();
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesfinalisee,
                'annulee' => $commandesannulee,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function commandes_finalisee_user() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandesfinalisee = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => array('Transport'), 'Commande.state IN' => array('Finalisée', 'Livrée', 'Annulée')),
                'order' => array('Commande.created DESC')
            ));
//            debug($commandesfinalisee);die();
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesfinalisee,
                'status' => 200,
                'type' => 'error'
            ));
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

// generer factures groupe bl
    public function generer_facturer_grouped() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Chargement')
            ));
//            $this->request->data['Chargement']['ref'] = "BCH-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
//            $this->request->data['FacturesCommande']['ref'] = "CEX " . date('Y') . " / " . ($count + 1);
//            $this->request->data['FacturesCommande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
//            $this->request->data['FacturesCommande']['avoir'] = 0;
            $date = date('Y');
            $countFacture = $this->Facture->find('count', array(
                'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'), 'Facture.isCommande' => 0, 'YEAR(Facture.created)' => $date)
            ));
            $newCF = 'CF-' . date('y') . date('m') . date('d') . "-" . ($countFacture + 1);
            $facture = array(
                'FacturesCommande' => array(
                    'id' => null,
                    'code_facture' => $newCF,
                    'avoir' => 0,
                    'limit_date' => null,
                    'payment_id' => 0,
                    'commande_id' => 0,
                    'commerciale_id' => 0,
                    'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                    'acompte' => 0,
                    'remise_globale' => 0,
                    'type_id' => $this->factureTypeID('vente'),
                    'tva_id' => 3,
                    'isCommande' => 0,
                    'isTransport' => 1,
                    'is_client' => true,
                    'user_id' => $this->request->data['Facture']['user_id'],
                    'ajustement' => $this->request->data['Facture']['ajustement'],
                    'isContreRembourcement' => 0,
                    'mantant' => 0
                )
            );
//            debug($this->FacturesCommande->getLastInsertID());
//            debug($facture);
//            die();
            if ($this->FacturesCommande->save($facture)) {
                $lastInsertIdFacture = $this->FacturesCommande->getLastInsertID();
//                debug($lastInsertIdCommand);
//                die();
                foreach ($this->request->data['Commande'] as $commande):
                    $this->Commande->id = $commande['id'];
                    $commandeuser = $this->Commande->read();
                    $stateCommande = $commandeuser['Commande']['state'];
                    if ($stateCommande == 'Annulée') {
                        $this->Commande->saveField('state', 'Retour Expéditeur');
                    } else {
                        $this->Commande->saveField('state', 'Facturée');
                    }
                    $this->Commande->saveField('isStock', 0);
                    $historique = array(
                        'Historique' => array(
                            'id' => null,
                            'commande_id' => $commande['id'],
                            'user_id' => $commandeuser['Commande']['livreur_id'],
                            'operation' => 'Facturée',
                            'cause_operation' => NULL
                        )
                    );
                    $this->Historique->save($historique);
                    $facturegrouped = array(
                        'Facture' => array(
                            'id' => null,
                            'code_facture' => $commandeuser['Commande']['ref'],
                            'avoir' => 0,
                            'limit_date' => null,
                            'payment_id' => 0,
                            'comm_id' => $lastInsertIdFacture,
                            'commande_id' => $commande['id'],
                            'commerciale_id' => $commandeuser['Commande']['commerciale_id'],
                            'livreur_id' => $commandeuser['Commande']['livreur_id'],
                            'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                            'acompte' => 0,
                            'remise_globale' => 0,
                            'type_id' => 0,
                            'tva_id' => 0,
                            'state' => $commandeuser['Commande']['state'],
                            'frais_livraison' => $commandeuser['User']['frais_livraison'],
                            'frais_annulation' => $commandeuser['User']['frais_annulation'],
                            'state' => $commandeuser['Commande']['state'],
                            'isCommande' => 1,
                            'is_client' => true,
                            'user_id' => $this->request->data['Facture']['user_id'],
                            'isContreRembourcement' => $commandeuser['Commande']['isContreRembourcement'],
                            'mantant' => $commandeuser['Commande']['mantant']
                        )
                    );
                    if ($this->Facture->save($facturegrouped)) {
                        $FactureLastInsertID = $this->Facture->getLastInsertID();
                        foreach ($commandeuser['Bon'] as $bon):
                            $data = array(
                                'FactureProduct' => array(
                                    'id' => null,
                                    'facture_id' => $FactureLastInsertID,
                                    'product_id' => $bon['product_id'],
                                    'qte' => $bon['qte'],
                                    'remise' => $bon['remise'],
                                    'last_unit_price' => $bon['last_unit_price'],
                                    'content' => $bon['content'],
                                    'longueur' => $bon['longueur'],
                                    'largeur' => $bon['largeur'],
                                    'hauteur' => $bon['hauteur'],
                                    'poid' => $bon['poid']
                                )
                            );
                            $this->FactureProduct->save($data);
                        endforeach;
                    }
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // facturer commande annulée 
    public function facturer_annulee() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
//            debug($data['Commande']['id']);
//            die();
            if ($this->Commande->saveField('isFacture', false) && $this->Commande->saveField('isAnnule', false)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande facturée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// avoir par article

    public function avoir_by_product() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $date = date('Y');
            $data = $this->request->data;
            $this->Facture->id = $data['Facture']['id'];
            $facture = $this->Facture->read();
            $facture = $this->Facture->read();
            $this->Commande->id = $facture['Commande'][0]['id'];
            $this->Commande->contain('Bon');
            $commande = $this->Commande->read();
            if (!empty($commande)) {
                $countRetour = $this->Commande->find('count', array(
                    'conditions' => array('Commande.type' => 'Retour', 'YEAR(Commande.created)' => $date)
                ));
                $retour = array(
                    'id' => null,
                    'ref' => "RT-" . date('d') . date('m') . date('y') . "-" . ($countRetour + 1),
                    'type' => 'Retour',
                    'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                    'commande_id' => $commande['Commande']['id'],
                    'user_id' => $commande['Commande']['user_id'],
                    'commerciale_id' => $commande['Commande']['commerciale_id'],
                    'facture_id' => $commande['Commande']['facture_id'],
                    'receiver_id' => $commande['Commande']['receiver_id'],
                    'fournisseur_id' => $commande['Commande']['fournisseur_id'],
                    'livreur_id' => $commande['Commande']['livreur_id'],
                    'com_id' => $commande['Commande']['com_id'],
                    'state' => $commande['Commande']['state'],
                    'avoir' => TRUE,
                    'isRetour' => TRUE
                );
                if ($this->Retour->save($retour)) {
                    $lastRetour_id = $this->Retour->getLastInsertID();
//                    debug($lastRetour_id);
                    $commande_id = $lastRetour_id;
                    $this->Commande->saveField('commande_id', $lastRetour_id);
                    foreach ($data['FactureProduct'] as $product):
//                        debug($lastRetour_id);
                        $this->FactureProduct->recursive == -1;
                        $this->FactureProduct->id = $product['id'];
                        $facture_product = $this->FactureProduct->read();
                        $bon = $this->Bon->find('first', array(
                            'conditions' => array('Bon.commande_id' => $commande['Commande']['id'], 'Bon.product_id' => $facture_product['FactureProduct']['product_id'])
                        ));
                        $this->Bon->id = $bon['Bon']['id'];
                        $this->Bon->saveField('avoir', TRUE);
                        $this->Bon->saveField('qte_avoir', $product['qte_avoir']);
//                        $bon['id'] = null;
//                        debug($commande_id);
//                        $bon['commande_id'] = $lastRetour_id;
//                        $bon['qte_avoir'] = $product['qte_avoir'];
                        $bonRetour = array(
                            'id' => null,
                            'content' => $bon['Bon']['content'],
                            'product_id' => $bon['Bon']['product_id'],
                            'fournisseur_id' => $bon['Bon']['fournisseur_id'],
                            'qte_avoir' => $product['qte_avoir'],
                            'qte_recue' => $bon['Bon']['qte_recue'],
                            'remise' => $bon['Bon']['remise'],
                            'last_unit_price' => $bon['Bon']['last_unit_price'],
                            'longueur' => $bon['Bon']['longueur'],
                            'largeur' => $bon['Bon']['largeur'],
                            'hauteur' => $bon['Bon']['hauteur'],
                            'poid' => $bon['Bon']['poid'],
                            'commande_id' => $commande_id,
                            'qte' => $bon['Bon']['qte'],
                            'avoir' => TRUE,
                        );
                        $this->Bon->save($bonRetour);
                    endforeach;
                }
            }
//            debug($facture);
//            debug($commande);
//            $this->Bon->id = $data['Bon']['id'];

            $countAvoir = $this->Avoir->find('count', array(
                'conditions' => array('Avoir.avoir' => TRUE, 'YEAR(Avoir.created)' => $date)
            ));
            $avoir = array(
                'id' => null,
                'user_id' => $facture['Facture']['user_id'],
                'object' => $facture['Facture']['object'],
                'validate' => $facture['Facture']['validate'],
                'pourcentage' => $facture['Facture']['pourcentage'],
                'payment_id' => $facture['Facture']['payment_id'],
                'facture_id' => $data['Facture']['id'],
                'commerciale_id' => $facture['Facture']['commerciale_id'],
                'retenu_id' => $facture['Facture']['retenu_id'],
                'commande_id' => $facture['Facture']['commande_id'],
                'acompte' => $facture['Facture']['acompte'],
                'code_facture' => "FA-" . date('y') . date('m') . date('d') . "-" . ($countAvoir + 1),
                'avoir' => TRUE,
                'type_id' => $facture['Facture']['type_id'],
                'last_timbre_price' => $facture['Facture']['last_timbre_price'],
            );
            if ($this->Avoir->save($avoir)) {
                $lastFacture_id = $this->Avoir->getLastInsertID();
                $this->Facture->id = $data['Facture']['id'];
                $this->Facture->saveField('facture_id', $lastFacture_id);
                foreach ($data['FactureProduct'] as $product):
                    $this->FactureProduct->recursive == -1;
                    $this->FactureProduct->id = $product['id'];
                    $this->FactureProduct->saveField('avoir', TRUE);
                    $this->FactureProduct->saveField('qte_avoir', $product['qte_avoir']);
                    $facture_product = $this->FactureProduct->read()['FactureProduct'];
                    $facture_product['id'] = NULL;
                    $facture_product['facture_id'] = $lastFacture_id;
                    $facture_product['qte_avoir'] = $product['qte_avoir'];
                    $facture_product['avoir'] = TRUE;
                    $this->FactureProduct->save($facture_product);
                endforeach;
            }
            $text = __("Facture d'avoir générer avec avec succès");
            if (!empty($commande)) {
                $text = __("Facture d'avoir avec bon retour générer avec avec succès");
            }
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'text' => $text,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

//declaration fiscale 
    public function declaration_fiscale() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {

            $this->Facture->contain('Product', 'Product.FacturesProduct', 'Product.Bon', 'User', 'User.Ville');
            $request = $this->request->data;
//            debug($request);die();
            $first_date = $request['Facture']['first_date'];
            $last_date = $request['Facture']['last_date'];
            $first_date = $first_date . " 00:00:00";
            $last_date = $last_date . " 23:59:59";
            $facturesfournisseur = $this->Facture->find('all', array(
                'conditions' => array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
//                    'Facture.avoir' => 0,
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.isCommande' => 0
                ),
                'order' => array('Facture.created DESC')
            ));
            $facturesavoir = $this->Facture->find('all', array(
                'conditions' => array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.avoir' => 1,
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.isCommande' => 0
                ),
                'order' => array('Facture.created DESC')
            ));
            $count = $this->Facture->find('count', array(
                'conditions' => array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.avoir' => 0,
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.isCommande' => 0
                )
            ));
            $count_avoir = $this->Facture->find('count', array(
                'conditions' => array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.avoir' => 1,
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.isCommande' => 0
                )
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $facturesfournisseur,
                'facturesavoir' => $facturesavoir,
                'count' => $count,
                'count_avoir' => $count_avoir,
            ));
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

// facture en avoir
    public function avoir() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $data = $this->request->data;
//        debug($data);
//        die();
        if ($this->request->is(array('put'))) {
            if (!empty($this->request->data['Facture']['id'])) {
                if ($this->request->data['Facture']['avoir'] == 'true') {
                    $this->Facture->id = $data['Facture']['id'];
                    $facture = $this->Facture->read();
                    $this->Facture->saveField('avoir', true);
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Votre Facture est passé en avoir avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                } else {
                    $this->Facture->id = $data['Facture']['id'];
                    $facture = $this->Facture->read();
                    $this->Facture->saveField('avoir', FALSE);
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Annulation Pour Avoir Facture"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            } else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("Facture n'existe pas"),
                    'status' => 404,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    public function generer_avoir() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            if (!empty($this->request->data['Facture']['id'])) {
                $data = $this->request->data;
//                debug($data);
                $id = $this->request->data['Facture']['id'];
                $this->Facture->id = $id;
                $facture = $this->Facture->read();
                $this->Commande->id = $facture['Commande'][0]['id'];
                $this->Commande->contain('Bon');
                $commande = $this->Commande->read();
                if (!empty($commande)) {
                    $this->Commande->saveField('avoir', TRUE);
                    $commande['id'] = NULL;
                    $commande['avoir'] = TRUE;
                    $commande['isRetour'] = TRUE;
                    if ($this->Retour->save($commande)) {
                        $lastRetour_id = $this->Retour->getLastInsertID();
                        $this->Retour->id = $lastRetour_id;
                        $this->Retour->saveField('commande_id', $commande['Commande']['id']);
                        foreach ($commande['Bon'] as $bon):
                            $bon['id'] = NULL;
                            $bon['commande_id'] = $lastRetour_id;
                            $this->Bon->save($bon);
                        endforeach;
                    }
                }
                $this->Facture->saveField('avoir', 1);
//                debug($facture['Product']);
//                die();
                $date = date('Y');
                $count = $this->Facture->find('count', array(
                    'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'), 'YEAR(Facture.created)' => $date)
                ));
                $this->request->data['Avoir']['user_id'] = $facture['Facture']['user_id'];
                $this->request->data['Avoir']['object'] = $facture['Facture']['object'];
                $this->request->data['Avoir']['validate'] = $facture['Facture']['validate'];
                $this->request->data['Avoir']['pourcentage'] = $facture['Facture']['pourcentage'];
                $this->request->data['Avoir']['payment_id'] = $facture['Facture']['payment_id'];
                $this->request->data['Avoir']['commerciale_id'] = $facture['Facture']['commerciale_id'];
                $this->request->data['Avoir']['retenu_id'] = $facture['Facture']['retenu_id'];
                $this->request->data['Avoir']['commande_id'] = $facture['Facture']['commande_id'];
                $this->request->data['Avoir']['acompte'] = $facture['Facture']['acompte'];
                $this->request->data['Avoir']['code_facture'] = "FA-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
                $this->request->data['Avoir']['avoir'] = 1;
                $this->request->data['Avoir']['facture_id'] = $id;
                $this->request->data['Avoir']['type_id'] = $this->factureTypeID('vente');
                $this->request->data['Avoir']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
//                debug($this->request->data['Avoir']);
//                die();
                if ($this->Avoir->save($this->request->data)) {
                    $last_id = $this->Avoir->getLastInsertID();
                    $this->Facture->id = $id;
                    $this->Facture->saveField('facture_id', $last_id);
                    foreach ($facture['Product'] as $product):
                        $product_facture = array(
                            'FactureProduct' => array(
                                'id' => NULL,
                                'facture_id' => $last_id,
                                'product_id' => $product['FacturesProduct']['product_id'],
                                'last_unit_price' => $product['FacturesProduct']['last_unit_price'],
                                'qte' => $product['FacturesProduct']['qte'],
                                'remise' => $product['FacturesProduct']['remise'],
                                'content' => null,
                                'longueur' => $product['FacturesProduct']['longueur'],
                                'largeur' => $product['FacturesProduct']['largeur'],
                                'hauteur' => $product['FacturesProduct']['hauteur'],
                                'poid' => $product['FacturesProduct']['poid']
                            )
                        );
                        $this->FactureProduct->save($product_facture);
                    endforeach;
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Facture d'avoir générer avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
                die();
            }else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("Facture n'existe pas"),
                    'status' => 404,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    public function etat_facture_vente() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $this->Commande->contain('User', 'User.Ville', 'Bon', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Commercial', 'Reglement');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.created ASC')
            ));
            http_response_code(200);
            echo json_encode($commandes);
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

// list reglement 
    public function show_reglement_fournisseur() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $ttc_reglement = 0;
            $data = $this->request->data;
            $this->Facture->contain('Fournisseur', 'Payment', 'Product', 'Tva', 'Type', 'User', 'Reglement');
//            $this->Facture->id = $data['Facture']['id'];
//            $reglement = $this->Facture->read();
            $reglement = $this->Facture->find('first', array(
                'conditions' => array('Facture.id' => $data['Facture']['id'])
            ));
            $payments = $this->Facture->Payment->find('all', array(
                'fields' => array('Payment.id', 'Payment.name'),
            ));
            $reglements = $this->Reglement->find('all', array(
                'conditions' => array('Reglement.facture_id' => $data['Facture']['id'])
            ));
            if (!empty($reglements)) {
                foreach ($reglements as $regl):
                    $ttc_reglement = $ttc_reglement + $regl['Reglement']['value'];
                endforeach;
            }
            if (!empty($reglement)) {
                http_response_code(200);
                echo json_encode(array(
                    'ttc_reglement' => $ttc_reglement,
                    'text' => $reglement,
                    'payments' => $payments,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("Facture non trouvé"),
                    'status' => 404,
                    'type' => 'success'
                ));
            }
            die();
        }
        die();
    }

// ajout reglement facture acha fournisseur
    public function add_reglement_fournisseur() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            $date_echeance = $data['Reglement']['date'];
            $date = date_create($date_echeance);
            date_sub($date, date_interval_create_from_date_string('5 days'));
            $date_worning = date_format($date, 'Y-m-d');
            $this->request->data['Reglement']['date_worning'] = $date_worning;
            $date1 = new DateTime($date_worning);
            $date2 = new DateTime($date_echeance);
            $interval1 = date_diff($date1, $date2);
            $interval = $interval1->format('%a');
//            debug($interval1->format('%a'));
//            debug($this->request->data['Reglement']);
//            die();
            if ($this->Reglement->save($this->request->data['Reglement'])) {
                $last_id = $this->Reglement->getLastInsertID();
                $this->Reglement->id = $last_id;
                $reglement_last = $this->Reglement->read();
                $mantant = $this->request->data['Retenus']['mantant'];
                $ifExistFacture = $this->Facture->find('first', array(
                    'conditions' => array('Facture.retenu_id' => 0, 'Facture.id' => $reglement_last['Reglement']['facture_id'])
                ));
                $this->Facture->id = $reglement_last['Reglement']['facture_id'];
//                if (!empty($ifExistFacture)) {
//                debug($this->Facture->read()['Facture']['retenu_id']);
//                debug($mantant);
                if ($mantant >= 1000 && $this->Facture->read()['Facture']['retenu_id'] == 0) {
                    $retenu = array(
                        'id' => null,
                        'fournisseur_id' => $reglement_last['Reglement']['fournisseur_id'],
                        'montant' => $mantant,
                        'date' => $reglement_last['Reglement']['created']
                    );
                    if ($this->Retenus->save($retenu)) {
                        $last_retenu_id = $this->Retenus->getLastInsertID();
                        $this->Facture->saveField('retenu_id', $last_retenu_id);
                    }
                }
//                }

                http_response_code(200);
//                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Reglement passé avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// ajout reglement grouper
    public function reglement_grouped() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            foreach ($data['Reglement'] as $reglement):
                $dataRegle = array(
                    'Reglement' => array(
                        'id' => null,
                        'type' => $reglement['type'],
                        'numero' => $reglement['ref'],
                        'date' => $reglement['date'],
                        'facture_id' => $reglement['facture_id'],
                        'fournisseur_id' => $reglement['fournisseur_id'],
                        'value' => $reglement['value'],
                        'part' => $reglement['part']
                    )
                );
                $this->Reglement->save($dataRegle);
                $id = $reglement['facture_id'];
                $this->Facture->id = $id;
                $this->Facture->saveField('grouped', true);
            endforeach;
            $last_id = $this->Reglement->getLastInsertID();
            $this->Reglement->id = $last_id;
            $reglement_last = $this->Reglement->read();
            $mantant = $reglement_last['Reglement']['value'];
            if ($mantant >= 1000) {
                $retenu = array(
                    'id' => null,
                    'fournisseur_id' => $reglement_last['Reglement']['fournisseur_id'],
                    'montant' => $mantant,
                    'date' => $reglement_last['Reglement']['created'],
                );
                if ($this->Retenus->save($retenu)) {
                    $last_retenu_id = $this->Retenus->getLastInsertID();
                    if ($this->Facture->read()['Facture']['retenu_id'] == 0) {
                        foreach ($data['Reglement'] as $facture):
                            $this->Facture->id = $facture['facture_id'];
                            $this->Facture->saveField('retenu_id', $last_retenu_id);
                        endforeach;
                    }
                }
            }
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Reglement passé avec succès"),
                'status' => 200,
                'type' => 'success'
            ));
//            }
            die();
        }
    }

// liste factures achat
    function index_achat() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $achats = $this->Facture->find('all', array(
                'conditions' => array('Facture.avoir' => 0, 'Facture.type_id' => $this->factureTypeID('achat')),
                'order' => array('Facture.created DESC')
            ));

            http_response_code(200);
            echo json_encode($achats);
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

// list facture for custom commerciale
    public function index_commerciale() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $facturescommerciale = $this->Facture->find('all', array(
                'conditions' => array(
                    'Facture.type_id' => $this->factureTypeID('vente'),
                    'Facture.commerciale_id' => $data['Facture']['commerciale_id'],
                    'Facture.isCommande' => 0
                ),
                'order' => array('Facture.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($facturescommerciale);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

// add facture vente
    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Facture->recursive = -1;
        $date = date('Y');
        $count = $this->Facture->find('count', array(
            'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'), 'YEAR(Facture.created)' => $date)
        ));
        $this->request->data['Facture']['code_facture'] = "CF-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        $this->request->data['Facture']['avoir'] = 0;
        $this->request->data['Facture']['type_id'] = $this->factureTypeID('vente');
        $this->request->data['Facture']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            if ($this->Facture->save($data)) {
                $last_id = $this->Facture->getLastInsertID();
                foreach ($data['FactureProduct'] as $product):
                    $product['id'] = null;
                    $product['facture_id'] = $last_id;
                    $this->FactureProduct->save($product);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture passée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// add facture achat
    public function add_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Facture->recursive = -1;
        $count = $this->Facture->find('count', array(
            'conditions' => array('Facture.type_id' => $this->factureTypeID('achat'))
        ));
        $this->request->data['Facture']['code_facture'] = "CFA-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        $this->request->data['Facture']['avoir'] = 0;
        $this->request->data['Facture']['type_id'] = $this->factureTypeID('achat');
        $this->request->data['Facture']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            if ($this->Facture->save($data)) {
                $last_id = $this->Facture->getLastInsertID();
                foreach ($data['FactureProduct'] as $product):
                    $ifExistStock = $this->Stock->find('first', array(
                        'conditions' => array('Stock.product_id' => $product['product_id'])
                    ));
                    if (!empty($ifExistStock)) {
                        $this->Stock->id = $ifExistStock['Stock']['id'];
                        $qte = $product['qte'] + $ifExistStock['Stock']['qte'];
                        $this->Stock->saveField('qte', $qte);
                    }
                    $product['id'] = null;
                    $product['facture_id'] = $last_id;
                    $this->FactureProduct->save($product);
                endforeach;
//                $facture = array(
//                    'Compte'
//                )
//                $this->update_compte_comptable(COMPTE_ACHAT_MARCHANDISES, $this->factureTotal($last_id)['montant_ht'], 0, $this->factureTotal($last_id)['date'],$last_id);
//                $this->update_compte_comptable(COMPTE_TVA_DEDUCTIBLE, $this->factureTotal($last_id)['tva'], 0, $this->factureTotal($last_id)['date'],$last_id);
//                $this->update_compte_comptable(COMPTE_FOURNISSEUR, 0, $this->factureTotal($last_id)['montant_ttc'], $this->factureTotal($last_id)['date'],$last_id);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture passée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// view facture 
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Facture->contain('Payment', 'Commercial', 'Product', 'Fournisseur', 'Product.FacturesProduct', 'Tva', 'Product.Bon', 'Type', 'User', 'User.Ville');
            $this->Facture->recursive = 2;
            $data = $this->request->data;
            $this->Facture->id = $data['Facture']['id'];
            $facture = $this->Facture->read();
            if (!empty($facture)) {
                http_response_code(200);
                echo json_encode(array(
                    'text' => $facture,
                    'status' => 200,
                    'type' => 'success'
                ));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Facture non trouvé"),
                    'status' => 404,
                    'type' => 'success'
                )));
            }
            die();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

// view facture 
    public function view_facturescommande() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->FacturesCommande->contain('Product', 'Facture', 'Facture.User', 'Product.FacturesProduct', 'Tva', 'Product.Bon', 'Type', 'User', 'User.Ville');
//            $this->FacturesCommande->recursive = 2;
            $data = $this->request->data;
            $this->FacturesCommande->id = $data['Facture']['id'];
            $facture = $this->FacturesCommande->read();
            foreach ($facture['Facture'] as $k => $f):
                $this->FactureProduct->recursive = -1;
                $fp = $this->FactureProduct->find('all', array(
                    'conditions' => array('FactureProduct.facture_id' => $f['id'], 'FactureProduct.product_id' => 0)
                ));
                $facture['Facture'][$k]['Colis'] = $fp;
            endforeach;
            if (!empty($facture)) {
                http_response_code(200);
                echo json_encode(array(
                    'text' => $facture,
                    'status' => 200,
                    'type' => 'success'
                ));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Facture non trouvé"),
                    'status' => 404,
                    'type' => 'success'
                )));
            }
            die();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Facture->delete($this->request->data['Facture']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("cette Facture a était supprimée avec succès"),
                'status' => '200',
                'type' => 'success'
            )));
            $this->response->send();
            die();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        $this->response->send();
        die();
    }

}

<?php

App::uses('AppController', 'Controller');

/**
 * Commandes Controller
 *
 * @property Commande $Commande
 * @property PaginatorComponent $Paginator
 */
class DevisController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'add', 'view', 'edit', 'change_livraison', 'bon_livraison_facture', 'delete');
    }

    public $uses = array('Devi', 'Bon', 'User', 'Commande', 'Facture', 'FactureProduct', 'Configuration', 'Notification', 'Unite', 'Commercial');
    public $_state = array(
        'init' => 'Non Traitée',
        'wait' => 'En Cours',
        'done' => 'Finalisée'
    );

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Devis', 'Commande.state' => $this->_state['init']),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            echo json_encode($commandes);
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

    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        $this->Commande->recursive = -1;
        $count = $this->Commande->find('count');
        $this->request->data['Commande']['ref'] = "DEV-" . date('d') . date('m') . date('y') . "-" . ($count + 1);
        $this->request->data['Commande']['type'] = 'Devis';
//        $this->request->data['Commande']['commerciale_id'] = $this->Commande['User']['commerciale_id'];
        $this->request->data['Commande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        $this->request->data['Commande']['avoir'] = 0;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->Commande->save($data)) {
                $last_id = $this->Commande->getLastInsertID();
                $this->Commande->saveField('commerciale_id', $this->Commande->read()['User']['commerciale_id']);
                foreach ($data['Bon'] as $bon):
                    $bon['id'] = null;
                    $bon['commande_id'] = $last_id;
                    $this->Bon->save($bon);
                endforeach;
                if (!empty($data['Notification'])) {
                    foreach ($data['Notification'] as $notif):
//                        if (!empty($notif['msg'])) {
                        $notifToSave = array(
                            'id' => null,
                            'product_id' => $notif['product_id'],
                            'msg' => $notif['msg'],
                            'lvl' => $notif['lvl'],
                        );
//                        }
                        $this->Notification->save($notifToSave);
                    endforeach;
                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Devis passé succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    //edit Devis
    public function edit() {
//        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
//        $commande = $this->Commande->read();
        if ($this->request->is(array('post'))) {
//            if (!$this->Commande->exists()) {
//                http_response_code(404);
//                header('Content-Type: application/json');
//                echo json_encode(array(
//                    'text' => __("Devis Non Trouvé"),
//                    'status' => 404,
//                    'type' => 'error'
//                ));
//                die();
//            }
            $data = $this->request->data;
//            debug($data['Commande']); die();
            if ($this->Commande->save($data['Commande'])) {
                foreach ($data['Bon'] as $bon):
                    if ($bon['bon_id'] != 0) {
                        $bon['id'] = $bon['bon_id'];
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    } else {
                        $bon['id'] = null;
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    }
                endforeach;
//                if (!empty($data['Notification'])) {
//                    foreach ($data['Notification'] as $notif):
////                        if (!empty($notif['msg'])) {
//                        $notifToSave = array(
//                            'id' => null,
//                            'product_id' => $notif['product_id'],
//                            'msg' => $notif['msg'],
//                            'lvl' => $notif['lvl'],
//                        );
////                        }
//                        $this->Notification->save($notifToSave);
//                    endforeach;
//                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Devis modifié avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
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

    //view Devis
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User', 'User.Ville', 'Bon', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Commercial');
            $data = $this->request->data;
            $this->Commande->id = $data['Commande']['id'];
            $commande = $this->Commande->read();
            if (!empty($commande)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $commande,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvé"),
                    'status' => 404,
                    'type' => 'error'
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

    // convert devis to bon livraison
    public function change_livraison() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,XHR,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        debug($this->request->data); die();
        $this->Commande->id = $this->request->data['Commande']['id'];
        $data = $this->request->data;
        if ($this->request->is('put')) {
            if (!empty($this->request->data['Commande']['id']) && $this->request->data['Commande']['isLivraison'] == false) {
                if ($this->Commande->saveField('state', 'Finalisée') && $this->Commande->saveField('type', 'Commande') && $this->Commande->save($this->request->data) && $this->Commande->saveField('isLivraison', true)) {
                    $commande = $this->Commande->read();
                    $bl = $this->Commande->find('count', array(
                        'conditions' => array('Commande.state' => $this->_state['done'])
                    ));
                    $acompte = $this->request->data['Commande']['acompte'];
                    $newRefBL = "BL-" . date('d') . date('m') . date('y') . "-" . ($bl + 1);
                    $this->Commande->saveField('ref', $newRefBL);
                    $this->Commande->saveField('acompte', $acompte);
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Changement Bon de commande '.") . $commande['Commande']['ref'] . __("' en bon de livraison"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                    die();
                }
            }
        }
//            http_response_code(403);
//            echo json_encode(array(
//                'text' => __("Not Allowed To Access"),
//                'status' => 403,
//                'type' => 'error'
//            ));
        die();
    }

    //convert devis in bon livraison and facture
    public function bon_livraison_facture() {
        //if exist bl ref
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        debug($this->request->data); die();
        $this->Commande->id = $this->request->data['Commande']['id'];
        $this->Commande->recursive = 2;
        if ($this->request->is(array('put'))) {
            if (!empty($this->request->data['Commande']['id']) && $this->request->data['Commande']['isLivraison'] == false) {
                $commande = $this->Commande->read();
                $this->Commande->contain('Bon', 'User', 'Receiver', 'Commercial');
//                debug($commande['Commande']);
//                debug($commande['Bon']);
//                die();
                if ($commande['Commande']['type'] == 'Transport') {
                    $commande = $this->Commande->read();
//                debug($commande);
//                die();
                    $date = date('Y');
                    $countFacture = $this->Facture->find('count', array(
                        'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'), 'YEAR(Facture.created)' => $date)
                    ));
                    $newCF = 'CF-' . date('y') . date('m') . date('d') . "-" . ($countFacture + 1);
                    $facture = array(
                        'Facture' => array(
                            'id' => null,
                            'code_facture' => $newCF,
                            'object' => $commande['Commande']['object'],
                            'validate' => $commande['Commande']['validate'],
                            'pourcentage' => $commande['Commande']['pourcentage'],
                            'avoir' => 0,
                            'limit_date' => null,
                            'payment_id' => $this->request->data['Commande']['payment_id'],
                            'commande_id' => $this->request->data['Commande']['id'],
                            'commerciale_id' => $commande['Commande']['commerciale_id'],
                            'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                            'acompte' => $this->request->data['Commande']['acompte'],
                            'remise_globale' => $commande['Commande']['remise_globale'],
                            'type_id' => $this->factureTypeID('vente'),
                            'tva_id' => 2,
                            'is_client' => true,
                            'user_id' => $commande['Commande']['user_id'],
                            'isContreRembourcement' => $commande['Commande']['isContreRembourcement'],
                            'mantant' => $commande['Commande']['mantant']
                        )
                    );

                    if ($this->Facture->save($facture)) {
                        $FactureLastInsertID = $this->Facture->getLastInsertID();
                        $commande = $this->Commande->read();
//                    debug($commande['Bon']); die();
                        foreach ($commande['Bon'] as $bon):
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
//                        debug($data); die();
                            $this->FactureProduct->save($data);
                        endforeach;
                        http_response_code(200);
                        echo json_encode(array(
                            'newCF' => $newCF,
                            'text' => __("Facture générer avec succès"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                } else {
                    if ($this->Commande->saveField('state', 'Finalisée') && $this->Commande->saveField('type', 'Commande') && $this->Commande->save($this->request->data) && $this->Commande->saveField('isLivraison', true)) {
                        $bl = $this->Commande->find('count', array(
                            'conditions' => array('Commande.state' => 'Finalisée')
                        ));
                        $acompte = $this->request->data['Commande']['acompte'];
                        //Test if Ref BL exist
                        $newRefBL = "BL-" . date('d') . date('m') . date('y') . "-" . ($bl + 1);
                        //End Test 
                        $this->Commande->saveField('ref', $newRefBL);
                        $this->Commande->saveField('acompte', $acompte);
                        
                    }
                    $commande = $this->Commande->read();
//                debug($commande);
//                die();
                    $date = date('Y');
                    $countFacture = $this->Facture->find('count', array(
                        'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'), 'YEAR(Facture.created)' => $date)
                    ));
                    $newCF = 'CF-' . date('y') . date('m') . date('d') . "-" . ($countFacture + 1);
                    $facture = array(
                        'Facture' => array(
                            'id' => null,
                            'code_facture' => $newCF,
                            'object' => $commande['Commande']['object'],
                            'validate' => $commande['Commande']['validate'],
                            'pourcentage' => $commande['Commande']['pourcentage'],
                            'avoir' => 0,
                            'limit_date' => null,
                            'payment_id' => $this->request->data['Commande']['payment_id'],
                            'commande_id' => $this->request->data['Commande']['id'],
                            'commerciale_id' => $commande['Commande']['commerciale_id'],
                            'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                            'acompte' => $this->request->data['Commande']['acompte'],
                            'remise_globale' => $commande['Commande']['remise_globale'],
                            'type_id' => $this->factureTypeID('vente'),
                            'is_client' => true,
                            'user_id' => $commande['Commande']['user_id'],
                        )
                    );

                    if ($this->Facture->save($facture)) {
                        $FactureLastInsertID = $this->Facture->getLastInsertID();
                        $commande = $this->Commande->read();
                        $this->Commande->saveField('facture_id', $FactureLastInsertID);
//                    debug($commande['Bon']); die();
                        foreach ($commande['Bon'] as $bon):
                            $data = array(
                                'FactureProduct' => array(
                                    'id' => null,
                                    'facture_id' => $FactureLastInsertID,
                                    'product_id' => $bon['product_id'],
                                    'qte' => $bon['qte'],
                                    'remise' => $bon['remise'],
                                    'last_unit_price' => $bon['last_unit_price'],
                                )
                            );
//                        debug($data); die();
                            $this->FactureProduct->save($data);
                        endforeach;
                        http_response_code(200);
                        echo json_encode(array(
                            'newCF' => $newCF,
                            'text' => __("Changement Bon de commande '.") . $commande['Commande']['ref'] . __("' en bon de livraison + Facture"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            }else {
                http_response_code(403);
                echo json_encode(array(
                    'text' => __("Not Allowed To Access"),
                    'status' => 403,
                    'type' => 'error'
                ));
                die();
            }
        }
    }

    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Commande->delete($this->request->data['Commande']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("cette Devi a était supprimé avec succès"),
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

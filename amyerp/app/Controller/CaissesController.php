<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UsersController
 *
 * @author MRK19933
 */
class CaissesController extends AppController {

    public $components = array('RequestHandler');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('valide_panier');
    }
    
        public $uses = array('Avoir', 'Retour', 'Ramassage', 'ProductsStock', 'Historique', 'Sousemplacement', 'Emplacement', 'Commande', 'Chargement', 'Bon', 'Receiver', 'User', 'Facture', 'Presentoire', 'FactureProduct', 'PresentoireProduct', 'Product', 'Reglement', 'Unite', 'Stock', 'Commercial', 'Livreur', 'Payment');


    public function valide_panier() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->Commande->recursive = -1;
        $count = $this->Commande->find('count');
        $this->request->data['Commande']['ref'] = "BC-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        $this->request->data['Commande']['type'] = 'Commande';
        $this->request->data['Commande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        $this->request->data['Commande']['avoir'] = 0;
        debug("php");
        die(); 
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;          
            $this->Commande->save($data['Commande']);

            if ($this->Commande->save($data['Commande'])) {
                $last_id = $this->Commande->getLastInsertID();
                foreach ($data['Bon'] as $bon):
                    $data_bon =
                       array(
                        'id' => null,
                        'commande_id' => $last_id,
                        'product_id' => $bon['Product']['id'],
                        'last_unit_price' => $bon['Product']['price'],
                        'qte' => $bon['Bon'][0]['qte'],
                    );
//                    debug($bon['Product']['id']);
//                    die();
                    $this->Bon->save($data_bon);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande passée avec tit"),
                    'status' => 200,
                    'type' => 'success',
                    'id_comm'=>$last_id
                ));
            }
            die();
        }
    }
        public function add_client() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $maxid = $this->User->find('first', array(
            'fields' => 'MAX(User.id) as id',
        ));
        $maxid = $maxid[0]['id'];
        $this->request->data['User']['code'] = 'C' . $maxid . date('Y');
        $this->request->data['User']['role_id'] = $this->getRole('client');
        if ($this->request->is(array('post', 'ajax'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->User->save($data)) {
                $clientController = new ClientsController();
                $last_id = $this->User->getLastInsertID();
                $data['User']['id'] = $last_id;
                $this->User->id = $data['User']['id'];
                $client = $this->User->read();
                $data['User']['full_name'] = $client['User']['first_name'] . " " . $client['User']['last_name'];
                $data['User']['domain'] = "colisexpress.tn";
                $data['User']['typesave'] = "add_client";
//                $clientController->save_client($data['User']);
                if (!empty($data['Data'])) {
                    foreach ($data['Data'] as $paymentuser):
                        $pu = array(
                            'PaymentsUser' => array(
                                'id' => null,
                                'user_id' => $last_id,
                                'payment_id' => $paymentuser['id']
                            )
                        );
                        $this->PaymentsUser->save($pu);
                    endforeach;
                }
                $this->User->id = $last_id;
                $lastclient = $this->User->read()['User'];
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Client ajouté avec succès"),
                    'data' => $lastclient,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }
//    public function indexapi() {
//        $this->autoRender = false;
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
//        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            $users = $this->User->find('all');
//            // debug($users);
//            //die();
//            http_response_code(200);
//            echo json_encode(array(
//                'data' => $users,
//                'status' => 200,
//                'type' => 'success'
//            ));
//            die();
//        }
//    }
//
//    public function adduserapi() {
//        $this->autoRender = false;
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//         header('Content-type: application/json');
//        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            $data = $this->request->data;
//            //debug($data);
//            //debug($this->User->save($data));
//            //die();
//            if ($this->User->save($data)) {
//             // debug($users);
//                //die();
//                http_response_code(200);
//                echo json_encode(array(
//                    'text' => __("user ajouter avec succee"),
//                    'status' => 200,
//                    'type' => 'success'
//                ));
//                die();
//            }else{
//                http_response_code(200);
//                echo json_encode(array(
//                'text' =>"error",
//                'status' => 200,
//                'type' => 'error'
//                ));
//                die();
//            }
//        }
//    }
}

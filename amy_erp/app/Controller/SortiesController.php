<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP SortiesController
 * @author Mohamed
 */
class SortiesController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('entrees_paginate', 'sorties_paginate', 'index', 'index_entree', 'generer_bon_sortie', 'view', 'view_entree');
    }

    public $uses = array('Commande', 'Bon', 'Sortie', 'Entree', 'Configuration', 'Product');

// list des entrées paginate
    public function entrees_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $limit = 15;
            if (!empty($data['Entree']['limit'])) {
                $limit = $data['Entree']['limit'];
            }
            $search = "";
            if (!empty($data['Entree']['searchKey'])) {
                $search = $data['Entree']['searchKey'];
                $filters = array(
                    'Entree.type' => 'Entree',
                    "lower(Entree.ref) like '%" . $search . "%' or "
                    . "lower(Entree.entrepot_depart) like '%" . $search . "%' or "
                    . "lower(Entree.entrepot_arrivee) like '%" . $search . "%' or "
                    . "lower(Entree.created) like '%" . $search . "%' or "
                    . "lower(Entree.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Entree.created DESC';
                $this->Paginator->settings['limit'] = $limit;
                $entrees = $this->paginate('Entree');
            } else {
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['order'] = 'Entree.created DESC';
                $filters = array('Entree.type' => 'Entree');
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['limit'] = $limit;
                $entrees = $this->paginate('Entree');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'entrees' => $entrees,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// list des bon sortie paginate
    public function sorties_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            debug($data);
            $limit = 15;
            if (!empty($data['Sortie']['limit'])) {
                $limit = $data['Sortie']['limit'];
            }
            $search = "";
            if (!empty($data['Sortie']['searchKey'])) {
                $search = $data['Sortie']['searchKey'];
                $filters = array(
                    'Sortie.type' => 'Sortie',
                    "lower(Sortie.ref) like '%" . $search . "%' or "
                    . "lower(Sortie.entrepot_depart) like '%" . $search . "%' or "
                    . "lower(Sortie.entrepot_arrivee) like '%" . $search . "%' or "
                    . "lower(Sortie.created) like '%" . $search . "%' or "
                    . "lower(Sortie.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Sortie.created DESC';
                $this->Paginator->settings['limit'] = $limit;
                $sorties = $this->paginate('Sortie');
            } else {
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['order'] = 'Sortie.created DESC';
                $filters = array('Sortie.type' => 'Sortie');
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['limit'] = $limit;
                $sorties = $this->paginate('Sortie');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'sorties' => $sorties,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $bonsortie = $this->Sortie->find('all', array(
                'conditions' => array('Sortie.type' => 'Sortie'),
                'order' => array('Sortie.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $bonsortie,
                'status' => 200,
                'type' => 'success'
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

    public function index_entree() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $bonentree = $this->Entree->find('all', array(
                'conditions' => array('Entree.type' => 'Entree'),
                'order' => array('Entree.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $bonentree,
                'status' => 200,
                'type' => 'success'
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

    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Sortie->contain('Bon', 'Bon.Product');
            $data = $this->request->data;
            $this->Sortie->id = $data['Sortie']['id'];
            $bonsortie = $this->Sortie->read();
            if (!empty($bonsortie)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $bonsortie,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Bon sortie non trouvée"),
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

    public function view_entree() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Entree->contain('Bon', 'Bon.Product');
            $data = $this->request->data;
            $this->Entree->id = $data['Entree']['id'];
            $bonentree = $this->Entree->read();
            if (!empty($bonentree)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $bonentree,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Bon d'entrée non trouvée"),
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

    // générer bon ramassage  
    public function generer_bon_sortie() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Sortie')
            ));
            $this->request->data['Sortie']['ref'] = "Bon-sortie " . date('Y') . " / " . ($count + 1);
            $this->request->data['Sortie']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
            $this->request->data['Sortie']['avoir'] = 0;
            $this->request->data['Sortie']['type'] = "Sortie";
            debug($this->request->data);
            die();
            if ($this->Sortie->save($this->request->data['Sortie'])) {
                $lastInsertIdCommand = $this->Sortie->getLastInsertID();
                foreach ($this->request->data['Bon'] as $bon):
                    $product_id = 0;
                    $ifExistProduct = $this->Product->find('first', array(
                        'conditions' => array('Product.name' => $bon['content'])
                    ));
                    if (!empty($ifExistProduct)) {
                        $product_id = $ifExistProduct['Product']['id'];
                    }
                    $bon = array(
                        'Bon' => array(
                            'id' => NULL,
                            'product_id' => $product_id,
                            'qte' => $bon['qte'],
                            'content' => $bon['content'],
                            'commande_id' => $lastInsertIdCommand
                        )
                    );
                    $this->Bon->save($bon);
                endforeach;
                $count = $this->Commande->find('count', array(
                    'conditions' => array('Commande.type' => 'Entree')
                ));
                $this->request->data['Entree']['ref'] = "Bon-entree " . date('Y') . " / " . ($count + 1);
                $this->request->data['Entree']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
                $this->request->data['Entree']['avoir'] = 0;
                $this->request->data['Entree']['sortie_id'] = $lastInsertIdCommand;
                $this->request->data['Entree']['type'] = "Entree";
                if ($this->Entree->save($this->request->data['Entree'])) {
                    $lastInsertIdEntree = $this->Entree->getLastInsertID();
                    foreach ($this->request->data['Bon'] as $bon):
                        $product_id = 0;
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $bon['content'])
                        ));
                        if (!empty($ifExistProduct)) {
                            $product_id = $ifExistProduct['Product']['id'];
                        }
                        $bon = array(
                            'Bon' => array(
                                'id' => NULL,
                                'product_id' => $product_id,
                                'qte' => $bon['qte'],
                                'content' => $bon['content'],
                                'commande_id' => $lastInsertIdEntree
                            )
                        );
                        $this->Bon->save($bon);
                    endforeach;
                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Bon Sortie générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

}

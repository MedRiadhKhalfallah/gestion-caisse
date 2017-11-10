<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP RevenusController
 * @author famille
 */
class RetenusController extends AppController {

    public $uses = array('Retenus', 'Configuration', 'FactureProduct', 'Facture', 'Fournisseur');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Retenus->contain('Facture', 'Facture.Fournisseur', 'Fournisseur');
            $retenus = $this->Retenus->find('all', array(
                'order' => array('Retenus.date DESC')
            ));
            http_response_code(200);
            echo json_encode($retenus);
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

// view Retenu 
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Retenus->contain('Facture', 'Facture.Product', 'Fournisseur', 'Facture.Product.FacturesProduct');
            $data = $this->request->data;
            $this->Retenus->id = $data['Retenus']['id'];
            $retenu = $this->Retenus->read();
            if (!empty($retenu)) {
                http_response_code(200);
                echo json_encode(array(
                    'text' => $retenu,
                    'status' => 200,
                    'type' => 'success'
                ));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Retenus non trouvé"),
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

}

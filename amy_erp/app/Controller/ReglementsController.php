<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP ReglementsController
 * @author hedi
 */
class ReglementsController extends AppController {

    public $uses = array('Reglement', 'Commande');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'index_fournisseur', 'edit_reglement', 'delete_reglement');
    }

    //web service liste reglement
    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Reglement->contain('Commande', 'Commande.User');
            $reglementsvente = $this->Reglement->find('all', array(
                'conditions' => array('Reglement.isAchat' => 0)
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $reglementsvente,
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

    //web service liste reglement  achat
    function index_fournisseur() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Reglement->contain('Commande', 'Commande.Fournisseur', 'Fournisseur');
            $reglementsachat = $this->Reglement->find('all', array(
                'conditions' => array('Reglement.isAchat' => 1)
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $reglementsachat,
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

    //web service delete reglement
    function delete_reglement() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Reglement->delete($this->request->data['Reglement']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("cette Reglement a était supprimé avec succès"),
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

    public function edit_reglement() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        debug($this->request->data); die();
        $this->Reglement->id = $this->request->data['Reglement']['id'];
        $data = $this->request->data;
        if ($this->request->is(array('put'))) {
            if (!empty($this->request->data['Reglement']['id'])) {
                if ($this->request->data['Reglement']['valide'] == 'true') {
                    $reglement = $this->Reglement->read();
                    $this->Reglement->saveField('valide', 1);
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Reglement modifié avec succèss"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                } else {
                    $reglement = $this->Reglement->read();
                    $this->Reglement->saveField('valide', 0);
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => __("Reglement modifié avec succèss"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            } else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("Reglement n'existe pas"),
                    'status' => 404,
                    'type' => 'error'
                ));
            }
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

}

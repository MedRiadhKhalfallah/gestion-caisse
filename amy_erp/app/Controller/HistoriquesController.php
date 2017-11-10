<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP HistoriquesController
 * @author Mohamed
 */
class HistoriquesController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

    public $uses = array('Historique', 'Commande');

    public function index() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Historique->contain('Commande', 'Commande.Bon', 'User');
            $historiques = $this->Historique->find('all', array(
                'conditions' => array('Historique.commande_id' => $this->request->data['Commande']['id']),
                'order' => array('Historique.created ASC')
            ));

            http_response_code(200);
            echo json_encode(array(
                'data' => $historiques,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function view() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $this->request->data['Commande']['ref'])
            ));
            if (!empty($commande)) {
                $this->Historique->contain('Commande', 'Commande.Bon', 'User');
                $historiques = $this->Historique->find('all', array(
                    'conditions' => array('Historique.commande_id' => $commande['Commande']['id']),
                    'order' => array('Historique.created ASC')
                ));
                http_response_code(200);
                echo json_encode(array(
                    'data' => $historiques,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'text' => __('Commande n\'existe pas'),
                    'status' => 200,
                    'type' => 'error'
                ));
            }

            die();
        }
    }

}

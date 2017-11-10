<?php

App::uses('AppController', 'Controller');

/**
 * Villes Controller
 *
 * @property Ville $Ville
 * @property PaginatorComponent $Paginator
 */
class VillesController extends AppController {

    public $uses = array('Ville', 'Delegation', 'Localite');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'list_localites_delegation', 'list_delegations', 'list_localites_ville', 'list_localites', 'list_delegations_ville');
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $villes = $this->Ville->find('all', array(
//                'fields' => array('Ville.id', 'Ville.name'),
                'order' => array('Ville.created DESC')
            ));
            http_response_code(200);
            echo json_encode($villes);
            die();
        }
        die();
    }

    function list_delegations() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $delegations = $this->Delegation->find('all', array(
                'order' => array('Delegation.created DESC')
            ));
            http_response_code(200);
            echo json_encode($delegations);
            die();
        }
        die();
    }

    function list_delegations_ville() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post', 'ajax')) {
            $delegations = $this->Delegation->find('all', array(
                'conditions' => array('Delegation.ville_id' => $this->request->data['Ville']['id']),
                'order' => array('Delegation.created DESC')
            )); 
            $dels = array();
            foreach ($delegations as $d):
                array_push($dels, array('id' => $d['Delegation']['id'], 'name' => $d['Delegation']['name']));
            endforeach;
            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'data' => $dels,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

    function list_localites_ville() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post', 'ajax')) {
            $localites = $this->Localite->find('all', array(
                'conditions' => array('Localite.delegation_id' => $this->request->data['Delegation']['id']),
                'order' => array('Localite.created DESC')
            ));
            $dels = array();
            foreach ($localites as $d):
                array_push($dels, array('id' => $d['Localite']['id'], 'name' => $d['Localite']['name'], 'zip_code' => $d['Localite']['zip_code']));
            endforeach;
            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'data' => $dels,
                'localites' => $localites,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

    function list_localites_delegation() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post', 'ajax')) {
            $localites = $this->Localite->find('first', array(
                'conditions' => array('Localite.id' => $this->request->data['Localite']['id']),
                'order' => array('Localite.created DESC')
            ));
            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'data' => $localites,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

    function list_localites() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $localites = $this->Localite->find('all', array(
                'order' => array('Localite.created DESC')
            ));
            http_response_code(200);
            echo json_encode($localites);
            die();
        }
        die();
    }

}

<?php

App::uses('AppController', 'Controller');

class FournisseursController extends AppController {

    public $uses = array('Fournisseur');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'add', 'view', 'edit', 'delete');
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $fournisseurs = $this->Fournisseur->find('all', array(
//                'fields' => array('Fournisseur.id', 'Fournisseur.name'),
                'order' => array('Fournisseur.created DESC')
            ));
            http_response_code(200);
            echo json_encode($fournisseurs);
            die();
        }
        die();
    }

    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->Fournisseur->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Fournisseur ajouté avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Fournisseur->id = $data['Fournisseur']['id'];
            $fournisseur = $this->Fournisseur->read();
            if (!empty($fournisseur)) {
//                http_response_code(200);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $fournisseur,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Fournisseur non trouvé"),
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

    function edit() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->Fournisseur->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Fournisseur modifié avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Fournisseur->read();
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
            $this->Fournisseur->delete($this->request->data['Fournisseur']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("cette Fournisseur a était supprimée avec succès"),
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

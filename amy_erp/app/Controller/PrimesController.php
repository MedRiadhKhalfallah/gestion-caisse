<?php

App::uses('AppController', 'Controller');

/**
 * Primes Controller
 *
 * @property Prime $Prime
 * @property PaginatorComponent $Paginator
 */
class PrimesController extends AppController {

    public $uses = array('Prime', 'PrimesUser');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'add', 'add_prime_employe', 'view', 'edit', 'delete');
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $primes = $this->Prime->find('all', array(
                'order' => array('Prime.created DESC')
            ));
            http_response_code(200);
            echo json_encode($primes);
            die();
        }
        die();
    }
    // add new prime
    public function add() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->Prime->save($data)) {
                $this->Prime->recursive = -1;
                $primes = $this->Prime->find('all');
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Prime ajouté avec succès"),
                    'data' => $primes,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }
    // add prime to employé
    public function add_prime_employe() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data); 
//            die();
            if ($this->PrimesUser->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Prime d'employé ajouté avec succès"),
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
            $this->Prime->id = $data['Prime']['id'];
            $prime = $this->Prime->read();
            if (!empty($prime)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $prime,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Prime non trouvé"),
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
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->Prime->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Prime modifiée avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Prime->read();
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
            $this->Prime->delete($this->request->data['Prime']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Ce prime a était supprimé avec succès"),
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

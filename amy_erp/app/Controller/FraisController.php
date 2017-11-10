<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP FraisController
 * @author hedi
 */
class FraisController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('add_ajax', 'index', 'index_filter', 'delete'); 
    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $date = date('Y-m-d');
            $frais = $this->Frai->find('all', array(
                'conditions' => array('Frai.created LIKE' => $date . " %"),
                'order' => array('Frai.created DESC')
            ));
            http_response_code(200);
            echo json_encode($frais);
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

    public function index_filter() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $date = $this->request->data['Frai']['date'];
            $fraisfilter = $this->Frai->find('all', array(
                'conditions' => array('Frai.created LIKE' => $date . " %"),
                'order' => array('Frai.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $fraisfilter,
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
        die();
    }

    public function add_ajax() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $file = $this->params['form']['file'];
            if (!empty($file)) {
                $dir = IMAGES . "notes_de_frais";
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($this->request->data['designation'])), "-")) . "." . $ext;
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
                    $this->request->data['img'] = "notes_de_frais" . DS . $filename;
                    $frai['Frai'] = $this->request->data;
                    if ($this->Frai->save($frai)) {
                        http_response_code(200);
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'text' => __("note de frais ajoutée avec success"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            } else {
                $frai['Frai'] = $this->request->data;
                if ($this->Frai->save($frai)) {
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("note de frais ajoutée avec success"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }
        }
        die();
    }

    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Frai->delete($this->request->data['Frai']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Note de frais supprimé avec succès"),
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

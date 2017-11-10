<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP RootsController
 * @author famille
 */
class RootsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow();
    }

    public function crypt_code($code = null) {
        if ($code !== NULL) {
            return AuthComponent::password($code);
        }
        return NULL;
    }

    public function root_init() {
        $data = array(
            0 => array(
                'Root' => array(
                    'id' => null,
                    'code' => $this->crypt_code('amysup'),
                    'action' => 'delete'
                )
            ),
            1 => array(
                'Root' => array(
                    'id' => null,
                    'code' => $this->crypt_code('amymaj'),
                    'action' => 'update'
                )
            ),
            2 => array(
                'Root' => array(
                    'id' => null,
                    'code' => $this->crypt_code('amyadd'),
                    'action' => 'add'
                )
            ),
        );
        foreach ($data as $root):
            $this->Root->save($root);
        endforeach;
        die();
    }

    public function root_delete() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data); die();
            $ifAccess = $this->Root->find('first', array(
                'conditions' => array('Root.code' => $this->crypt_code($data['Root']['code']), 'Root.action' => 'delete')
            ));
            if (!empty($ifAccess)) {
                http_response_code(200);
                echo json_encode(array(
                    'text' => __("OK"),
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            }
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

}

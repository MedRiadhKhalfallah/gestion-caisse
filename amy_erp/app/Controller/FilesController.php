<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP FilesController
 * @author famille
 */
class FilesController extends AppController {
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('save_pdf');
    }

    public function save_pdf() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        //header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if($this->request->is(array('ajax','post'))){
            $data = $this->request;
            debug($data);
        }
        die();
    }

}

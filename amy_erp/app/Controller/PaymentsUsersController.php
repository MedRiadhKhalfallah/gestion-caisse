<?php

App::uses('AppController', 'Controller');

/**
 * AllergiesPatients Controller
 *
 * @property AllergiesPatient $AllergiesPatient
 * @property PaginatorComponent $Paginator
 */
class PaymentsUsersController extends AppController {

    public $uses = array('User', 'Payment', 'PaymentsUser');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index');
    }

    function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->PaymentsUser->contain('Payment');
            $data = $this->request->data;
            $paymentsusers = $this->PaymentsUser->find('all', array(
                'conditions' => array('PaymentsUser.user_id' => $data['Payment']['id'])
            ));
            $payments = $this->Payment->find('all');
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'user' => $paymentsusers,
                'payments' => $payments,
            ));
            die();
        }
//        header('HTTP/1.0 403 Forbidden');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

}

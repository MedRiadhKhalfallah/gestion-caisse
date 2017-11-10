<?php

App::uses('AppController', 'Controller');

/**
 * Notifications Controller
 *
 * @property Notification $Notification
 * @property PaginatorComponent $Paginator
 */
class NotificationsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index');
    }

    public $uses = array('Notification', 'Configuration', 'Product', 'Fournisseur', 'Famille');

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Notification->contain('Product');
            $count = $this->Notification->find('count');
            $notifications = $this->Notification->find('all', array('order' => array('Notification.created DESC')));
            echo json_encode(array(
                'notification' => $notifications,
                'count' => $count
            ));
            die();
        }
        die();
    }

}

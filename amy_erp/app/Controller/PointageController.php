<?php

App::uses('AppController', 'Controller');

/**
 * Users Controller
 *
 * @property User $User
 * @property PaginatorComponent $Paginator
 */
class PointageController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('pointage_employe', 'index_angular');
    }

    /**
     * Components
     *
     * @var array
     */
    public $components = array('Paginator');

    /**
     * index method
     *
     * @return void
     */
    public function index() {
        $this->Employee->recursive = 0;
        $this->set('employe', $this->Paginator->paginate());
    }

    /**
     * view method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function view($id = null) {
        if (!$this->Employee->exists($id)) {
            throw new NotFoundException(__('Invalid user'));
        }
        $options = array('conditions' => array('Employee.' . $this->Employee->primaryKey => $id));
        $this->set('employe', $this->Employee->find('first', $options));
    }

    /**
     * add method
     *
     * @return void
     * 
     */
    public function add() {
        
    }

    public function index_angular() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $pointages = $this->Employee->find('all');
            if (!empty($pointages)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $pointages,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => __('list vide'),
                    'status' => 304,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    public function add_employe() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if (!empty($this->request->data)) {
            $data = $this->request->data;
            if ($this->request->is('post')) {
                if ($this->Employee->save($this->request->data)) {
                    http_response_code(200);
                    header("HTTP/1.1 200 OK");
                    echo json_encode(array(
                        'text' => __('employé ajouté avec succès'),
                        'status' => 200,
                        'type' => 'success'
                    ));
                    die();
                } else {
                    http_response_code(403);
                    header("HTTP/1.1 403 OK");
                    echo json_encode(array(
                        'text' => __('echec'),
                        'status' => 403,
                        'type' => 'error'
                    ));
                    die();
                }
            }


            die();
        }
    }

    /**
     * edit method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
//    public function edit($id = null) {
//        if (!$this->User->exists($id)) {
//            throw new NotFoundException(__('Invalid user'));
//        }
//        if ($this->request->is(array('post', 'put'))) {
//            if ($this->User->save($this->request->data)) {
//                $this->Flash->success(__('The user has been saved.'));
//                return $this->redirect(array('action' => 'index'));
//            } else {
//                $this->Flash->error(__('The user could not be saved. Please, try again.'));
//            }
//        } else {
//            $options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
//            $this->request->data = $this->User->find('first', $options);
//        }
//    }

    /**
     * delete method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function delete($id = null) {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        $this->request->allowMethod('post', 'delete');
        if ($this->User->delete()) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }
        return $this->redirect(array('action' => 'index'));
    }

}



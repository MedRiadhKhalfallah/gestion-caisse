<?php

App::uses('AppController', 'Controller');

/**
 * Sousemplacements Controller
 *
 * @property Sousemplacement $Sousemplacement
 * @property PaginatorComponent $Paginator
 */
class SousemplacementsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'add', 'view', 'edit', 'delete', 'init_sousemplacement', 'valide_emplacement', 'mouvement_emplacement');
    }

    public $uses = array('Sousemplacement', 'Emplacement', 'Configuration', 'Product', 'Fournisseur', 'Famille', 'Stock', 'Commande', 'Bon', 'User', 'Sousemplacement', 'Ville');

//    public function init_sousemplacement() {
//        $emplacements = $this->Emplacement->find('all', array(
//            'fields' => array('Emplacement.id')
//        ));
//        $states = array('En attente livraison', 'Retour', 'Annulation');
//        foreach ($emplacements as $emplacement):
//            foreach ($states as $state):
////                debug($state);
////                die();
//                $sousemplacement = array(
//                    'id' => NULL,
//                    'name' => $state,
//                    'emplacement_id' => $emplacement['Emplacement']['id']
//                );
//                $this->Sousemplacement->save($sousemplacement);
////                debug($sousemplacement);
//            endforeach;
//        endforeach;
//        die();
//    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Sousemplacement->contain('Stock', 'Stock.Product', 'Sousemplacement');
            $sousemplacements = $this->Sousemplacement->find('all', array('order' => array('Sousemplacement.created DESC')));
            echo json_encode($sousemplacements);
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
            $this->Sousemplacement->save($data);
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Sousemplacement ajouté avec succès"),
                'LastId' => $this->Sousemplacement->getLastInsertID(),
                'status' => 200,
                'type' => 'success'
            ));
//            }
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
//            $this->Stock->contain('Sousemplacement', 'Emplacement', 'SousemplacementProduct', 'SousemplacementProduct.Fournisseur', 'SousemplacementProduct.Famille', 'SousemplacementProduct.Tva', 'SousemplacementProduct.Unite', 'SousemplacementProduct.Category');
            $this->Sousemplacement->id = $data['Sousemplacement']['id'];
            $sousemplacement = $this->Sousemplacement->read();
            if (!empty($sousemplacement)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $sousemplacement,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Sousemplacement non trouvé"),
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
            if ($this->Sousemplacement->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                        'text' => __("Sousemplacement modifié avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Sousemplacement->read();
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
            $this->Sousemplacement->delete($this->request->data['Sousemplacement']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Ce Sousemplacement a était supprimé avec succès"),
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

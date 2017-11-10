<?php

App::uses('AppController', 'Controller');

class LivreursController extends AppController {

    public $uses = array('Livreur', 'Historique', 'Ville', 'Commercial', 'PaymentsLivreur', 'Bon', 'Getby', 'User', 'Commande');

    public function beforeFilter() {
        parent::beforeFilter();
//        $this->Auth->allow('init_admin');
        $this->Auth->allow('recap_livreur', 'sendMessage', 'update_device', 'edit', 'view', 'delete', 'add_livreur', 'list_livreurs', 'commandes_recuperees', 'commandes_enattente', 'commandes_livrees', 'commandes_retours', 'commandes_annulees');
    }

    function test_notif() {
//        $this->sendMessage(207, "Une Commande vous a été affectée");
//        die();
    }

//    public function add_role() {
//        $role = array(
//            'Role' => array( 
//                'id' => null,
//                'name' => 'livreur',
//                'user_count' => 0
//            )
//        );
//        $this->Role->save($role);
//        die();
//    }
    // liste livreurs
    public function update_device() {
        if ($this->request->is(array('post','get','xhr'))) {
            $data = $this->request->data;
            if (!empty($data)) {
                $historique = array(
                    'id' => null,
                    'name' => 'update_device',
                    'operation' => 'mobile_playerid',
                    'user_id' => $data['Livreur']['id'],
                    'cause_operation' => $data['Livreur']['deviceID'],
                    'commande_id' => 0,
                );
                $this->Historique->save($historique);
            }
            $this->Livreur->id = $data['Livreur']['id'];
            $this->Livreur->saveField('deviceID', $data['Livreur']['deviceID']);
            http_response_code(200);
            die();
        }
        die();
    }

    public function recap_livreur() {
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $livreur_id = $data['Commande']['livreur_id'];
            $currentDate = $data['Commande']['currentDate'];
            $Recup = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $livreur_id, 'Commande.state' => 'Non Traitée')
            ));
            $toRecup = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $livreur_id, 'Commande.state' => 'En Cours', 'Commande.modified LIKE' => $currentDate . " %")
            ));
            $waitDone = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $livreur_id, 'Commande.state' => 'AttenteLivraison', 'Commande.date_livraison' => $currentDate)
            ));
            $dones = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $livreur_id, 'Commande.state' => 'Livrée', 'Commande.date_livraison' => $currentDate)
            ));
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'data' => array(
                    'Recup' => $Recup,
                    'toRecup' => $toRecup,
                    'waitDone' => $waitDone,
                    'dones' => $dones,
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

// liste livreurs
    public function list_livreurs() {
        header('Access-Control-Allow-Origin: *');
        $this->Livreur->recursive = -1;
        if ($this->request->is('post')) {
            $livreurs = $this->Livreur->find('all', array(
                'conditions' => array('Livreur.role_id' => $this->getRole('livreur')),
                'order' => array('Livreur.full_name ASC'),
            ));
            http_response_code(200);
            echo json_encode($livreurs);
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

// add livreur
    public function add_livreur() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $maxid = $this->Livreur->find('first', array(
            'fields' => 'MAX(Livreur.id) as id',
        ));
        $maxid = $maxid[0]['id'];
        $this->request->data['Livreur']['code'] = 'Livreur' . $maxid . date('Y');
        $this->request->data['Livreur']['role_id'] = $this->getRole('livreur');
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->Livreur->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Livreur ajouté avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// view user || client || livreurs
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Livreur->contain('Ville');
            $data = $this->request->data;
            $this->Livreur->id = $data['Livreur']['id'];
            $livreur = $this->Livreur->read();
            //password security
            $livreur['Livreur']['password'] = "";
            if (!empty($livreur)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $livreur,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                $this->response->statusCode(403);
                $this->response->body(json_encode(array(
                    'text' => __("Livreur non trouvé"),
                    'status' => 403,
                    'type' => 'success'
                )));
            }
            die();
        }
        die();
    }

    // edit user livreur
    function edit() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->Livreur->save($data['Livreur'])) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Livreur modifié avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Livreur->read();
            unset($this->request->data['Livreur']['password']);
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

    public function commandes_recuperees() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Livreur', 'Getby', 'User');
            $recuperees = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.com_id' => $data['Livreur']['user_id']
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $recuperees,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function commandes_enattente() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Livreur', 'Getby', 'User');
            $enattentes = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $data['Livreur']['user_id'],
                    'Commande.state' => 'AttenteLivraison'
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $enattentes,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function commandes_livrees() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Livreur', 'Getby', 'User');
            $livrees = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $data['Livreur']['user_id'],
                    'Commande.state' => 'Livrée'
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $livrees,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function commandes_retours() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Livreur', 'Getby', 'User');
            $retours = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $data['Livreur']['user_id'],
                    'Commande.state' => 'Retour'
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $retours,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function commandes_annulees() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Livreur', 'Getby', 'User');
            $annulations = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $data['Livreur']['user_id'],
                    'Commande.state' => 'Annulée'
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $annulations,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// delete livreur
    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Livreur->delete($this->request->data['Livreur']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Livreur supprimé avec succès"),
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

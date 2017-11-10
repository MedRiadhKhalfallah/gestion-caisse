<?php

App::uses('AppController', 'Controller');

/**
 * Commandes Controller
 *
 * @property Commande $Commande
 * @property PaginatorComponent $Paginator
 */
class TransporteursController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('annulee_paginate', 'retourexpediteur_paginate', 'ramassage_depot_paginate', 'recuperees_paginate', 'stocks_paginate', 'enattentelivraison_paginate', 'livree_paginate', 'retour_paginate', 'facturees_paginate');
    }

    public $uses = array('Avoir', 'Retour', 'Ramassage', 'ProductsStock', 'Historique', 'Sousemplacement', 'Emplacement', 'Commande', 'Chargement', 'Bon', 'Receiver', 'User', 'Facture', 'Presentoire', 'FactureProduct', 'PresentoireProduct', 'Product', 'Reglement', 'Unite', 'Stock', 'Commercial', 'Livreur', 'Payment');

// list commandes_retourexpediteur_paginate espqce client
    public function ramassage_depot_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => array('Non Traitée', 'Non Traitée depot'),
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => array('Non Traitée', 'Non Traitée depot'),
                    'Commande.user_id' => $data['Commande']['user_id']
                );
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesRamassageDepot' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// list commandes recupérer for custom user
    public function recuperees_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'En Cours',
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'En Cours',
                    'Commande.user_id' => $data['Commande']['user_id']
                );
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'clientCommandesRecuperee' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// list commandes recupérer for custom user
    public function stocks_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.isStock' => true,
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.isStock' => true,
                    'Commande.user_id' => $data['Commande']['user_id']
                );
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesEnStock' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // en cours de livraison
    public function enattentelivraison_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'AttenteLivraison',
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'AttenteLivraison',
                    'Commande.user_id' => $data['Commande']['user_id']);
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesAttLivraison' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // livrée
    public function livree_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Livrée',
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Livrée',
                    'Commande.user_id' => $data['Commande']['user_id']);
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesLivree' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // retour
    public function retour_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour',
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour',
                    'Commande.user_id' => $data['Commande']['user_id']);
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesRetour' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// list commandes_retourexpediteur_paginate espqce client
    public function retourexpediteur_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour Expéditeur',
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour Expéditeur',
                    'Commande.user_id' => $data['Commande']['user_id']
                );
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesRetourExpediteur' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list commande annulée espqce client
    public function annulee_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $countfacture = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isFacture' => TRUE),
                'order' => array('Commande.modified DESC')
            ));
            $countnotfacture = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isFacture' => FALSE),
                'order' => array('Commande.modified DESC')
            ));
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Annulée',
                    'Commande.user_id' => $data['Commande']['user_id'],
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "annuleactive") ? 'Commande.isAnnule = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "notfacture") ? 'Commande.isFacture = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "facturer") ? 'Commande.isFacture = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "enstock") ? 'Commande.isStock = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "horsstock") ? 'Commande.isStock = false' : '',
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Annulée',
                    'Commande.user_id' => $data['Commande']['user_id'],
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "annuleactive") ? 'Commande.isAnnule = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "notfacture") ? 'Commande.isFacture = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "facturer") ? 'Commande.isFacture = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "enstock") ? 'Commande.isStock = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "horsstock") ? 'Commande.isStock = false' : '',
                );
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesAnnulee' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'countfacture' => $countfacture,
                'countnotfacture' => $countnotfacture,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list commande facturees espqce client
    public function facturees_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
            $limit = 10;
            $commandesespaceclient = array();
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            $search = "";
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => array('Facturée', 'Retour Expéditeur'),
                    'Commande.user_id' => $data['Commande']['user_id'],
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => array('Facturée', 'Retour Expéditeur'),
                    'Commande.user_id' => $data['Commande']['user_id'],);
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['order'] = array('Commande.modified DESC');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            }
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'commandesFacturee' => $commandesespaceclient,
                    'pageCount' => $this->params['paging']
                ),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

}

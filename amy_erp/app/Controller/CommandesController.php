<?php

App::uses('AppController', 'Controller');

/**
 * Commandes Controller
 *
 * @property Commande $Commande
 * @property PaginatorComponent $Paginator
 */
class CommandesController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('enter_stock', 'all_commandes_for_client', 'commandes_avoir', 'generer_avoir', 'affecter_commandes_clients', 'recuperer_par_client_paginate', 'commandes_retourexpediteur_paginate', 'commandes_enstock_espaceclient_paginate', 'commandes_annulee_espaceclient_paginate', 'commandes_retour_espaceclient_paginate', 'list_commandes_facturees_paginate', 'commandes_livree_espaceclient_paginate', 'commandes_enattentelivraison_espaceclient_paginate', 'ramassages_par_client_paginate', 'modif_state_livree', 'list_ramassage_depot', 'view_bon_ramassage', 'list_impression', 'bon_ramassage', 'generer_bon_ramassage', 'attentes_ramassage', 'valide_commande_livreur', 'view_commandebarrecode_bonchargement', 'activer_reaffectation_annulation', 'validerattentelivraison', 'validerramassagemanu', 'view_commandebarrecode_stock', 'livreur_injoignable_call', 'max_id', 'encours_livreur', 'encours_in_client', 'recuperer_par_client', 'livreecommande', 'delete_espaceclient', 'bl_espacelivreur_client', 'enattentelivraison_espacelivreur_client', 'encours_espacelivreur_client', 'commandes_retourexpediteur', 'retourcommandeExpediteur', 'list_commandes_facturees', 'edit_transport', 'ramassages_par_client', 'validerannulecommande', 'generer_br_facture_achat', 'generer_facture_achat', 'view_bon_chargement', 'bon_chargement', 'generer_bon_chargement', 'commandes_enstock_espaceclient', 'validercommandebarrecode', 'view_commandebarrecode', 'commandes_retour_espaceclient', 'commandes_livree_espaceclient', 'commandes_annulee_espaceclient', 'commandes_enattentelivraison_espaceclient', 'enattentelivraison_espacelivreur', 'commandesclient_espacelivreur', 'livreur_valide_commande', 'commandes_encours_espaceclient', 'encours_espacelivreur', 'bl_espacelivreur', 'valide_commande', 'view_by_ref', 'commandes_espacelivreur', 'affecter_groupe_commercial', 'affecter_commercial', 'commandes_espaceclient', 'commandes_user', 'devis_user', 'add_commande_client', 'achats_finalisee_produit', 'ventes_finalisee_produit', 'last_mvm_produit', 'achats_produit', 'ventes_produit', 'facture_groupe', 'index', 'index_achat', 'index_demande_prix', 'index_bon_reception', 'add', 'add_achat', 'edit_achat', 'confirm_achat', 'prime_commercial', 'config', 'view', 'edit', 'delete', 'commandes_finalisee', 'delete_bon', 'show_reglement', 'passerReglement', 'index_user', 'generer_facture', 'index_commerciale');
    }

    public $uses = array('Avoir', 'Retour', 'Ramassage', 'ProductsStock', 'Historique', 'Sousemplacement', 'Emplacement', 'Commande', 'Chargement', 'Bon', 'Receiver', 'User', 'Facture', 'Presentoire', 'FactureProduct', 'PresentoireProduct', 'Product', 'Reglement', 'Unite', 'Stock', 'Commercial', 'Livreur', 'Payment');
    
    public function max_id() {
        $this->Commande->recursive = -1;
        $max_id = $this->Commande->find('first', array(
            'fields' => array('MAX(Commande.id) AS id', '*')));
        if (!empty($max_id)) {
            $commande_maxID = $this->Commande->find('first', array(
                'conditions' => array('Commande.id' => $max_id[0])
            ));
            debug($commande_maxID);
            $ref = explode('-', $commande_maxID['Commande']['ref']);
            debug($ref[2]);
        }
//        $commande_maxIDCreated = $this->Commande->find('first', array(
//            'order' => array('Commande.created DESC')
//        ));
//        debug($commande_maxIDCreated);
        die();
    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Commande', 'Commande.state <>' => 'Finalisée'),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            echo json_encode($commandes);
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

    public function bon_chargement() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $chargements = $this->Chargement->find('all', array(
                'conditions' => array('Chargement.type' => 'Chargement'),
                'order' => array('Chargement.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $chargements,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function bon_ramassage() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $ramassages = $this->Ramassage->find('all', array(
                'conditions' => array('Ramassage.type' => 'Ramassage', 'Ramassage.user_id' => $this->request->data['Ramassage']['user_id']),
                'order' => array('Ramassage.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $ramassages,
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
//        die();
    }

    // list commande d'achat
    public function index_achat() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state <>' => 'Finalisée', 'Commande.isDemandeprix' => 0),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode($commandes);
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

    // list commande costom commercial espqce livreur
    public function commandes_espaceclient() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            debug($this->request->data); die();
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $commandesespaceclientcount = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $commandesespaceclientcount,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list commandes retournées à l'expediteur
    public function commandes_retourexpediteur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            debug($this->request->data); die();
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesexpediteur = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour Expéditeur'),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour Expéditeur'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesexpediteur,
                'count' => $count,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// list commandes_retourexpediteur_paginate espqce client
    public function commandes_retourexpediteur_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
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
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour Expéditeur');
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
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

    // list commande espqce client
//    public function commandes_espaceclient() {
//        $this->autoRender = false;
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
////        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            debug($this->request->data);
//            die();
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur');
//            $commandesespaceclient = $this->Commande->find('all', array(
//                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
//                'order' => array('Commande.modified DESC')
//            ));
//            http_response_code(200);
////            echo json_encode($commandesespaceclient);
//            echo json_encode(array(
//                'data' => $commandesespaceclient,
//                'status' => 200,
//                'type' => 'success'
//            ));
//            die();
//        }
////        http_response_code(403);
////        echo json_encode(array(
////            'text' => __("Not Allowed To Access"),
////            'status' => 403,
////            'type' => 'error'
////        ));
////        die();
//    }
    // list commande espqce client
    public function commandes_enstock_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.isStock' => 1),
                'order' => array('Commande.modified DESC')
            ));
            $countwaitdone = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En stock', 'Commande.isStock' => 1)
            ));
            $countwaitcancel = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isStock' => 1)
            ));
            $countwaitback = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour', 'Commande.isStock' => 1)
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'countwaitdone' => $countwaitdone,
                'countwaitcancel' => $countwaitcancel,
                'countwaitback' => $countwaitback,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function commandes_enstock_espaceclient_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $countwaitdone = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En stock', 'Commande.isStock' => 1)
            ));
            $countwaitcancel = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isStock' => 1)
            ));
            $countwaitback = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour', 'Commande.isStock' => 1)
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
                    'Commande.isStock' => 1,
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('Bon', 'User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Getby', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.isStock' => 1);
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
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
                'countwaitdone' => $countwaitdone,
                'countwaitcancel' => $countwaitcancel,
                'countwaitback' => $countwaitback,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list commande espqce client
    public function commandes_encours_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours', 'Commande.type_remettre' => 'Ramassage'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'status' => 200,
                'type' => 'success'
            ));
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

    // list commande récupérées par client 
    public function encours_in_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesencours = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours', 'Commande.type_remettre' => 'Ramassage', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesencours,
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
//        die();
    }

    // list commande livrée espqce client
    public function commandes_livree_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Livrée'),
                'order' => array('Commande.modified DESC')
            ));
            $countcommandes = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Livrée'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $countcommandes,
                'status' => 200,
                'type' => 'success'
            ));
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

    // list commande livrée espqce client
    public function commandes_livree_espaceclient_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
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
                    'Commande.state' => 'Livrée',
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville.name', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Livrée');
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
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

    // list commande retour espqce client
    public function commandes_retour_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour'),
                'order' => array('Commande.modified DESC')
            ));
            $countcommandes = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $countcommandes,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function commandes_retour_espaceclient_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $data = $this->request->data;
//            debug($data);
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
                    (!empty($data['Commande']['etatRetoure']) && $data['Commande']['etatRetoure'] === "enstock") ? 'Commande.isStock = true' : '',
                    (!empty($data['Commande']['etatRetoure']) && $data['Commande']['etatRetoure'] === "horsstock") ? 'Commande.isStock = false' : '',
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Retour',
                    (!empty($data['Commande']['etatRetoure']) && $data['Commande']['etatRetoure'] === "enstock") ? 'Commande.isStock = true' : '',
                    (!empty($data['Commande']['etatRetoure']) && $data['Commande']['etatRetoure'] === "horsstock") ? 'Commande.isStock = false' : '',
                );
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
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

    // list commande annulée espqce client
    public function commandes_annulee_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée'),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée'),
                'order' => array('Commande.modified DESC')
            ));
            $countfacture = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isFacture' => TRUE),
                'order' => array('Commande.modified DESC')
            ));
            $countnotfacture = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isFacture' => FALSE),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $count,
                'countfacture' => $countfacture,
                'countnotfacture' => $countnotfacture,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function commandes_annulee_espaceclient_paginate() {
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
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'Annulée',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "annuleactive") ? 'Commande.isAnnule = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "notfacture") ? 'Commande.isFacture = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "facturer") ? 'Commande.isFacture = false' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "enstock") ? 'Commande.isStock = true' : '',
                    (!empty($data['Commande']['etatFacture']) && $data['Commande']['etatFacture'] === "horsstock") ? 'Commande.isStock = false' : '',
                );
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
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
    public function list_commandes_facturees() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Facturée', 'Retour Expéditeur')),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Facturée', 'Retour Expéditeur')),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $count,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function list_commandes_facturees_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
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
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => array('Facturée', 'Retour Expéditeur'));
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['contain'] = array('User', 'Receiver', 'Receiver.Ville', 'User.Ville', 'Livreur');
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
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

    // list commande espqce client
    public function commandes_enattentelivraison_espaceclient() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'AttenteLivraison'),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'AttenteLivraison'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'count' => $count,
                'status' => 200,
                'type' => 'success'
            ));
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

    // list commande espqce client
    public function commandes_enattentelivraison_espaceclient_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
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
                    'Commande.state' => 'AttenteLivraison',
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(Commande.ref) like '%" . $search . "%' or "
                    . "lower(Commande.created) like '%" . $search . "%' or "
                    . "lower(Commande.date_livraison) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array(
                    //User Model
                    'User.id',
                    'User.nom_commercial',
                    'User.raison_social',
                    'User.first_name',
                    'User.last_name',
                    'User.full_name',
                    'User.adress',
                    'User.Ville.name',
                    //Receiver Model
                    'Receiver.id',
                    'Receiver.full_name',
                    'Receiver.adresse',
                    'Receiver.Ville.name',
                    //Livreur Model
                    'Livreur.id',
                    'Livreur.first_name',
                    'Livreur.last_name',
                    'Livreur.full_name'
                );
//                $this->Paginator->settings['fields'] = array(
//                    'Commande.id',
//                    'Commande.ref',
//                    'Commande.state',
//                    'Commande.countRetour',
//                    'Commande.isStock',
//                    'Commande.date_livraison',
//                    'Commande.created',
//                    'Commande.modified',
//                    'Commande.user_id',
//                    'Commande.receiver_id',
//                    'Commande.livreur_id',
//                );

                $this->Paginator->settings['limit'] = $limit;
                $commandesespaceclient = $this->paginate('Commande');
            } else {
                $filters = array(
                    'Commande.type' => 'Transport',
                    'Commande.state' => 'AttenteLivraison');
                if (!empty($data['Commande']['user_id'])) {
                    $filters['Commande.user_id'] = $data['Commande']['user_id'];
                }
                if (!empty($data['Commande']['livreur_id'])) {
                    $filters['Commande.livreur_id'] = $data['Commande']['livreur_id'];
                }
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'Commande.modified DESC';
                $this->Paginator->settings['contain'] = array(
                    //User Model
                    'User.id',
                    'User.nom_commercial',
                    'User.raison_social',
                    'User.first_name',
                    'User.last_name',
                    'User.full_name',
                    'User.adress',
                    'User.Ville.name',
                    //Receiver Model
                    'Receiver.id',
                    'Receiver.full_name',
                    'Receiver.adresse',
                    'Receiver.Ville.name',
                    //Livreur Model
                    'Livreur.id',
                    'Livreur.first_name',
                    'Livreur.last_name',
                    'Livreur.full_name'
//                    'Livreur.full_name' => 'CONCAT(Livreur.first_name, " ", Livreur.last_name)'
                );
//                $this->Paginator->settings['fields'] = array(
//                    'Commande.id',
//                    'Commande.ref',
//                    'Commande.state',
//                    'Commande.countRetour',
//                    'Commande.isStock',
//                    'Commande.date_livraison',
//                    'Commande.created',
//                    'Commande.modified',
//                    'Commande.user_id',
//                    'Commande.receiver_id',
//                    'Commande.livreur_id',
//                );
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

    // list commande costom commercial espqce livreur
    public function commandes_espacelivreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
//            debug($this->request->data['Commande']['livreur_id']); die();
            $commandescommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Non Traitée'),
                'order' => array('Commande.created DESC')
            ));
            if (!empty($commandescommercials)) {
                $clientsID = $this->Commande->find('list', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Non Traitée'),
                    'order' => array('Commande.modified DESC'),
                    'fields' => array('Commande.user_id')
                ));
                $clientscommercials = $this->User->find('all', array(
                    'conditions' => array('User.id IN' => $clientsID)
                ));
                http_response_code(200);
                echo json_encode(array(
                    'data' => $clientscommercials,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas de commandes'),
                    'status' => 200,
                    'type' => 'error'
                ));
                die();
            }
        }
    }

    // list commande costom commercial espqce livreur
    public function ramassages_par_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot')),
                'order' => array('Commande.modified DESC')
            ));
            $clientsID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot')),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            $countcommandes = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'))
            ));
//            //debug($clientsID); 
            $countcommandesaffectees = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => 'Non Traitée', 'Commande.livreur_id <>' => 0)
            ));
            $countcommandesnotaffectees = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.livreur_id' => 0)
            ));
            $clientscommercials = $this->User->find('all', array(
                'conditions' => array('User.id IN' => $clientsID)
            ));
            $countclients = $this->User->find('count', array(
                'conditions' => array('User.id IN' => $clientsID)
            ));
            $clientsNotAffectID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.livreur_id' => 0),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            $clientsNotAffectcommercials = $this->User->find('all', array(
                'conditions' => array('User.id IN' => $clientsNotAffectID)
            ));
            // count commandes ramassage et depot
            $countRamassage = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.type_remettre' => 'Ramassage')
            ));
            $countDepot = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.type_remettre' => 'Depot')
            ));
//            //debug($clientsID);
//            debug($clientscommercials);
//            die();
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $clientscommercials,
                'dataNotAffect' => $clientsNotAffectcommercials,
                'countclients' => $countclients,
                'countcommandes' => $countcommandes,
                'countcommandesaffectees' => $countcommandesaffectees,
                'countcommandesnotaffectees' => $countcommandesnotaffectees,
                'countcommandes' => $countcommandes,
                'countRamassage' => $countRamassage,
                'countDepot' => $countDepot,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    function getLastQuery() {
        $dbo = ConnectionManager::getDataSource('default');
        $logs = $dbo->getLog();
        $lastLog = end($logs['log']);
        return $lastLog['query'];
    }

    // attente ramassage ou dépôt paginate
    public function ramassages_par_client_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $clientsID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot')),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            $data = $this->request->data;
            $clientscommercials = array();
            $filters = array();
            $limit = 10;

            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    "User.id IN" => $clientsID,
                    "lower(User.first_name) like '%" . $search . "%' or "
                    . "lower(User.last_name) like '%" . $search . "%' or "
                    . "lower(User.raison_social) like '%" . $search . "%' or "
                    . "lower(User.nom_commercial) like '%" . $search . "%' or "
                    . "lower(User.email) like '%" . $search . "%' or "
                    . "lower(User.adress) like '%" . $search . "%' or "
                    . "lower(User.phone) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'User.created DESC';
                $this->Paginator->settings['contain'] = array('Ville.id', 'Ville.name');
                $this->Paginator->settings['fields'] = array(
                    'User.id',
                    'User.first_name',
                    'User.last_name',
                    'User.adress',
                    'User.email',
                    'User.phone',
                    'User.nom_commercial',
                    'User.raison_social',
                    'User.frais_annulation',
                    'User.frais_livraison',
                    'User.ville_id',
                );
                $this->Paginator->settings['limit'] = $limit;
                $clientscommercials = $this->paginate('User');
            } else {
                if (!empty($data['Commande']['ville_id'])) {
                    $this->Paginator->settings['paramType'] = 'querystring';
                    $this->Paginator->settings['conditions'] = array(
                        'User.id IN' => $clientsID,
                        'User.ville_id' => $data['Commande']['ville_id']);
                    $this->Paginator->settings['order'] = 'User.created DESC';
                    $this->Paginator->settings['fields'] = array(
                        'User.id',
                        'User.first_name',
                        'User.last_name',
                        'User.adress',
                        'User.email',
                        'User.phone',
                        'User.nom_commercial',
                        'User.raison_social',
                        'User.frais_annulation',
                        'User.frais_livraison',
                        'User.ville_id',
                    );
                    $this->Paginator->settings['limit'] = $limit;
                    $clientscommercials = $this->paginate('User');
                } else {
                    $this->Paginator->settings['paramType'] = 'querystring';
                    $this->Paginator->settings['contain'] = array('Ville.id', 'Ville.name');
                    $this->Paginator->settings['conditions'] = array('User.id IN' => $clientsID);
                    $this->Paginator->settings['order'] = 'User.created DESC';
                    $this->Paginator->settings['fields'] = array(
                        'User.id',
                        'User.first_name',
                        'User.last_name',
                        'User.adress',
                        'User.email',
                        'User.phone',
                        'User.nom_commercial',
                        'User.raison_social',
                        'User.frais_annulation',
                        'User.frais_livraison',
                        'User.ville_id',
                    );
                    $this->Paginator->settings['limit'] = $limit;
                    $clientscommercials = $this->paginate('User');
                }
            }
            $clientsNotAffectcommercials = array();
            $clientsNotAffectID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.livreur_id' => 0),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            if (!empty($clientsNotAffectID)) {
                $clientsNotAffectcommercials = $this->User->find('all', array(
                    'conditions' => array('User.id IN' => $clientsNotAffectID),
                    'recursive' => -1,
                    'fields' => array('User.id', 'User.raison_social', 'User.nom_commercial'),
                ));
            }
            /**
             * List counter !
             */
            $countclients = $this->User->find('count', array(
                'conditions' => array('User.id IN' => $clientsID)
            ));
            $countcommandes = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'))
            ));
//            debug($clientsID); 
            $countcommandesaffectees = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => 'Non Traitée', 'Commande.livreur_id <>' => 0)
            ));
            $countcommandesnotaffectees = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.livreur_id' => 0)
            ));
            // count commandes ramassage et depot
            $countRamassage = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.type_remettre' => 'Ramassage')
            ));
            $countDepot = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.type_remettre' => 'Depot')
            ));
            $this->User->Ville->recursive = -1;
            $villes = $this->User->Ville->find('all');
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
//                    'clients' => $clientscommercials,
//                    'countPage' => $this->params['paging']
                    'commandesRamassageDepot' => $clientscommercials,
                    'pageCount' => $this->params['paging']
                ),
                'villes' => $villes,
                'dataNotAffect' => $clientsNotAffectcommercials,
                'countclients' => $countclients,
                'countcommandes' => $countcommandes,
                'countcommandesaffectees' => $countcommandesaffectees,
                'countcommandesnotaffectees' => $countcommandesnotaffectees,
                'countcommandes' => $countcommandes,
                'countRamassage' => $countRamassage,
                'countDepot' => $countDepot,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list client commandes transporteur
    public function all_commandes_for_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User');
            $clientsID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport'),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            $this->User->recursive = -1;
            $clientscommercials = $this->User->find('all', array(
                'conditions' => array('User.id IN' => $clientsID)
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $clientscommercials,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // list commande recupérées par client
    public function recuperer_par_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours'),
                'order' => array('Commande.modified DESC')
            ));
            if (!empty($commandesespaceclient)) {
                $clientsID = $this->Commande->find('list', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours'),
                    'order' => array('Commande.modified DESC'),
                    'fields' => array('Commande.user_id')
                ));
                $this->User->contain('Ville');
                $clientsencours = $this->User->find('all', array(
                    'conditions' => array('User.id IN' => $clientsID)
                ));
                // count client for commande récupérer 
                $countclients = $this->User->find('count', array(
                    'conditions' => array('User.id IN' => $clientsID)
                ));
                // count commandes récupérées
                $countcommandes = $this->Commande->find('count', array(
                    'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => 'En Cours')
                ));
                http_response_code(200);
                echo json_encode(array(
                    'data' => $clientsencours,
                    'count' => $countcommandes,
                    'countclient' => $countclients,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas de commandes'),
                    'status' => 200,
                    'type' => 'error'
                ));
                die();
            }
        }
    }

// attente recuperer_par_client paginate
    public function recuperer_par_client_paginate() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $clientsID = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours'),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.user_id')
            ));
            // count commandes récupérées
            $countcommandes = $this->Commande->find('count', array(
                'conditions' => array('User.id IN' => $clientsID, 'Commande.state' => 'En Cours')
            ));
            $data = $this->request->data;
            $clientscommercials = array();
            $filters = array();
            $limit = 10;
            if (!empty($data['Commande']['limit'])) {
                $limit = $data['Commande']['limit'];
            }
            if (!empty($data['Commande']['searchKey'])) {
                $search = $data['Commande']['searchKey'];
                $filters = array(
                    "User.id IN" => $clientsID,
//                    "User.ville_id IN" => array($data['Commande']['ville_id']),
                    "lower(User.first_name) like '%" . $search . "%' or "
                    . "lower(User.last_name) like '%" . $search . "%' or "
                    . "lower(User.raison_social) like '%" . $search . "%' or "
                    . "lower(User.nom_commercial) like '%" . $search . "%' or "
                    . "lower(User.email) like '%" . $search . "%' or "
                    . "lower(User.adress) like '%" . $search . "%' or "
                    . "lower(User.phone) like '%" . $search . "%'");
                $this->Paginator->settings['paramType'] = 'querystring';
                $this->Paginator->settings['conditions'] = $filters;
                $this->Paginator->settings['order'] = 'User.created DESC';
                $this->Paginator->settings['contain'] = array('Ville.id', 'Ville.name');
                $this->Paginator->settings['limit'] = $limit;
                $clientscommercials = $this->paginate('User');
            } else {
                if (!empty($data['Commande']['ville_id'])) {
                    $this->Paginator->settings['paramType'] = 'querystring';
                    $this->Paginator->settings['conditions'] = array(
                        'User.id IN' => $clientsID,
                        'User.ville_id' => $data['Commande']['ville_id']);
                    $this->Paginator->settings['order'] = 'User.created DESC';
                    $this->Paginator->settings['contain'] = array('Ville.id', 'Ville.name');
                    $this->Paginator->settings['limit'] = $limit;
                    $clientscommercials = $this->paginate('User');
                } else {
                    $this->Paginator->settings['paramType'] = 'querystring';
                    $this->Paginator->settings['conditions'] = array('User.id IN' => $clientsID);
                    $this->Paginator->settings['order'] = 'User.created DESC';
                    $this->Paginator->settings['contain'] = array('Ville.id', 'Ville.name');
                    $this->Paginator->settings['limit'] = $limit;
                    $clientscommercials = $this->paginate('User');
                }
            }
            $this->User->Ville->recursive = -1;
            $villes = $this->User->Ville->find('all');
            http_response_code(200);
            echo json_encode(array(
                'data' => array(
                    'clientCommandesRecuperee' => $clientscommercials,
                    'pageCount' => $this->params['paging']
                ),
                'villes' => $villes,
                'count' => $countcommandes,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

//    // list commande costom commercial espqce livreur
//    public function commandes_espacelivreur() {
//        $this->autoRender = false;
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
//        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial');
//            $commandescommercials = $this->Commande->find('all', array(
//                'conditions' => array('Commande.type' => 'Transport', 'Commande.commerciale_id' => $this->request->data['Commande']['commerciale_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Non Traitée'),
//                'order' => array('Commande.created DESC')
//            ));
//            $clientsID = $this->Commande->find('list', array(
//                'conditions' => array('Commande.type' => 'Transport', 'Commande.commerciale_id' => $this->request->data['Commande']['commerciale_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Non Traitée'),
//                'order' => array('Commande.modified DESC'),
//                'fields' => array('Commande.user_id')
//            ));
//            $clientscommercials = $this->User->find('all', array(
//                'conditions' => array('User.id IN' => $clientsID)
//            ));
////            //debug($clientsID);
////            debug($clientscommercials);
////            die();
//            http_response_code(200);
////            echo json_encode($commandesespaceclient);
//            echo json_encode(array(
//                'data' => $clientscommercials,
//                'status' => 200,
//                'type' => 'success'
//            ));
//            die();
//        }
//    }
    // list commande costom commercial and client espqce livreur
    public function commandesclient_espacelivreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $commandescommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Non Traitée', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandescommercials,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // commande attentes ramassage for user espace client
    public function attentes_ramassage() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Non Traitée', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
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
//        die();
    }

    // list bl costom commercial espqce livreur
    public function bl_espacelivreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $blscommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Livrée'),
                'order' => array('Commande.created DESC')
            ));
            if (!empty($this->request->data['Commande']['currentDate'])) {
                $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
                $blscommercials = $this->Commande->find('all', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.date_livraison' => $this->request->data['Commande']['currentDate'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Livrée'),
                    'order' => array('Commande.created DESC')
                ));
            }
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $blscommercials,
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
//        die();
    }

    // list bl costom commercial espqce livreur
    public function bl_espacelivreur_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $blscommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.receiver_id' => $this->request->data['Commande']['receiver_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'Livrée'),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $blscommercials,
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
//        die();
    }

    // list commande en cours costom commercial espqce livreur
    public function encours_espacelivreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $encourscommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'En Cours'),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $encourscommercials,
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
//        die();
    }

    // list commande en cours costom commercial espqce livreur
    public function encours_livreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $encourscommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'En Cours'),
                'order' => array('Commande.created DESC')
            ));
            if (!empty($this->request->data['Commande']['currentDate'])) {
                $encourscommercials = $this->Commande->find('all', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.modified LIKE' => $this->request->data['Commande']['currentDate'] . " %", 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'En Cours'),
                    'order' => array('Commande.created DESC')
                ));
            }
            if (!empty($encourscommercials)) {
                $clientsID = $this->Commande->find('list', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours', $this->request->data['Commande']['livreur_id']),
                    'order' => array('Commande.modified DESC'),
                    'fields' => array('Commande.user_id')
                ));
                $this->User->contain('Ville');
                $clientsencours = $this->User->find('all', array(
                    'conditions' => array('User.id IN' => $clientsID)
                ));
                http_response_code(200);
                echo json_encode(array(
                    'data' => $clientsencours,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas de commandes récupérées'),
                    'status' => 200,
                    'type' => 'error'
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
//        die();
    }

    // list commande en cours costom commercial espqce livreur
    public function encours_espacelivreur_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $encourscommercials = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.user_id' => $this->request->data['Commande']['user_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'En Cours'),
                'order' => array('Commande.created DESC')
            ));
            if (!empty($this->request->data['Commande']['currentDate'])) {
                $encourscommercials = $this->Commande->find('all', array(
                    'conditions' => array('Commande.type' => 'Transport', 'Commande.modified LIKE' => $this->request->data['Commande']['currentDate'] . " %", 'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'], 'Commande.user_id' => $this->request->data['Commande']['user_id'], 'Commande.type_remettre' => 'Ramassage', 'Commande.state' => 'En Cours'),
                    'order' => array('Commande.created DESC')
                ));
            }
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $encourscommercials,
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
//        die();
    }

    // list commande en attente de livraison costom commercial espqce livreur
    public function enattentelivraison_espacelivreur() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $date1 = date('Y-m-d 00:00:00');
            $date2 = date('Y-m-d 23:59:59');
            $encourscommercials = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'],
                    'Commande.state' => 'AttenteLivraison',
                    "Commande.date_livraison BETWEEN '$date1' AND '$date2'",
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $encourscommercials,
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
//        die();
    }

    // list commande en attente de livraison costom commercial espqce livreur par client
    public function enattentelivraison_espacelivreur_client() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Livreur', 'Historique', 'Historique.User');
            $date1 = date('Y-m-d 00:00:00');
            $date2 = date('Y-m-d 23:59:59');
            $encourscommercials = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.livreur_id' => $this->request->data['Commande']['livreur_id'],
                    'Commande.receiver_id' => $this->request->data['Commande']['receiver_id'],
                    'Commande.state' => 'AttenteLivraison',
                    "Commande.date_livraison BETWEEN '$date1' AND '$date2'",
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandesespaceclient);
            echo json_encode(array(
                'data' => $encourscommercials,
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
//        die();
    }

    //Liste commandes achats/produit
    public function achats_produit($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $commandesAchats = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state <>' => 'Finalisée', 'Commande.isDemandeprix' => false),
                'order' => array('Commande.created DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $cmds_ids_achats = array();
            foreach ($commandesAchats as $idc => $cmd):
                array_push($cmds_ids_achats, $idc);
            endforeach;
            $this->Bon->recursive = -1;
            $bons = $this->Bon->find('list', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id IN' => $cmds_ids_achats
                ),
                'fields' => array('Bon.id', 'Bon.commande_id')
            ));
            $this->Commande->contain('Bon', 'Fournisseur', 'Commercial');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.id IN' => $bons)
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandes,
                'status' => 200,
                'type' => 'success'
            ));
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

    //Liste commandes ventes/produit
    public function ventes_produit($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $commandesVentes = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Commande', 'Commande.state <>' => 'Finalisée'),
                'order' => array('Commande.created DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $cmds_ids_ventes = array();
            foreach ($commandesVentes as $idc => $cmd):
                array_push($cmds_ids_ventes, $idc);
            endforeach;
            $this->Bon->recursive = -1;
            $bons = $this->Bon->find('first', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id IN' => $cmds_ids_ventes
                ),
                'fields' => array('Bon.id', 'Bon.commande_id')
            ));
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.id IN' => $bons)
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandes,
                'status' => 200,
                'type' => 'success'
            ));
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

    //last movm produit (ventes, achats)
    public function last_mvm_produit($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            // ventes 
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandesVente = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $bonsventes = $this->Bon->find('list', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id' => $commandesVente
                ),
                'fields' => array('Bon.id', 'Bon.commande_id'),
                'order' => array('Bon.modified DESC')
            ));
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandes_ventes = $this->Commande->find('first', array(
                'conditions' => array('Commande.id' => $bonsventes),
                'order' => array('Commande.modified DESC')
            ));
            // achats
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandesAchat = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.modified DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $this->Commande->contain('Bon', 'Fournisseur', 'Commercial');
            $bonsachats = $this->Bon->find('list', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id' => $commandesAchat
                ),
                'fields' => array('Bon.id', 'Bon.commande_id'),
                'order' => array('Bon.modified DESC')
            ));
            $this->Commande->contain('Bon', 'Fournisseur', 'Commercial');
            $commandes_achats = $this->Commande->find('first', array(
                'conditions' => array('Commande.id' => $bonsachats),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'dataventes' => $commandes_ventes,
                'dataachats' => $commandes_achats,
                'status' => 200,
                'type' => 'success'
            ));
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

    //Liste commandes finalisées achats/produit
    public function achats_finalisee_produit($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $commandesAchats = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.created DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $cmds_ids_achats = array();
            foreach ($commandesAchats as $idc => $cmd):
                array_push($cmds_ids_achats, $idc);
            endforeach;
            $this->Bon->recursive = -1;
            $bons = $this->Bon->find('list', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id IN' => $cmds_ids_achats
                ),
                'fields' => array('Bon.id', 'Bon.commande_id')
            ));
//            debug($commandesAchats);
//            debug($bons);
//            die();
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.id IN' => $bons)
            ));
            http_response_code(200);
            echo json_encode(array(
                'achats' => $commandes,
                'status' => 200,
                'type' => 'success'
            ));
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

    //Liste commandes finalisées ventes/produit
    public function ventes_finalisee_produit($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $commandesVentes = $this->Commande->find('list', array(
                'conditions' => array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.created DESC'),
                'fields' => array('Commande.id', 'Commande.id')
            ));
            $cmds_ids_ventes = array();
            foreach ($commandesVentes as $idc => $cmd):
                array_push($cmds_ids_ventes, $idc);
            endforeach;
            $this->Bon->recursive = -1;
            $bons = $this->Bon->find('list', array(
                'conditions' => array(
                    'Bon.product_id' => $id, 'Bon.commande_id IN' => $cmds_ids_ventes
                ),
                'fields' => array('Bon.id', 'Bon.commande_id')
            ));
//            debug($commandesVentes);
//            debug($bons);
//            die();
            $this->Commande->contain('Bon', 'User', 'Commercial');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.id IN' => $bons)
            ));
            http_response_code(200);
            echo json_encode(array(
                'ventes' => $commandes,
                'status' => 200,
                'type' => 'success'
            ));
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

// list commande d'achat
    public function index_demande_prix() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state <>' => 'Finalisée', 'Commande.isDemandeprix' => 1),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            echo json_encode($commandes);
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

    public function index_bon_reception() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Achat', 'Commande.state' => 'Finalisée'),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
//            echo json_encode($commandes);
            echo json_encode(array(
                'data' => $commandes,
                'status' => 200,
                'type' => 'error'
            ));
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

    public function list_impression() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.id IN' => $this->request->data['Commande']),
                'order' => array('Commande.modified DESC')
            ));
            if (!empty($commandes)) {
                http_response_code(200);
                echo json_encode(array(
                    'data' => $commandes,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas de commandes'),
                    'status' => 200,
                    'type' => 'error'
                ));
            }
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function list_ramassage_depot() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville', 'Commercial', 'Getby', 'Livreur', 'Historique', 'Historique.User');
            $commandesespaceclient = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot')),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'status' => 200,
                'type' => 'success'
            ));
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

    public function add_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        $this->Commande->recursive = -1;
        $count = $this->Commande->find('count', array(
            'conditions' => array('Commande.type' => 'achat')
        ));
        $data = $this->request->data;
//        debug($data); die();
        if ($data['Commande']['isDemandeprix'] == 0) {
            $this->request->data['Commande']['ref'] = "Commande-achat-" . date('d') . date('m') . date('y') . "-" . ($count + 1);
        } else {
            $this->request->data['Commande']['ref'] = "Demande-prix-" . date('d') . date('m') . date('y') . "-" . ($count + 1);
        }
        $this->request->data['Commande']['type'] = 'Achat';
//        $this->request->data['Commande']['commerciale_id'] = $this->Commande['User']['commerciale_id'];
        $this->request->data['Commande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        $this->request->data['Commande']['avoir'] = 0;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            if ($this->Commande->save($data)) {
                $last_id = $this->Commande->getLastInsertID();
//                $this->Commande->saveField('commerciale_id', $this->Commande->read()['User']['commerciale_id']);
                foreach ($data['Bon'] as $bon):
                    $bon['id'] = null;
                    $bon['commande_id'] = $last_id;
                    $this->Bon->save($bon);
                endforeach;
//                if (!empty($data['Notification'])) {
//                    foreach ($data['Notification'] as $notif):
////                        if (!empty($notif['msg'])) {
//                        $notifToSave = array(
//                            'id' => null,
//                            'product_id' => $notif['product_id'],
//                            'msg' => $notif['msg'],
//                            'lvl' => $notif['lvl'],
//                        );
////                        }
//                        $this->Notification->save($notifToSave);
//                    endforeach;
//                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande Achat passée avec succès"),
                    'lastId' => $this->Commande->getLastInsertID(),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function edit_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            if ($this->Commande->save($data)) {
                foreach ($data['Bon'] as $bon):
                    if ($bon['bon_id'] != 0) {
                        $bon['id'] = $bon['bon_id'];
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    } else {
                        $bon['id'] = null;
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    }
                endforeach;
//                if (!empty($data['Notification'])) {
//                    foreach ($data['Notification'] as $notif):
////                        if (!empty($notif['msg'])) {
//                        $notifToSave = array(
//                            'id' => null,
//                            'product_id' => $notif['product_id'],
//                            'msg' => $notif['msg'],
//                            'lvl' => $notif['lvl'],
//                        );
////                        }
//                        $this->Notification->save($notifToSave);
//                    endforeach;
//                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande Achat modifiée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    function edit_transport() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commandeuser = $this->Commande->read()['Commande'];
            if ($this->Commande->saveField('mantant', $this->request->data['Commande']['mantant'])) {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandeuser['user_id'],
                        'operation' => 'Modification CR',
                        'cause_operation' => NULL,
                        'montant' => $this->request->data['Commande']['mantant']
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande mis à jour avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Commande->read();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

    // affecter commande à une commande 
    public function affecter_commercial() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data); die();
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            $user_id = $this->Commande->read()['Commande']['user_id'];
            $emplacement_id = $this->Emplacement->find('first', array(
                'conditions' => array('Emplacement.name' => ucfirst(strtolower(trim($commande['Receiver']['Ville']['name']))))
            ));
            if (!empty($emplacement_id)) {
                if ($commande['Commande']['state'] === "Annulée") {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'Annulation',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                        ));
                        $this->Product->recursive = -1;
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
                        if (!empty($ifExistProductsStock)) {
                            $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                            if (!empty($productsstock_id)) {
                                $this->ProductsStock->delete($productsstock_id);
                            }
                        }
                        if (!empty($ifExistProduct)) {
                            $product_id = $ifExistProduct['Product']['id'];
                            if (!empty($product_id)) {
                                $this->Product->delete($product_id);
                            }
                        }
                    }
                } else if ($commande['Commande']['state'] === "Retour") {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'Retour',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                        ));
                        $this->Product->recursive = -1;
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
                        if (!empty($ifExistProductsStock)) {
                            $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                            if (!empty($productsstock_id)) {
                                $this->ProductsStock->delete($productsstock_id);
                            }
                        }
                        if (!empty($ifExistProduct)) {
                            $product_id = $ifExistProduct['Product']['id'];
                            if (!empty($product_id)) {
                                $this->Product->delete($product_id);
                            }
                        }
                    }
                } else {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'En attente livraison',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                        ));
                        $this->Product->recursive = -1;
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
                        if (!empty($ifExistProductsStock)) {
                            $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                            if (!empty($productsstock_id)) {
                                $this->ProductsStock->delete($productsstock_id);
                            }
                        }
                        if (!empty($ifExistProduct)) {
                            $product_id = $ifExistProduct['Product']['id'];
                            if (!empty($product_id)) {
                                $this->Product->delete($product_id);
                            }
                        }
                    }
                }
            }
            $this->Commande->id = $data['Commande']['id'];
            $commandelivree = $this->Commande->read()['Commande'];
            $statelivree = $commandelivree['state'];
//            debug($statelivree); die();
            if ($this->Commande->save($data)) {
                $id = $this->request->data['Commande']['id'];
                $this->Commande->id = $id;
                $commandeuserlivreur = $this->Commande->read()['Commande'];
                $this->sendMessage($commandeuserlivreur['livreur_id'], $commandeuserlivreur["state"], $commandeuserlivreur["isStock"]);
                if ($commandeuserlivreur['isStock'] == TRUE || $commandeuserlivreur['state'] == 'AttenteLivraison') {
                    $historique = array(
                        'Historique' => array(
                            'id' => null,
                            'commande_id' => $id,
                            'user_id' => $commandeuserlivreur['livreur_id'],
                            'operation' => 'AttenteLivraison',
                            'cause_operation' => NULL
                        )
                    );
                    $this->Historique->save($historique);
                }
//                require_once APP . "Vendor" . DS . "Notification" . DS . "Push.php";
//                $apiKey = ""; //api key
//                $devices = array(); //array of tokens
//                $message = "Vous avez de nouvelles commandes à rammasser"; //message o send
//                $gcpm = new GCMPushMessage($apiKey);
//                $gcpm->setDevices($devices);
//                $response = $gcpm->send($message, array('title' => 'Notification Ramassage'));
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande Affectée avec succès"),
                    'user_id' => $user_id,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // affecter groupe commande à un seul livreur 
    public function generer_bon_chargement() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Chargement')
            ));
//            $this->request->data['Chargement']['ref'] = "BCH-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
            $this->request->data['Chargement']['ref'] = "CET " . date('Y') . " / " . ($count + 1);
            $this->request->data['Chargement']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
            $this->request->data['Chargement']['avoir'] = 0;
            if ($this->Chargement->save($this->request->data['Chargement'])) {
                $lastInsertIdCommand = $this->Chargement->getLastInsertID();
//                debug($lastInsertIdCommand);
//                die();
                foreach ($this->request->data['Commande'] as $commande):
                    $commande = array(
                        'Commande' => array(
                            'id' => $commande['id'],
                            'chargement_id' => $lastInsertIdCommand,
                            'livreur_id' => $commande['livreur_id'],
                            'date_livraison' => $commande['date_livraison'],
                            'isStock' => 0,
                            'state' => 'AttenteLivraison'
                        )
                    );
                    if ($this->Commande->save($commande)) {
                        $historique = array(
                            'Historique' => array(
                                'id' => null,
                                'commande_id' => $commande['Commande']['id'],
                                'user_id' => $commande['Commande']['livreur_id'],
                                'operation' => 'AttenteLivraison',
                                'cause_operation' => NULL
                            )
                        );
                        $this->Historique->save($historique);
                    }
                endforeach;
                $livreur_id = $this->request->data['Commande'][0]['livreur_id'];
                $this->sendMessage($livreur_id, "full", null);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Bon chargement générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // générer bon ramassage  
    public function generer_bon_ramassage() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Ramassage')
            ));
            $this->request->data['Ramassage']['ref'] = "RCET " . date('Y') . " / " . ($count + 1);
            $this->request->data['Ramassage']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
            $this->request->data['Ramassage']['avoir'] = 0;
            $this->request->data['Ramassage']['type'] = "Ramassage";
            if ($this->Ramassage->save($this->request->data['Ramassage'])) {
                $lastInsertIdCommand = $this->Ramassage->getLastInsertID();
//                debug($lastInsertIdCommand);
//                die();
                foreach ($this->request->data['Commande'] as $commande):
                    $commande = array(
                        'Commande' => array(
                            'id' => $commande['id'],
                            'ramassage_id' => $lastInsertIdCommand
                        )
                    );
                    $this->Commande->save($commande);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Bon Ramassage générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// facturer commande annulée 
    public function activer_reaffectation_annulation() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
//            debug($data['Commande']['id']);
//            die();
            if ($this->Commande->saveField('isAnnule', FALSE)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Réaffectation activé avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// modif state livrée -> en stock
    public function modif_state_livree() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
            $commande = $this->Commande->read()['Commande'];
            $countRetour = $commande['countRetour'] + 1;
            $history = $this->Historique->find('first', array(
                'conditions' => array('Historique.commande_id' => $commande['id'], 'Historique.operation' => 'Livrée')
            ));
            if (!empty($history)) {
                $id_history = $history['Historique']['id'];
                $this->Historique->id = $id_history;
                $this->Historique->delete();
            }
            if ($this->Commande->saveField('isStock', TRUE)) {
                $this->Commande->saveField('countRetour', $countRetour);
                if ($countRetour < 3 && $commande['cause_nonlivraison'] !== 'Annulation Destinataire') {
                    $this->Commande->saveField('state', 'Retour');
                }
                if ($countRetour > 2 || $commande['cause_nonlivraison'] == 'Annulation Destinataire') {
                    $this->Commande->saveField('state', 'Annulée');
                }
                if ($commande['cause_nonlivraison'] == '') {
                    $this->Commande->saveField('cause_nonlivraison', 'Opération système');
                }
//                if ($commande['countRetour'] < 3 && $commande['countRetour'] > 0 && $commande['cause_nonlivraison'] != 'Annulation Destinataire') {
//                    $this->Commande->saveField('state', 'Retour');
//                }
//                if ($commande['countRetour'] == 0 && $commande['cause_nonlivraison'] != 'Annulation Destinataire') {
//                    $this->Commande->saveField('state', 'Retour');
//                }
//                if ($commande['countRetour'] > 2 || $commande['cause_nonlivraison'] == 'Annulation Destinataire') {
//                    $this->Commande->saveField('state', 'Retour');
//                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande validée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande par commercial 
    public function valide_commande() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
//        debug($data['Commande']['id']);
//        die();
        $id = $this->request->data['Commande']['id'];
        $livreur_id = $this->request->data['Commande']['livreur_id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
            if ($this->Commande->saveField('state', 'En Cours') && $this->Commande->saveField('livreur_id', $livreur_id) && $this->Commande->saveField('com_id', $livreur_id) && $this->Commande->saveField('com_id', $livreur_id)) {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $livreur_id,
                        'operation' => 'Récupérée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande mobile
    public function valide_commande_livreur() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
//        debug($data['Commande']['id']);
//        die();
        $id = $this->request->data['Commande']['id'];
        $livreur_id = $this->request->data['Commande']['livreur_id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('put'))) {
            if ($this->Commande->saveField('state', 'En Cours') && $this->Commande->saveField('livreur_id', $livreur_id) && $this->Commande->saveField('com_id', $livreur_id) && $this->Commande->saveField('com_id', $livreur_id)) {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $livreur_id,
                        'operation' => 'Récupérée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande en cours par commercial 
    public function livreur_valide_commande() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        $commanderetour = $this->Commande->read()['Commande'];
        if ($this->request->is(array('put'))) {
            $countRetour = $this->Commande->read('countRetour')['Commande']['countRetour'];
            if ($this->request->data['Commande']['state'] == 'Retour') {
                $this->request->data['Commande']['isAnnule'] = false;
                if ($commanderetour['countRetour'] == 2) {
                    $this->request->data['Commande']['isAnnule'] = true;
                }
            }
//            debug($this->request->data['Commande']);
//            die();
            if ($this->Commande->save($this->request->data['Commande'])) {
                $this->Commande->id = $id;
                $commandelivreur = $this->Commande->read()['Commande'];
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandelivreur['livreur_id'],
                        'operation' => $commandelivreur['state'],
                        'cause_operation' => $commandelivreur['cause_nonlivraison']
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande en cours par commercial 
    public function livreur_injoignable_call() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $data = $this->request->data;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('post'))) {
//            debug($this->request->data['Commande']);
//            die();
            $this->Commande->id = $id;
            $commandelivreur = $this->Commande->read()['Commande'];
            $historique = array(
                'Historique' => array(
                    'id' => null,
                    'commande_id' => $id,
                    'user_id' => $commandelivreur['livreur_id'],
                    'operation' => 'appel',
                    'cause_operation' => 'Injoignable'
                )
            );
            $this->Historique->save($historique);
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Commande valider avec succès"),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // valider commande for code barre
    public function validercommandebarrecode() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            if ($commande['Commande']['state'] == 'Non Traitée') {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commande['Commande']['livreur_id'],
                        'operation' => 'Récupérée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
            }
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            if ($commande['Commande']['isStock'] == 0 || $commande['Commande']['isStock'] == FALSE) {
                $this->request->data['Commande']['modified'] = date('Y-m-d H:i:s');
                if ($this->Commande->save($this->request->data['Commande'])) {
                    $this->Commande->id = $id;
                    $commandestate = $this->Commande->read();
                    $historique = array(
                        'Historique' => array(
                            'id' => null,
                            'commande_id' => $id,
                            'user_id' => $commandestate['Commande']['livreur_id'],
                            'operation' => 'En Stock',
                            'cause_operation' => NULL
                        )
                    );
                    $this->Historique->save($historique);
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("Commande valider avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
                die();
            } else {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande déjà en stock"),
                    'status' => 200,
                    'type' => 'error'
                ));
                die();
            }
        }
    }

    // valider commande for code barre
    public function enter_stock() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('post'))) {
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            if ($commande['Commande']['state'] == 'Non Traitée') {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commande['Commande']['livreur_id'],
                        'operation' => 'Récupérée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
            }
            $emplacement_id = $this->Emplacement->find('first', array(
                'conditions' => array('Emplacement.name' => ucfirst(strtolower(trim($commande['Receiver']['Ville']['name']))))
            ));
//            cas de commande en attente livraison ou retour 
            if ($commande['Commande']['state'] === "Retour") {
                $data = $this->request->data;
                if (!empty($emplacement_id)) {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'Retour',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'],
                                'ProductsStock.sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id'])
                        ));
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
//                décalaration produit pour stock
                        $product_id = 0;
                        if (empty($ifExistProduct)) {
                            $productToSave = array(
                                'Product' => array(
                                    'id' => null,
                                    'name' => $ref,
                                    'type' => 'Colis',
                                    'price' => 0,
                                    'min_qte' => 1,
                                    'prix_achat' => 0,
                                    'tva_id' => 0,
                                    'fournisseur_id' => 0,
                                    'famille_id' => 0,
                                    'unite_id' => 0,
                                    'category_id' => 0,
                                )
                            );
                            $this->Product->save($productToSave);
                            $product_id = $this->Product->getLastInsertID();
                        } else {
                            $product_id = $ifExistProduct['Product']['id'];
                        }
//                verification de l'existance du stock produit
                        if (empty($ifExistProductsStock) || empty($ifExistProduct)) {
                            $emplacementproduct = array(
                                'ProductsStock' => array(
                                    'id' => NULL,
                                    'product_id' => $product_id,
                                    'qte' => 1,
                                    'stock_id' => $emplacement_id['Stock']['id'],
                                    'emplacement_id' => $emplacement_id['Emplacement']['id'],
                                    'sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id']
                                )
                            );
                            $this->ProductsStock->save($emplacementproduct);
                        }
                    }
                }
            }
            // cas de commande annulée
            else if ($commande['Commande']['state'] === "Annulée") {
                $data = $this->request->data;
                if (!empty($emplacement_id)) {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'Annulation',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'],
                                'ProductsStock.sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id'])
                        ));
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
                        //décalaration produit pour stock
                        $product_id = 0;
                        if (empty($ifExistProduct)) {
                            $productToSave = array(
                                'Product' => array(
                                    'id' => null,
                                    'name' => $ref,
                                    'type' => 'Colis',
                                    'price' => 0,
                                    'min_qte' => 1,
                                    'prix_achat' => 0,
                                    'tva_id' => 0,
                                    'fournisseur_id' => 0,
                                    'famille_id' => 0,
                                    'unite_id' => 0,
                                    'category_id' => 0,
                                )
                            );
                            $this->Product->save($productToSave);
                            $product_id = $this->Product->getLastInsertID();
                        } else {
                            $product_id = $ifExistProduct['Product']['id'];
                        }
                        //verification de l'existance du stock produit
                        if (empty($ifExistProductsStock) || empty($ifExistProduct)) {
                            $emplacementproduct = array(
                                'ProductsStock' => array(
                                    'id' => NULL,
                                    'product_id' => $product_id,
                                    'qte' => 1,
                                    'stock_id' => $emplacement_id['Stock']['id'],
                                    'emplacement_id' => $emplacement_id['Emplacement']['id'],
                                    'sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id']
                                )
                            );
                            $this->ProductsStock->save($emplacementproduct);
                        }
                    }
                }
            }
            // cas de commande en dépôt ou recupérée
            else if ($commande['Commande']['state'] !== "En Stock") {
                $data = $this->request->data;
                if (!empty($emplacement_id)) {
                    $sousemplacement_id = $this->Sousemplacement->find('first', array(
                        'conditions' => array(
                            'Sousemplacement.name' => 'En attente livraison',
                            'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                        )
                    ));
                    if (!empty($sousemplacement_id)) {
                        $ref = $commande['Commande']['ref'];
                        $ifExistProductsStock = $this->ProductsStock->find('first', array(
                            'conditions' => array(
                                'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'],
                                'ProductsStock.sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id'])
                        ));
                        $ifExistProduct = $this->Product->find('first', array(
                            'conditions' => array('Product.name' => $ref)
                        ));
                        //décalaration produit pour stock
                        $product_id = 0;
                        if (empty($ifExistProduct)) {
                            $productToSave = array(
                                'Product' => array(
                                    'id' => null,
                                    'name' => $ref,
                                    'type' => 'Colis',
                                    'price' => 0,
                                    'min_qte' => 1,
                                    'prix_achat' => 0,
                                    'tva_id' => 0,
                                    'fournisseur_id' => 0,
                                    'famille_id' => 0,
                                    'unite_id' => 0,
                                    'category_id' => 0,
                                )
                            );
                            $this->Product->save($productToSave);
                            $product_id = $this->Product->getLastInsertID();
                        } else {
                            $product_id = $ifExistProduct['Product']['id'];
                        }
                        //verification de l'existance du stock produit
                        if (empty($ifExistProductsStock) || empty($ifExistProduct)) {
                            $emplacementproduct = array(
                                'ProductsStock' => array(
                                    'id' => NULL,
                                    'product_id' => $product_id,
                                    'qte' => 1,
                                    'stock_id' => $emplacement_id['Stock']['id'],
                                    'emplacement_id' => $emplacement_id['Emplacement']['id'],
                                    'sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id']
                                )
                            );
                            $this->ProductsStock->save($emplacementproduct);
                        }
                    }
                }
            }
            die();
        }
        die();
    }

    // valider commande for code barre
    public function validerramassagemanu() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            $user_id = $commande['Commande']['user_id'];
            if ($this->Commande->save($this->request->data['Commande'])) {
                $this->Commande->id = $id;
                $commandestate = $this->Commande->read();
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandestate['Commande']['livreur_id'],
                        'operation' => 'Récupérée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande valider avec succès"),
                    'user_id' => $user_id,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande for code barre
    public function validerattentelivraison() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $data = $this->request->data['Commande'];
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
//            debug($data);
            $countRetour = $commande['Commande']['countRetour'];
            if ($data['state'] == 'Retour') {
                $this->request->data['Commande']['countRetour'] = $countRetour + 1;
            }
            $state = $commande['Commande']['countRetour'];
            if ($state > 1 && $data['state'] == 'Retour') {
                $this->request->data['Commande']['state'] = 'Annulée';
                $this->request->data['Commande']['isAnnule'] = true;
            }
            if ($data['state'] == 'Retour') {
//                $this->request->data['Commande']['countRetour'] = $state + 1;
            }
            if ($data['state'] == 'Annulée') {
                $this->request->data['Commande']['isAnnule'] = true;
            }
//            debug($this->request->data['Commande']);
//            die();
            if ($this->Commande->save($this->request->data['Commande'])) {
                $this->Commande->id = $id;
                $commandestate = $this->Commande->read();
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandestate['Commande']['livreur_id'],
                        'operation' => $this->request->data['Commande']['state'],
                        'cause_operation' => $this->request->data['Commande']['cause_nonlivraison']
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider commande for code barre
    public function livreecommande() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
//            debug($this->request->data['Commande']);die();
            $commande = $this->Commande->read();
            if ($this->Commande->save($this->request->data['Commande'])) {
                $this->Commande->id = $id;
                $commandestate = $this->Commande->read();
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandestate['Commande']['livreur_id'],
                        'operation' => 'Livrée',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande livrée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider annulation de commande
    public function retourcommandeExpediteur() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commandeuserretour = $this->Commande->read()['Commande'];
//            debug($this->request->data['Commande']); die();
            if ($this->Commande->saveField('state', 'Retour Expéditeur') && $this->Commande->saveField('isStock', 0) && $this->Commande->saveField('isFacture', 0)) {
                $historique = array(
                    'Historique' => array(
                        'id' => null,
                        'commande_id' => $id,
                        'user_id' => $commandeuserretour['livreur_id'],
                        'operation' => 'Retour Expéditeur',
                        'cause_operation' => NULL
                    )
                );
                $this->Historique->save($historique);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande retournée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // valider annulation de commande
    public function validerannulecommande() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Receiver', 'Receiver.Ville');
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
            $commande = $this->Commande->read();
            $emplacement_id = $this->Emplacement->find('first', array(
                'conditions' => array('Emplacement.name' => ucfirst(strtolower(trim($commande['Receiver']['Ville']['name']))))
            ));
            if ($commande['Commande']['state'] === "Retour" && in_array($commande['Commande']['isStock'], array(0, FALSE))) {
//                $data = $this->request->data;
//                $sousemplacement_id = $this->Sousemplacement->find('first', array(
//                    'conditions' => array(
//                        'Sousemplacement.name' => 'Retour',
//                        'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
//                    )
//                ));
//                $ref = $commande['Commande']['ref'];
//                $ifExistProductsStock = $this->ProductsStock->find('first', array(
//                    'conditions' => array(
//                        'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'],
//                        'ProductsStock.sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id'])
//                ));
//                $ifExistProduct = $this->Product->find('first', array(
//                    'conditions' => array('Product.name' => $ref)
//                ));
//                //décalaration produit pour stock
//                $product_id = 0;
//                if (empty($ifExistProduct)) {
//                    $productToSave = array(
//                        'Product' => array(
//                            'id' => null,
//                            'name' => $ref,
//                            'type' => 'Colis',
//                            'price' => 0,
//                            'min_qte' => 1,
//                            'prix_achat' => 0,
//                            'tva_id' => 0,
//                            'fournisseur_id' => 0,
//                            'famille_id' => 0,
//                            'unite_id' => 0,
//                            'category_id' => 0,
//                        )
//                    );
////                    debug($productToSave);
////                    die();
//                    $this->Product->save($productToSave);
//                    $product_id = $this->Product->getLastInsertID();
//                } else {
//                    $product_id = $ifExistProduct['Product']['id'];
//                }
//                //verification de l'existance du stock produit
////                die();
//                if (empty($ifExistProductsStock)) {
//                    $emplacementproduct = array(
//                        'ProductsStock' => array(
//                            'id' => NULL,
//                            'product_id' => $product_id,
//                            'qte' => 1,
//                            'stock_id' => $emplacement_id['Stock']['id'],
//                            'emplacement_id' => $emplacement_id['Emplacement']['id'],
//                            'sousemplacement_id' => $sousemplacement_id['Sousemplacement']['id']
//                        )
//                    );
////                    debug($emplacementproduct); die();
//                    $this->ProductsStock->save($emplacementproduct);
//                }
            }
            $id = $this->request->data['Commande']['id'];
            $this->Commande->id = $id;
//            debug($this->request->data['Commande']); die();
            if ($this->Commande->save($this->request->data['Commande'])) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande annulée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // affecter multi commande à une commande 
    public function affecter_groupe_commercial() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);die();

            foreach ($data['Commande'] as $commande) {
                // delete this commande in stock and in product
                $this->Commande->id = $commande['id'];
                $this->Commande->contain('Receiver', 'Receiver.Ville');
                $commande = $this->Commande->read();
//                debug($commande);
                $emplacement_id = $this->Emplacement->find('first', array(
                    'conditions' => array('Emplacement.name' => ucfirst(strtolower(trim($commande['Receiver']['Ville']['name']))))
                ));
//                debug($emplacement_id);
//                die();
                if (!empty($emplacement_id)) {
                    if ($commande['Commande']['state'] === "Annulée") {
                        $sousemplacement_id = $this->Sousemplacement->find('first', array(
                            'conditions' => array(
                                'Sousemplacement.name' => 'Annulation',
                                'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                            )
                        ));
                        if (!empty($sousemplacement_id)) {
                            $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                            $ifExistProductsStock = $this->ProductsStock->find('first', array(
                                'conditions' => array(
                                    'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                            ));
                            $this->Product->recursive = -1;
                            $ifExistProduct = $this->Product->find('first', array(
                                'conditions' => array('Product.name' => $ref)
                            ));
                            if (!empty($ifExistProductsStock)) {
                                $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                                if (!empty($productsstock_id)) {
                                    $this->ProductsStock->delete($productsstock_id);
                                }
                            }
                            if (!empty($ifExistProduct)) {
                                $product_id = $ifExistProduct['Product']['id'];
                                if (!empty($product_id)) {
                                    $this->Product->delete($product_id);
                                }
                            }
                        }
//                    debug($productsstock_id);
//                    debug($product_id);
                    } else if ($commande['Commande']['state'] === "Retour") {
                        $sousemplacement_id = $this->Sousemplacement->find('first', array(
                            'conditions' => array(
                                'Sousemplacement.name' => 'Retour',
                                'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                            )
                        ));
                        if (!empty($sousemplacement_id)) {
                            $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                            $ifExistProductsStock = $this->ProductsStock->find('first', array(
                                'conditions' => array(
                                    'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                            ));
                            $this->Product->recursive = -1;
                            $ifExistProduct = $this->Product->find('first', array(
                                'conditions' => array('Product.name' => $ref)
                            ));
                            if (!empty($ifExistProductsStock)) {
                                $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                                if (!empty($productsstock_id)) {
                                    $this->ProductsStock->delete($productsstock_id);
                                }
                            }
                            if (!empty($ifExistProduct)) {
                                $product_id = $ifExistProduct['Product']['id'];
                                if (!empty($product_id)) {
                                    $this->Product->delete($product_id);
                                }
                            }
                        }
//                    debug($productsstock_id);
//                    debug($product_id);
                    } else {
                        $sousemplacement_id = $this->Sousemplacement->find('first', array(
                            'conditions' => array(
                                'Sousemplacement.name' => 'En attente livraison',
                                'Sousemplacement.emplacement_id' => $emplacement_id['Emplacement']['id']
                            )
                        ));
                        if (!empty($sousemplacement_id)) {
                            $ref = $commande['Commande']['ref'];
//                $this->ProductsStock->recursive = 2;
                            $ifExistProductsStock = $this->ProductsStock->find('first', array(
                                'conditions' => array(
                                    'ProductsStock.emplacement_id' => $emplacement_id['Emplacement']['id'])
                            ));
                            $this->Product->recursive = -1;
                            $ifExistProduct = $this->Product->find('first', array(
                                'conditions' => array('Product.name' => $ref)
                            ));
                            if (!empty($ifExistProductsStock)) {
                                $productsstock_id = $ifExistProductsStock['ProductsStock']['id'];
                                if (!empty($productsstock_id)) {
                                    $this->ProductsStock->delete($productsstock_id);
                                }
                            }
                            if (!empty($ifExistProduct)) {
                                $product_id = $ifExistProduct['Product']['id'];
                                if (!empty($product_id)) {
                                    $this->Product->delete($product_id);
                                }
                            }
                        }
                    }
                }
                //save data
                $id = $commande['Commande']['id'];
                $this->Commande->id = $id;
                $commandestate = $this->Commande->read()['Commande'];
//                debug($id);
//                debug($this->request->data); die();
                if ($commandestate['state'] == 'Non Traitée') {
                    $this->Commande->saveField('com_id', $this->request->data['Commercial']['livreur_id']);
                }
                $this->Commande->saveField('livreur_id', $this->request->data['Commercial']['livreur_id']);
                $this->Commande->saveField('date_livraison', $this->request->data['Commercial']['date_livraison']);
                $this->Commande->saveField('state', $this->request->data['Commercial']['state']);
                $this->Commande->saveField('isStock', $this->request->data['Commercial']['isStock']);
                if ($commandestate['isStock'] == true) {
                    $historique = array(
                        'Historique' => array(
                            'id' => null,
                            'commande_id' => $id,
                            'user_id' => $this->request->data['Commercial']['livreur_id'],
                            'operation' => 'AttenteLivraison',
                            'cause_operation' => NULL
                        )
                    );
                    $this->Historique->save($historique);
                }
            }
            $livreur_id = $this->request->data['Commercial']['livreur_id'];
            $this->sendMessage($livreur_id, "full", null);
//            debug($this->request->data['Commande'][0]['id']);
            $this->Commande->recurcive = -1;
            $this->Commande->id = $this->request->data['Commande'][0]['id'];
            $commandeuser = $this->Commande->read();
            $user_id = $commandeuser['Commande']['user_id'];
//            debug($commandeuser['Commande']['user_id']);
//            debug($this->request->data['Commande'][0]['id']);
//            die();
//            if ($this->Commande->save($data)) {
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Commandes effectées avec succès"),
                'user_id' => $user_id,
                'status' => 200,
                'type' => 'success'
            ));
//            }
            die();
        }
    }

    // affecter multi commande à une commande 
    public function affecter_commandes_clients() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            foreach ($data['Commande'] as $commande) {
                $user = $this->Commande->find('all', array(
                    'conditions' => array('Commande.user_id' => $commande['user_id'], 'Commande.livreur_id' => 0, 'Commande.state' => 'Non Traitée')
                ));
                if (!empty($user)) {
                    foreach ($user as $com):
                        $this->Commande->id = $com['Commande']['id'];
                        $this->Commande->saveField('livreur_id', $this->request->data['Commercial']['livreur_id']);
                        $this->Commande->saveField('com_id', $this->request->data['Commercial']['livreur_id']);
                    endforeach;
                }
                $livreur_id = $this->request->data['Commercial']['livreur_id'];
                $this->sendMessage($livreur_id, "full", null);
            }

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Commandes effectées avec succès"),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function confirm_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $commande = $this->Commande->read()['Commande'];
            $refancient = $commande['ref'];
            $last_ref_explode = explode("-", $refancient);
            if ($data['Commande']['valeur'] == 0) {
                $new_ref = "Commande-achat-" . $last_ref_explode[2] . "-" . $last_ref_explode[3];
//            debug($new_ref);die();
                $this->Commande->saveField('isDemandeprix', 0);
            } else {
                $new_ref = "Bon-réception-" . $last_ref_explode[2] . "-" . $last_ref_explode[3];
//                debug($new_ref);
//                die();
                $this->Commande->saveField('state', 'Finalisée');
            }
//            debug($last_ref_explode);
//            debug($data['Bon']);
//            die();
            if ($this->Commande->saveField('ref', $new_ref)) {
                foreach ($data['Bon'] as $bon):
                    $bon['id'] = $bon['bon_id'];
                    $bon['commande_id'] = $id;
                    $this->Bon->save($bon);
                endforeach;
//                if (!empty($data['Notification'])) {
//                    foreach ($data['Notification'] as $notif):
////                        if (!empty($notif['msg'])) {
//                        $notifToSave = array(
//                            'id' => null,
//                            'product_id' => $notif['product_id'],
//                            'msg' => $notif['msg'],
//                            'lvl' => $notif['lvl'],
//                        );
////                        }
//                        $this->Notification->save($notifToSave);
//                    endforeach;
//                }
                http_response_code(200);
                header('Content-Type: application/json');
                if ($this->request->data['Commande']['valeur'] == 0) {
                    echo json_encode(array(
                        'text' => __("Demande de prix confirmé avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                } else {
                    echo json_encode(array(
                        'text' => __("Commande Achat confirmée avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }
            die();
        }
    }

    // generer facture d'achat 
    public function generer_facture_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            $commande = $this->Commande->read()['Commande'];
            $countFacture = $this->Facture->find('count', array(
                'conditions' => array('Facture.type_id' => $this->factureTypeID('achat'))
            ));
            $newCF = 'CFA-' . date('y') . date('m') . date('d') . "-" . ($countFacture + 1);
            $facture = array(
                'Facture' => array(
                    'id' => null,
                    'code_facture' => $newCF,
                    'avoir' => 0,
                    'limit_date' => null,
                    'payment_id' => $this->request->data['Commande']['payment_id'],
                    'commande_id' => $this->request->data['Commande']['id'],
                    'commerciale_id' => $commande['commerciale_id'],
                    'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                    'acompte' => $this->request->data['Commande']['acompte'],
                    'remise_globale' => 0,
                    'type_id' => $this->factureTypeID('achat'),
                    'is_client' => true,
                    'fournisseur_id' => $commande['fournisseur_id'],
                )
            );

            if ($this->Facture->save($facture)) {
                $FactureLastInsertID = $this->Facture->getLastInsertID();
                foreach ($this->request->data['Bon'] as $bon):
                    $data = array(
                        'FactureProduct' => array(
                            'id' => null,
                            'facture_id' => $FactureLastInsertID,
                            'product_id' => $bon['product_id'],
                            'qte' => $bon['qte_recue'],
                            'remise' => $bon['remise'],
                            'last_unit_price' => $bon['last_unit_price'],
                        )
                    );
                    $this->FactureProduct->save($data);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture d'achat générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // generer facture d'achat 
    public function generer_br_facture_achat() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $commande = $this->Commande->read()['Commande'];
            $refancient = $commande['ref'];
            $last_ref_explode = explode("-", $refancient);
            $new_ref = "Bon-réception-" . $last_ref_explode[2] . "-" . $last_ref_explode[3];
            $this->Commande->saveField('isDemandeprix', 0);
            $this->Commande->saveField('state', 'Finalisée');
            if ($this->Commande->saveField('ref', $new_ref)) {
                foreach ($data['Bon'] as $bon):
                    $bon['id'] = $bon['bon_id'];
                    $bon['commande_id'] = $id;
                    $this->Bon->save($bon);
                endforeach;
            }
            $countFacture = $this->Facture->find('count', array(
                'conditions' => array('Facture.type_id' => $this->factureTypeID('achat'))
            ));
            $newCF = 'CFA-' . date('y') . date('m') . date('d') . "-" . ($countFacture + 1);
            $facture = array(
                'Facture' => array(
                    'id' => null,
                    'code_facture' => $newCF,
                    'avoir' => 0,
                    'limit_date' => null,
                    'payment_id' => $this->request->data['Commande']['payment_id'],
                    'commande_id' => $this->request->data['Commande']['id'],
                    'commerciale_id' => $commande['commerciale_id'],
                    'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                    'acompte' => $this->request->data['Commande']['acompte'],
                    'remise_globale' => 0,
                    'type_id' => $this->factureTypeID('achat'),
                    'is_client' => true,
                    'fournisseur_id' => $commande['fournisseur_id'],
                )
            );

            if ($this->Facture->save($facture)) {
                $FactureLastInsertID = $this->Facture->getLastInsertID();
                foreach ($this->request->data['Bon'] as $bon):
                    $data = array(
                        'FactureProduct' => array(
                            'id' => null,
                            'facture_id' => $FactureLastInsertID,
                            'product_id' => $bon['product_id'],
                            'qte' => $bon['qte_recue'],
                            'remise' => $bon['remise'],
                            'last_unit_price' => $bon['last_unit_price'],
                        )
                    );
                    $this->FactureProduct->save($data);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture d'achat avec Bon réception générer avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function facture_groupe() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('User', 'Bon', 'Bon.Product', 'Reglement');
            $user_id = $this->request->data['Commande']['user_id'];
            $commandes = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Commande',
                    'Commande.state' => "Finalisée",
                    'Commande.grouped' => FALSE,
                    'Commande.user_id' => $user_id
            )));
            $nonpayed = array();
            foreach ($commandes as $commande):
                if ($commande['Commande']['is_payed'] == false) {
                    array_push($nonpayed, $commande);
                }
            endforeach;
            http_response_code(200);
            echo json_encode($nonpayed);
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    // convert multi bl in facture
    public function generer_facture() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->contain('Bon', 'Bon.Product', 'User', 'Reglement');
        $count = $this->Facture->find('count', array(
            'conditions' => array('Facture.type_id' => $this->factureTypeID('vente'))
        ));
        $newCF = "CF-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        $this->request->data['Facture']['avoir'] = 0;
        $this->request->data['Facture']['type_id'] = $this->factureTypeID('vente');
        $this->request->data['Facture']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            $commandes = array();
            $bons = array();
            $last_id = $this->Facture->getLastInsertID();
            foreach ($data['FactureProduct'] as $k => $factureproduct):
                $bls = $this->Commande->find('first', array(
                    'conditions' => array('Commande.id' => $factureproduct['id'])
                ));
                if (empty($bls['Commande']['restant'])) {
                    $bls['Commande']['restant'] = $factureproduct['restant'];
                }
                $commandes[$k] = $bls;
            endforeach;

            $total_reglee = 0;
            foreach ($commandes as $commande):
                $total_reglee = $total_reglee + $commande['Commande']['total_payee'];
            endforeach;
            $factureproducts = array();
            foreach ($commandes as $commande):
//                $acompte = $commande['Commande']
                foreach ($commande['Bon'] as $bon):
                    array_push($factureproducts, $bon);
                endforeach;
            endforeach;
            $facture = array(
                'Facture' => array(
                    'id' => null,
                    'code_facture' => $newCF,
                    'avoir' => 0,
                    'payment_id' => $this->request->data['Facture']['payment_id'],
                    'object' => $this->request->data['Facture']['object'],
                    'validate' => $this->request->data['Facture']['validate'],
                    'pourcentage' => $this->request->data['Facture']['pourcentage'],
                    'user_id' => $this->request->data['Facture']['user_id'],
                    'last_timbre_price' => $this->getConfiguration()['Configuration']['price_timbre'],
                    'acompte' => 0,
                    'type_id' => $this->factureTypeID('vente'),
                    'is_client' => true
                )
            );
            if ($this->Facture->save($facture)) {
                $FactureLastInsertID = $this->Facture->getLastInsertID();
                foreach ($commandes as $commande):
                    $dataRegle = array(
                        'Reglement' => array(
                            'id' => null,
                            'type' => $this->request->data['Facture']['type'],
                            'numero' => $this->request->data['Facture']['numero'],
                            'date' => $this->request->data['Facture']['limit_date'],
                            'facture_id' => $FactureLastInsertID,
                            'commande_id' => $commande['Commande']['id'],
                            'value' => $this->request->data['Facture']['total_grouped'],
                            'part' => $commande['Commande']['restant']
                        )
                    );
                    $this->Reglement->save($dataRegle);
                    $this->Commande->id = $commande['Commande']['id'];
                    $this->Commande->saveField('grouped', true);
                endforeach;
                foreach ($factureproducts as $factureproduct):
                    $data = array(
                        'FactureProduct' => array(
                            'id' => null,
                            'facture_id' => $FactureLastInsertID,
                            'product_id' => $factureproduct['product_id'],
                            'value' => $total_reglee,
                            'qte' => $factureproduct['qte'],
                            'remise' => $factureproduct['remise'],
                            'last_unit_price' => $factureproduct['last_unit_price']
                        )
                    );
//                    debug($data);
//                    die();
                    $this->FactureProduct->save($data);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Facture générée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
//            }
            die();
        }
    }

// prime commercil par mois
    public function prime_commercial() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        require_once APP . 'Vendor/DateTimeLang/DateTimeFrench.php';

        //init local datetime
        date_default_timezone_set('Europe/Paris');
// --- La setlocale() fonctionnne pour strftime mais pas pour DateTime->format()
        setlocale(LC_ALL, 'fr_FR.utf8', 'fra'); // OK
        //generate sales stats
        $monthsCommandes = array();
        $months = array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
        $data = $this->request->data;
//        debug($data);
//        die();
//                $montant_net_ht = 0;
        foreach ($months as $month):
            $conditions['MONTH(Commande.created)'] = $month;
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array($conditions, 'Commande.state' => 'Finalisée', 'Commande.commerciale_id' => $this->request->data['Commercial']['commerciale_id'])
            ));

            if (!empty($commandes)) {
//                debug($commandes);
//                die();
                $montant_net_ht = 0;
                $montant = 0;
                $remise = 0;
                $prime = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($commandes as $commande):
                    $last_timbre = $commande['Commande']['last_timbre_price'];

                    $remise_globale = $commande['Commande']['remise_globale'];
                    foreach ($commande['Bon'] as $product):
//                debug($product['last_unit_price'] ); die();
                        $price_ht += ($product['last_unit_price'] * $product['qte'] * (1 - $product['remise'] / 100) * (1 - $remise_globale / 100));
                        $prime += ($product['last_unit_price'] * $product['qte'] * (1 - $product['remise'] / 100) * (1 - $remise_globale / 100)) - ($product['Product']['prix_achat'] * $product['qte']);
                        $price_ht += $product['last_unit_price'] * $product['qte'] * (1 - $product['remise'] / 100) * (1 - $remise_globale / 100);
                        $remise = ((($product['last_unit_price'] * $product['qte']) * ($product['remise'])) / 100);
                    endforeach;
                endforeach;
                $montant = $price_ttc + $last_timbre;
                $montant_net_ht = $price_ht;
                $timestamp = null;
                if ($month < 10) {
                    $timestamp = ("2016-0" . $month . "-10 12:12:11");
                } else {
                    $timestamp = ("2016-" . $month . "-10 12:12:11");
                }
                $datetime = new DateTimeFrench($timestamp, new DateTimeZone('Europe/Paris'));
//                debug($datetime->format('F'));
//                die();
                array_push($monthsCommandes, array(
                    'mois' => $timestamp,
                    'net_ht' => $price_ht,
                    'indicateur' => $prime
                ));
            }
        endforeach;
//        debug($monthsCommandes);
//        die();
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($monthsCommandes);
        die();
    }

    public function index_user() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva', 'Commercial', 'Cp', 'Facture', 'Reglement', 'User');
            $commandesuser = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Commande',
                    'Commande.state' => 'Finalisée',
                    'Commande.user_id' => $data['Commande']['user_id']
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($commandesuser);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function devis_user() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva', 'Commercial', 'Cp', 'Facture', 'Reglement', 'User');
            $devisuser = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Devis',
                    'Commande.user_id' => $data['Commande']['user_id']
                ),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($devisuser);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    // espace client list commandes for auth client
    public function commandes_user() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Commande->contain('Bon', 'User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Ville');
            $commandesuser = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Transport',
                    'Commande.user_id' => $data['Commande']['livreur_id']
                ),
                'order' => array('Commande.modified DESC')
            ));
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'data' => $commandesuser,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function index_commerciale() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva', 'Commercial', 'Cp', 'Facture', 'Reglement', 'Reglement.Facture', 'Reglement.Commande', 'User');
            $data = $this->request->data;
            $commandescommerciale = $this->Commande->find('all', array(
                'conditions' => array(
                    'Commande.type' => 'Commande',
                    'Commande.state' => 'Finalisée',
                    'Commande.commerciale_id' => $data['Commande']['commerciale_id']
                ),
                'order' => array('Commande.created DESC')
            ));
            $config = $this->Configuration->find('first');
            $expired_time = $config['Configuration']['echeance_defaut'];
            if (!empty($commandescommerciale)) {
                foreach ($commandescommerciale as $k => $commande):
                    $reglements = $this->Reglement->find('all', array(
                        'conditions' => array('Reglement.commande_id' => $commande['Commande']['id'])
                    ));
//                    die();
                    if (count($reglements) > 0) {
                        $restant = $commande['Commande']['restant'];
//                        debug($restant);

                        if (intval($restant) <= 0) {
                            $commande['Commande']['is_payed'] = true;
                        } else {
                            $commande['Commande']['is_payed'] = false;
                            $datetime1Partiel = new DateTime($commande['Commande']['modified']);
                            $datetime2Partiel = new DateTime(date('Y-m-d H:i:s'));
                            $intervalPartiel = $datetime1Partiel->diff($datetime2Partiel);
                            $diffPartiel = $intervalPartiel->format('%a');
//                        debug($diffPartiel);
//                        die();
                            $commande['Commande']['diff_expired'] = $diffPartiel;
                            if ($diffPartiel > $expired_time) {
                                $commande['Commande']['expired'] = true;
                            } else {
                                $commande['Commande']['expired'] = false;
                            }
                        }
                        $commandescommerciale[$k] = $commande;
                    } else {
                        if (strtotime($commande['Commande']['modified']) < strtotime('-' . $expired_time . ' days')) {
                            $datetime1 = new DateTime($commande['Commande']['modified']);
                            $datetime2 = new DateTime(date('Y-m-d H:i:s'));
                            $interval = $datetime1->diff($datetime2);
                            $diff = $interval->format('%a');
                            $commande['Commande']['diff_expired'] = $diff;
                            $commande['Commande']['expired'] = true;
                        } else {
                            $datetime1 = new DateTime($commande['Commande']['modified']);
                            $datetime2 = new DateTime(date('Y-m-d H:i:s'));
                            $interval = $datetime1->diff($datetime2);
                            $diff = $interval->format('%a');
                            $commande['Commande']['diff_expired'] = $diff;
                            $commande['Commande']['expired'] = false;
                        }
                        $commande['Commande']['is_payed'] = false;
                        $commandescommerciale[$k] = $commande;
                    }
                endforeach;
//            die();
            }

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($commandescommerciale);
            die();
        }
//        http_response_code(403);
//        header('Content-Type: application/json');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function commandes_finalisee() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandesfinalisee = $this->Commande->find('all', array(
                'conditions' => array('Commande.type' => array('Commande'), 'Commande.state' => array('Finalisée')),
                'order' => array('Commande.created DESC')
            ));
            http_response_code(200);
            echo json_encode($commandesfinalisee);
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

    public function commandes_avoir() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $commandesavoir = $this->Retour->find('all', array(
                'conditions' => array('Retour.avoir' => TRUE, 'Retour.isRetour' => TRUE),
                'order' => array('Retour.created DESC')
            ));
            http_response_code(200);
            echo json_encode($commandesavoir);
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

//    public function commandes_finalisee() {
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
////        header('Content-type: application/json');
//        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            $commandesfinalisees = $this->Commande->find('all', array(
//                'conditions' => array('Commande.type' => array('Commande', 'Transport'), 'Commande.state' => array('Finalisée', 'Livrée', 'Retour Expéditeur')),
//                'order' => array('Commande.created DESC')
//            ));
//            $commandesannulees = $this->Commande->find('all', array(
//                'conditions' => array('Commande.type' => array('Commande', 'Transport'), 'Commande.state' => 'Annulée', 'Commande.isFacture' => false),
//                'order' => array('Commande.created DESC')
//            ));
////            $commandes = array();
//            $commandes = array_merge($commandesfinalisees, $commandesannulees);
//
////            debug($commandes);die();
////            function cmp($a, $b) {
////                $p1 = $a['Commande']['created'];
////                $p2 = $b['Commande']['created'];
////                return $p1 > $p2;
////            }
////            uasort($commandes, "cmp");
////            debug($commandes);die();
////            $cmds = array();
////            array_push($cmds, $commandes);
//            http_response_code(200);
//            echo json_encode($commandes);
//            die();
//        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
//    }
    public function generer_avoir() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            if (!empty($this->request->data['Commande']['id'])) {
                $data = $this->request->data;
                $date = date('Y');
                $id = $this->request->data['Commande']['id'];
                $this->Commande->id = $id;
                $commande = $this->Commande->read();
                $this->Facture->id = $commande['Facture']['id'];
                $this->Facture->contain('Product');
                $facture = $this->Facture->read();
                if (!empty($facture)) {
                    $this->Facture->saveField('avoir', TRUE);
                    $countAvoir = $this->Avoir->find('count', array(
                        'conditions' => array('YEAR(Avoir.created)' => $date)
                    ));
                    $factureToSave = $facture['Facture'];
                    $factureToSave['id'] = NULL;
                    $factureToSave['avoir'] = TRUE;
                    $factureToSave['facture_id'] = $facture['Facture']['id'];
                    $factureToSave['code_facture'] = "FA-" . date('y') . date('m') . date('d') . "-" . ($countAvoir + 1);
//                    debug($facture);
//                    debug($factureToSave);die();
                    if ($this->Avoir->save($factureToSave)) {
                        $lastAvoir_id = $this->Avoir->getLastInsertID();
                        $this->Avoir->id = $lastAvoir_id;
                        $this->Facture->saveField('facture_id', $lastAvoir_id);
                        foreach ($facture['Product'] as $product):
                            $product_facture = array(
                                'FactureProduct' => array(
                                    'id' => NULL,
                                    'facture_id' => $lastAvoir_id,
                                    'product_id' => $product['FacturesProduct']['product_id'],
                                    'last_unit_price' => $product['FacturesProduct']['last_unit_price'],
                                    'qte' => $product['FacturesProduct']['qte'],
                                    'remise' => $product['FacturesProduct']['remise'],
                                    'content' => $product['FacturesProduct']['content'],
                                    'longueur' => $product['FacturesProduct']['longueur'],
                                    'largeur' => $product['FacturesProduct']['largeur'],
                                    'hauteur' => $product['FacturesProduct']['hauteur'],
                                    'poid' => $product['FacturesProduct']['poid']
                                )
                            );
                            $this->FactureProduct->save($product_facture);
                        endforeach;
                    }
                }
                $this->Commande->saveField('avoir', true);
                $count = $this->Retour->find('count', array(
                    'conditions' => array('YEAR(Retour.created)' => $date)
                ));
                $this->Commande->id = $id;
                $commandeBL = $this->Commande->read()['Commande'];
                $commandeBLToSave = $commandeBL;
                $commandeBLToSave['id'] = NULL;
                $commandeBLToSave['commande_id'] = $data['Commande']['id'];
                $commandeBLToSave['ref'] = "RT-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
                $commandeBLToSave['avoir'] = TRUE;
                $commandeBLToSave['isRetour'] = TRUE;

//                $this->request->data['Avoir']['user_id'] = $facture['Facture']['user_id'];
//                $this->request->data['Avoir']['object'] = $facture['Facture']['object'];
//                $this->request->data['Avoir']['validate'] = $facture['Facture']['validate'];
//                $this->request->data['Avoir']['pourcentage'] = $facture['Facture']['pourcentage'];
//                $this->request->data['Avoir']['payment_id'] = $facture['Facture']['payment_id'];
//                $this->request->data['Avoir']['commerciale_id'] = $facture['Facture']['commerciale_id'];
//                $this->request->data['Avoir']['retenu_id'] = $facture['Facture']['retenu_id'];
//                $this->request->data['Avoir']['commande_id'] = $facture['Facture']['commande_id'];
//                $this->request->data['Avoir']['acompte'] = $facture['Facture']['acompte'];
//                $this->request->data['Avoir']['code_facture'] = "FA-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
//                $this->request->data['Avoir']['avoir'] = 1;
//                $this->request->data['Avoir']['facture_id'] = $id;
//                $this->request->data['Avoir']['type_id'] = $this->factureTypeID('vente');
//                $this->request->data['Avoir']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
//                debug($this->request->data['Avoir']);
//                die();
                if ($this->Retour->save($commandeBLToSave)) {
                    $last_id = $this->Retour->getLastInsertID();
                    $this->Retour->id = $id;
                    $this->Retour->saveField('commande_id', $last_id);
                    foreach ($commande['Bon'] as $bon):
                        $bon['id'] = NULL;
                        $bon['commande_id'] = $last_id;
                        $this->Bon->save($bon);
                    endforeach;
                    $text = __("Bon retour générer avec succès");
                    if (!empty($facture)) {
                        $text = __("Bon retour avec facture d'avoir générer avec succès");
                    }
                    http_response_code(200);
                    echo json_encode(array(
                        'text' => $text,
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
                die();
            } else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("BL n'existe pas"),
                    'status' => 404,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

// list reglement 
    public function show_reglement() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $ttc_reglement = 0;
            $this->Commande->recursive = 2;
            $data = $this->request->data;
            $this->Commande->id = $data['Commande']['id'];
            $reglement = $this->Commande->read();
            $payments = $this->Facture->Payment->find('all', array(
                'fields' => array('Payment.id', 'Payment.name'),
            ));
            $reglements = $this->Reglement->find('all', array(
                'conditions' => array('Reglement.commande_id' => $data['Commande']['id'])
            ));
            if (!empty($reglements)) {
                foreach ($reglements as $regl):
                    $ttc_reglement = $ttc_reglement + $regl['Reglement']['value'];
                endforeach;
            }
            if (!empty($reglement)) {
                http_response_code(200);
                echo json_encode(array(
                    'ttc_reglement' => $ttc_reglement,
                    'text' => $reglement,
                    'payments' => $payments,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(404);
                echo json_encode(array(
                    'text' => __("Commande non trouvée"),
                    'status' => 404,
                    'type' => 'success'
                ));
            }
            die();
        }
        die();
    }

// ajout reglement
    public function passerReglement() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->Reglement->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Reglement passé avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // config
    public function config() {
        header('Access-Control-Allow-Origin: *');
        if ($this->request->is('post')) {
            $config = $this->Configuration->find('first');
            http_response_code(200);
            echo json_encode($config);
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

// passer commande client
    public function add_commande_client() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $count = $this->Commande->find('count', array(
            'conditions' => array('Commande.type' => 'Transport')
        ));
        $max_id = $this->Commande->find('first', array(
            'fields' => array('MAX(Commande.id) AS id', '*')));
        $commande_maxCreated = $this->Commande->find('first', array(
            'conditions' => array('Commande.type' => 'Transport'),
            'order' => array('Commande.created DESC')
        ));
//        if (!empty($max_id)) {
//            $commande_maxID = $this->Commande->find('first', array(
//                'conditions' => array('Commande.id' => $max_id[0])
//            ));
//        }
        $ref = explode('-', $commande_maxCreated['Commande']['ref']);
        $count = $ref[2];
//        debug($count);
//        debug($commande_maxCreated);
//        die();
        $this->request->data['Commande']['ref'] = "BC-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        if ($count < 100) {
            $this->request->data['Commande']['ref'] = "BC-" . date('y') . date('m') . date('d') . "-00" . ($count + 1);
        }
        if ($count > 100 && $count < 1000) {
            $this->request->data['Commande']['ref'] = "BC-" . date('y') . date('m') . date('d') . "-0" . ($count + 1);
        }
        $this->request->data['Commande']['type'] = 'Transport';
        $this->request->data['Commande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        $this->request->data['Commande']['avoir'] = 0;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
            if ($this->Receiver->save($data['Receiver'])) {
                $receiver_id = $this->Receiver->getLastInsertID();
                $this->request->data['Commande']['receiver_id'] = $receiver_id;
                if ($this->Commande->save($this->request->data['Commande'])) {
                    $last_id = $this->Commande->getLastInsertID();
                    $this->Commande->id = $last_id;
//                    $user_id = $this->Commande->read()['Commande']['user_id'];
                    $state = $this->Commande->read()['Commande']['state'];
                    $operation = 'En attente ramassage';
                    if ($state === 'Non Traitée depot') {
                        $operation = 'En attente dépôt';
                    }
                    $historique = array(
                        'Historique' => array(
                            'id' => null,
                            'commande_id' => $last_id,
                            'user_id' => 0,
                            'operation' => $operation,
                            'cause_operation' => NULL
                        )
                    );
                    $this->Historique->save($historique);
                    foreach ($data['Bon'] as $bon):
                        $bon['id'] = null;
                        $bon['commande_id'] = $last_id;
                        $this->Bon->save($bon);
                    endforeach;
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("Commande passée avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }
            die();
        }
    }

    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $count = $this->Commande->find('count');
        $this->request->data['Commande']['ref'] = "BC-" . date('y') . date('m') . date('d') . "-" . ($count + 1);
        $this->request->data['Commande']['type'] = 'Commande';
        $this->request->data['Commande']['last_timbre_price'] = $this->getConfiguration()['Configuration']['price_timbre'];
        $this->request->data['Commande']['avoir'] = 0;
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->Commande->save($data)) {
                $last_id = $this->Commande->getLastInsertID();
                foreach ($data['Bon'] as $bon):
                    $bon['id'] = null;
                    $bon['commande_id'] = $last_id;
                    $this->Bon->save($bon);
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande passée avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function edit() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->Commande->recursive = -1;
        $id = $this->request->data['Commande']['id'];
        $this->Commande->id = $id;
//        if (!$this->Commande->exists()) {
//            http_response_code(404);
//            echo json_encode(array(
//                'text' => __("Commande non trouvée"),
//                'status' => 200,
//                'type' => 'success'
//            ));
//            die();
//        }
//        $commande = $this->Commande->read();
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data['Commande']); die();
            if ($this->Commande->save($data['Commande'])) {
                foreach ($data['Bon'] as $bon):
                    if ($bon['bon_id'] != 0) {
                        $bon['id'] = $bon['bon_id'];
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    } else {
                        $bon['id'] = null;
                        $bon['commande_id'] = $id;
                        $this->Bon->save($bon);
                    }
                endforeach;
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commande Modifié avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
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

// delete commande
    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Commande->delete($this->request->data['Commande']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Cette Commande a était supprimée avec succès"),
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

// delete commande
    function delete_espaceclient() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Commande->delete($this->request->data['Commande']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Cette Commande a était supprimée avec succès"),
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

    // delete bon
    function delete_bon() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Bon->delete($this->request->data['Bon']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("cette bon a était supprimé avec succès"),
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

    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->recursive = 2;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'Fournisseur', 'User.Payment', 'Commercial', 'User.Ville', 'Bon', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Livreur', 'Historique', 'Historique.User', 'Historique.Commande');
            $data = $this->request->data;
            $this->Commande->id = $data['Commande']['id'];
            $commande = $this->Commande->read();
            if (!empty($commande)) {
//                http_response_code(200);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $commande,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvée"),
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

    public function view_bon_chargement() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->recursive = 2;
//            $this->Chargement->contain('Commande', 'Commande.User', 'Commande.Receiver', 'Commande.Receiver.Ville', 'Commande.Commercial', 'Commande.Livreur', 'Commande.User.Ville', 'Commande.Bon', 'Commande.Bon.Product');
            $data = $this->request->data;
            $this->Chargement->contain('Livreur', 'Historique', 'Historique.User', 'Commercial', 'Commande', 'Commande.User', 'Commande.Receiver', 'Commande.Receiver.Ville', 'Commande.Commercial', 'Commande.Livreur', 'Commande.User.Ville', 'Commande.Bon', 'Commande.Bon.Product');
            $this->Chargement->id = $data['Chargement']['id'];
            $chargement = $this->Chargement->read();
            $montant = 0;
            foreach ($chargement['Commande'] as $com):
                $mantantChargement = $com['mantant'];
                if ($com['isContreRembourcement'] == FALSE || $com['isContreRembourcement'] == 0) {
                    $mantantChargement = 0;
                }
                $montant += $mantantChargement;
            endforeach;
            $commandescount = $this->Commande->find('count', array(
                'conditions' => array('Commande.chargement_id' => $chargement['Chargement']['id'])
            ));
            if (!empty($chargement)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $chargement,
                    'data' => number_format($montant, 3, ",", " "),
                    'commandescount' => $commandescount,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Bon chargement non trouvée"),
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

    public function view_bon_ramassage() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Ramassage->contain('Livreur', 'Historique', 'User', 'Historique.User', 'Commercial', 'Commande', 'Commande.User', 'Commande.Receiver', 'Commande.Receiver.Ville', 'Commande.Commercial', 'Commande.Livreur', 'Commande.User.Ville', 'Commande.Bon', 'Commande.Bon.Product');
            $this->Ramassage->id = $data['Ramassage']['id'];
            $ramassage = $this->Ramassage->read();
            $ramassageview = $this->Ramassage->find('first', array(
                'conditions' => array('Ramassage.id' => $data['Ramassage']['id'])
            ));
            $montant = 0;
            foreach ($ramassage['Commande'] as $com):
                $mantantRamassage = $com['mantant'];
                if ($com['isContreRembourcement'] == FALSE || $com['isContreRembourcement'] == 0) {
                    $mantantRamassage = 0;
                }
                $montant += $mantantRamassage;
            endforeach;
            $commandescount = $this->Commande->find('count', array(
                'conditions' => array('Commande.ramassage_id' => $ramassage['Ramassage']['id'])
            ));
            if (!empty($ramassage)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $ramassage,
                    'data' => number_format($montant, 3, ",", " "),
                    'commandescount' => $commandescount,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Bon ramassage non trouvée"),
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

    // view commande for code barre
    public function view_commandebarrecode() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Payment', 'User.Ville', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Historique', 'Historique.User', 'Historique.Commande', 'Livreur');
            $data = $this->request->data;
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $data['Commande']['ref'])
            ));
//            debug($data);
//            debug($commande);
//            die();
            if (!empty($commande)) {
//                http_response_code(200);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $commande,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvée"),
                    'status' => 200,
                    'type' => 'error'
                )));
                $this->response->send();
                die();
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

    // view commande en cas de bon chargement
    public function view_commandebarrecode_bonchargement() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Payment', 'User.Ville', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Historique', 'Historique.User', 'Historique.Commande', 'Livreur');
            $data = $this->request->data;
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $data['Commande']['ref'])
            ));
//            debug($data);
//            debug($commande);
//            die();
            if (!empty($commande)) {
//                http_response_code(200);
                if ($commande['Commande']['isAnnule'] == false) {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => $commande,
                        'status' => 200,
                        'type' => 'success'
                    )));
                    $this->response->send();
                } else {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => __("Commande en état d'annulation, veuillez l'activer d'abord"),
                        'status' => 200,
                        'type' => 'warning'
                    )));
                    $this->response->send();
                }
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvée"),
                    'status' => 200,
                    'type' => 'error'
                )));
                $this->response->send();
                die();
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

    // view commande for code barre
    public function view_commandebarrecode_stock() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Commande->recursive = -1;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'User.Payment', 'User.Ville', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite', 'Historique', 'Historique.User', 'Historique.Commande', 'Livreur');
            $data = $this->request->data;
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $data['Commande']['ref'])
            ));
//            debug($data);
//            debug($commande);
//            die();
            if (!empty($commande)) {
                if ($commande['Commande']['isStock'] == false) {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => $commande,
                        'status' => 200,
                        'type' => 'success'
                    )));
                    $this->response->send();
                } else {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => __('Commande déjà en stock'),
                        'status' => 200,
                        'type' => 'warning'
                    )));
                    $this->response->send();
                }
//                http_response_code(200);

                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvée"),
                    'status' => 200,
                    'type' => 'error'
                )));
                $this->response->send();
                die();
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

    public function view_by_ref() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Commande->recursive = 2;
            $this->Commande->contain('User', 'Receiver', 'Receiver.Ville', 'Receiver.Delegation', 'Receiver.Localite', 'Fournisseur', 'User.Payment', 'Commercial', 'User.Ville', 'Bon', 'Bon.Product', 'Bon.Product.Stock', 'Bon.Product.Unite');
            $data = $this->request->data;
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $data['Commande']['ref'])));
            if (!empty($commande)) {
//                http_response_code(200);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'data' => $commande,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Commande non trouvée"),
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
    
   

}

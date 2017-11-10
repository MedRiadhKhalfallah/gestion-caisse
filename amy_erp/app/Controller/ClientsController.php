<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP ClientsController
 * @author hedi
 */
class ClientsController extends AppController {

    public $uses = array('Client', 'Commande', 'User', 'Utilisateur');

    public function beforeFilter() { 
        parent::beforeFilter();
        $this->Auth->allow('list_clients', 'verif_domain', 'attenteramassagedepot', 'recuperees', 'enstock', 'livrees', 'retours', 'annulees', 'facturees');
    }

    public function verif_domain() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('ajax', 'post'))) {
            $data = $this->request->data;
            $client = $this->Client->find('first', array(
                'conditions' => array('Client.domain_name' => $data['Client']['domain_name']),
            ));
            if (!empty($client)) {
                header("HTTP/1.1 200 OK");
                if ($client['Client']['active'] == true) {
                    echo json_encode(array(
                        'data' => $client,
                        'status' => 200,
                        'type' => 'success'
                    ));
                } else {
                    echo json_encode(array(
                        'text' => __("Domaine non activé"),
                        'status' => 200,
                        'type' => 'wait'
                    ));
                }
                die();
            } else {
                header('HTTP/1.0 404 Not Found');
                echo json_encode(array(
                    'text' => __("Domaine non enregistré"),
                    'status' => 404,
                    'type' => 'error'
                ));
                die();
            }
        }
        header('HTTP/1.0 403 Forbidden');
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

    public function save_client($data = array()) {
        if (!empty($data)) {
            if (!empty($data['email']) && !empty($data['username'])) {
                require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
                require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
                //Transport
                $transport = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
                        ->setUsername('h.riahi@amyevolution.com')
                        ->setPassword('amy1234567');
                // DKIM 
                $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
                $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');

                //Message
                $emailBody = "";
                if ($data['typesave'] === 'add_client') {
                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "account.html");
                } else {
                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "account_edit.html");
                }
                $emailClient = $data['email'];
                $full_name = $data['full_name'];
                $emailBody_new = str_replace("#username#", $data['username'], $emailBody);
                $emailBody_new = str_replace("#password#", $data['password'], $emailBody_new);
                $emailBody_new = str_replace("#full_name#", $full_name, $emailBody_new);
                $message = Swift_Message::newInstance()
                        ->attachSigner($signer)
                        ->setTo($emailClient)
                        ->setCc(array(
                            'support-erp@amyevolution.com',
                            'commercial@colisexpress.tn',
                            't.mohamed@amyevolution.com'
                        ))
                        ->setSubject("Compte Espace Client")
                        ->setBody('Plateforme ColisExpress.tn')
                        ->addPart($emailBody_new, 'text/html')
                        ->addPart(strip_tags($emailBody_new))
                        ->setFrom('no-reply@colisexpress.tn');
                //Sending
                $mailer = Swift_Mailer::newInstance($transport);
                $mailer->send($message);
            }
            return $this->Utilisateur->save($data);
        }
    }

    public function delete_client($user = array()) {
        $this->Utilisateur->id = $user['User']['id'];
        if (!empty($this->Utilisateur->read())) {
            $this->Utilisateur->saveField('if_delete', true);
            $this->Utilisateur->saveField('date_delete', date('Y-m-d H:i:s'));
        }
        return true;
    }

// liste clients
    public function list_clients() {
        header('Access-Control-Allow-Origin: *');
        $this->User->recursive = -1;
        if ($this->request->is('post')) {
            $clients = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('client')),
                'order' => array('User.full_name ASC'),
                'fields' => array(
                    'CONCAT(User.first_name, " ", User.last_name) AS NomComplet',
                    'User.nom_commercial AS NomCommercial',
                    'User.raison_social AS RaisonSociale',
                    'User.first_name AS Nom',
                    'User.last_name AS Prenom',
                    'User.email AS Email',
                    'User.phone AS Telephone',
                    'User.adress AS Adresse',
                    'User.frais_livraison AS FraisLivraison',
                    'User.frais_annulation AS FraisAnnulation',
                )
            ));
            http_response_code(200);
            $clients_exports = array();
            if (!empty($clients)) {
                foreach ($clients as $client):
                    if (empty($client['User']['NomCommercial'])) {
                        $client['User']['NomCommercial'] = "";
                    }
                    if (empty($client['User']['RaisonSociale'])) {
                        $client['User']['RaisonSociale'] = "";
                    }
                    if (empty($client['User']['Email'])) {
                        $client['User']['Email'] = "";
                    }
                    array_push($clients_exports, $client['User']);
                endforeach;
            }
            echo json_encode($clients_exports);
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

// espace client
// commande en attente dépot ou ramassage
    public function attenteramassagedepot() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $countnotaffect = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id' => 0, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            $countaffect = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.livreur_id <>' => 0, 'Commande.state' => array('Non Traitée', 'Non Traitée depot'), 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'countnotaffect' => $countnotaffect,
                'countaffect' => $countaffect,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

// commande récupérées
    public function recuperees() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'En Cours', 'Commande.user_id' => $this->request->data['Commande']['user_id'])
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
    }

// commande en stock
    public function enstock() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('En stock', 'AttenteLivraison', 'Retour'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $countwaitdone = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('En stock', 'AttenteLivraison'), 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            $countwaitcancel = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.isStock' => 1, 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            $countwaitback = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour', 'Commande.isStock' => 1, 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            http_response_code(200);
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
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

// commandes livrées
    public function livrees() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Livrée', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Livrée', 'Commande.user_id' => $this->request->data['Commande']['user_id'])
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
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

// commandes facturees
    public function facturees() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Facturée', 'Retour Expéditeur'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
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

// commande retours
    public function retours() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => array('Retour', 'Ratour Expéditeur'), 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $countretour = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Retour', 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            $countretourexpediteur = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Ratour Expéditeur', 'Commande.user_id' => $this->request->data['Commande']['user_id'])
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $commandesespaceclient,
                'countretour' => $countretour,
                'countretourexpediteur' => $countretourexpediteur,
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

// commandes annulées
    public function annulees() {
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
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.user_id' => $this->request->data['Commande']['user_id']),
                'order' => array('Commande.modified DESC')
            ));
            $count = $this->Commande->find('count', array(
                'conditions' => array('Commande.type' => 'Transport', 'Commande.state' => 'Annulée', 'Commande.user_id' => $this->request->data['Commande']['user_id'])
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
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

}

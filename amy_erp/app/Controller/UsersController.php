<?php

App::uses('AppController', 'Controller');
App::uses('ClientsController', 'Controller');

class UsersController extends AppController {

    public $uses = array('User', 'Ville', 'Commercial', 'PaymentsUser');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('init_admin');
        $this->Auth->allow('add_employe', 'list_clients', 'presence_list', 'presence_employee', 'addemail', 'list_employee', 'index_angular', 'edit_employe', 'add-employee', 'upload_file', 'login_livreur_m', 'login', 'login_client', 'login_livreur', 'index', 'list_clients', 'login', 'add_client', 'logout', 'add', 'edit', 'view', 'delete', 'add_commerciale', 'list_commerciales', 'edit_client');
    }

//    public function update_id_fisc() {
//        $clients = $this->User->find('all', array(
//            'conditions' => array('User.role_id' => $this->getRole('client'))
//        ));
//        foreach ($clients as $client):
//            $oldMf = str_replace(" ", "/", $client['User']['matricule']);
//            if (!empty($oldMf)) {
//                $newID = explode("/", $oldMf);
//                $matricule = $newID[0] . $newID[1];
//                $code_tva = $newID[2];
//                $code_cat = $newID[3];
//                $num_etab = $newID[4];
//                $newData = array(
//                    'User' => array(
//                        'id' => $client['User']['id'],
//                        'matricule' => $matricule,
//                        'codetva' => $code_cat,
//                        'code_category' => $code_cat,
//                        'num_etab' => $num_etab
//                    )
//                );
//                debug($this->User->save($newData));
//            }
//        endforeach;
//        die();
//    }

    public function login() {
        $allowedDomains = array('*');
        $allowedMethods = array('POST,OPTIONS');
        $allowedHeaders = array('Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
        $this->response->cors($this->request, $allowedDomains, $allowedMethods, $allowedHeaders);
        $this->response->header('Content-type: application/json');
        if ($this->request->is(array('post', 'options'))) {
            $this->User->contain('Role');
            if ($this->Auth->login()) {
//                $this->response->mustRevalidate(true);
                if (in_array($this->Session->read('Auth.User.Role.name'), array('admin', 'manager'))) {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => __("Bienvenue " . $this->Session->read('Auth.User.full_name')),
                        'status' => 200,
                        'type' => 'success',
                        'user_id' => $this->Session->read('Auth.User.id'),
                        'user' => $this->Session->read('Auth.User.full_name'),
                        'email_host' => $this->getConfiguration()['Configuration']['email_host'],
                        'email' => $this->Session->read('Auth.User.email'),
                        'email_password' => $this->Session->read('Auth.User.email_password'),
                        'avatar' => $this->Session->read('Auth.User.avatar'),
                        'role' => $this->Session->read('Auth.User.Role.name')
                    )));
                } else {
                    $this->Session->destroy();
                    $this->response->body(json_encode(array(
                        'text' => __("Login ou mot de passe érronés!"),
                        'status' => 404,
                        'type' => 'error'
                    )));
                }
            } else {
//                $this->response->mustRevalidate(true);
//                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Login ou mot de passe érronés!"),
                    'status' => 404,
                    'type' => 'error'
                )));
            }
        } else {
//            $this->response->mustRevalidate(true);
//            $this->response->statusCode(403);
            $this->response->body(json_encode(array(
                'text' => __("No Allowed To Access"),
                'status' => 403,
                'type' => 'error'
            )));
        }
        $this->response->send();
        die();
    }

    public function addemail() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            debug($data);
//            debug($this->request);
//            die();
            $file = $this->params['form']['file'];
//            debug($file);
            $dir = APP . "webroot" . DS . "tmp_email";
            $attachements = null;
            $filename = "";
            if (!empty($file)) {
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                $filename = $file['name'];
                if (move_uploaded_file($file['tmp_name'], $dir . DS . $filename)) {
//                    $attachements = Swift_Attachment::newInstance($dir . DS . $filename);
                }
            }

            require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
//            require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
            //Transport
            $mailbox = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
                    ->setUsername('h.riahi@amyevolution.com')
                    ->setPassword('amy1234567');
            // DKIM 
            $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
            $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
            $message = Swift_Message::newInstance()
                    ->attachSigner($signer)
                    ->setTo($data['email'])
//                    ->setCc($data['mail_copie'])
                    ->setSubject($data['objet'])
                    ->attach(Swift_Attachment::fromPath($dir . DS . $filename))
//                    ->attach(new Swift_Attachment($file['tmp_name'], $file['name']))
//                    ->setAttachments($file)
//                    ->addAttachment($file['tmp_name'])
//                    ->setBody('Plateforme ColisExpress.tn')
                    ->addPart($data['content'], 'text/html')
//                    ->addPart()
                    ->setFrom('test@amyevolution.com');
            //Sending
            $mailer = Swift_Mailer::newInstance($mailbox);

            debug($message);
            debug($mailer->send($message));
            unlink($dir . DS . $filename);
            die();
        }
        die();
    }

    public function index_angular() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $users = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
            ));
            if (!empty($users)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $users,
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

    public function presence_list() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $presences = $this->User->find('all'
//                            , array(
//                'conditions' => array('Presence.role_id' => $this->getRole('employee')),
//                'order' => array('Presence.user_id ASC'),
//                    )
            );
            debug($presences);
            die();

            if (!empty($presences)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $presences,
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

    public function presence_employee() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            debug($data);
            die();
            if ($this->User->save($data)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('pointage ajouté avec succès'),
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

    public function login_client() {
        $allowedDomains = array('https://espaceclient.amyevolution.com', 'https://espaceclient.amyevolution.com', 'http://espaceclient.amyevolution.com');
        $allowedMethods = array('POST,OPTIONS');
        $allowedHeaders = array('Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
        $this->response->cors($this->request, $allowedDomains, $allowedMethods, $allowedHeaders);
        $this->response->header('Content-type: application/json');
        if ($this->request->is(array('post', 'options'))) {
            $this->User->contain('Role');
            if ($this->Auth->login()) {
                if (in_array($this->Session->read('Auth.User.Role.name'), array('client'))) {
                    $this->response->statusCode(200);
                    $this->response->body(json_encode(array(
                        'text' => __("Bienvenue !"),
                        'status' => 200,
                        'type' => 'success',
                        'user_id' => $this->Session->read('Auth.User.id'),
                        'user' => $this->Session->read('Auth.User.full_name'),
                        'nom_commercial' => $this->Session->read('Auth.User.full_name'),
                        'raison_social' => $this->Session->read('Auth.User.raison_social'),
                        'first_name' => $this->Session->read('Auth.User.first_name'),
                        'last_name' => $this->Session->read('Auth.User.last_name'),
                        'phone' => $this->Session->read('Auth.User.phone'),
                        'adress' => $this->Session->read('Auth.User.adress'),
                        'avatar' => $this->Session->read('Auth.User.avatar'),
                        'role' => $this->Session->read('Auth.User.Role.name')
                    )));
                } else {
                    $this->Session->destroy();
                    $this->response->body(json_encode(array(
                        'text' => __("Login ou mot de passe érronés!"),
                        'status' => 404,
                        'type' => 'error'
                    )));
                }
            } else {
//                $this->response->mustRevalidate(true);
//                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Login ou mot de passe érronés!"),
                    'status' => 404,
                    'type' => 'error'
                )));
            }
        } else {
//            $this->response->mustRevalidate(true);
//            $this->response->statusCode(403);
            $this->response->body(json_encode(array(
                'text' => __("No Allowed To Access"),
                'status' => 403,
                'type' => 'error'
            )));
        }
        $this->response->send();
        die();
    }

    public function list_employee() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $users = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
            ));
            if (!empty($users)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $users,
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

    public function login_livreur() {
        $allowedDomains = array('https://livraison.amyevolution.com');
        $allowedMethods = array('POST,OPTIONS');
        $allowedHeaders = array('Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
        $this->response->cors($this->request, $allowedDomains, $allowedMethods, $allowedHeaders);
        $this->response->header('Content-type: application/json');
        if ($this->request->is(array('post', 'options'))) {
            $this->User->contain('Role');
            if ($this->Auth->login()) {
//                $this->response->mustRevalidate(true);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Bienvenue " . $this->Session->read('Auth.User.full_name')),
                    'status' => 200,
                    'type' => 'success',
                    'user_id' => $this->Session->read('Auth.User.id'),
                    'user' => $this->Session->read('Auth.User.full_name'),
                    'first_name' => $this->Session->read('Auth.User.first_name'),
                    'last_name' => $this->Session->read('Auth.User.last_name'),
                    'phone' => $this->Session->read('Auth.User.phone'),
                    'adress' => $this->Session->read('Auth.User.adress'),
                    'avatar' => $this->Session->read('Auth.User.avatar'),
                    'role' => $this->Session->read('Auth.User.Role.name')
                )));
            } else {
//                $this->response->mustRevalidate(true);
//                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Login ou mot de passe érronés!"),
                    'status' => 404,
                    'type' => 'error'
                )));
            }
        } else {
//            $this->response->mustRevalidate(true);
//            $this->response->statusCode(403);
            $this->response->body(json_encode(array(
                'text' => __("No Allowed To Access"),
                'status' => 403,
                'type' => 'error'
            )));
        }
        $this->response->send();
        die();
    }

    public function login_livreur_m() {
        $allowedDomains = array('*');
        $allowedMethods = array('POST,OPTIONS');
        $allowedHeaders = array('Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
        $this->response->cors($this->request, $allowedDomains, $allowedMethods, $allowedHeaders);
        $this->response->header('Content-type: application/json');
        if ($this->request->is(array('post', 'options'))) {

            $this->User->contain('Role');
            if ($this->Auth->login()) {
//                $this->response->mustRevalidate(true);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __("Bienvenue " . $this->Session->read('Auth.User.full_name')),
                    'status' => 200,
                    'type' => 'success',
                    'user_id' => $this->Session->read('Auth.User.id'),
                    'user' => $this->Session->read('Auth.User.full_name'),
                    'first_name' => $this->Session->read('Auth.User.first_name'),
                    'last_name' => $this->Session->read('Auth.User.last_name'),
                    'phone' => $this->Session->read('Auth.User.phone'),
                    'adress' => $this->Session->read('Auth.User.adress'),
                    'avatar' => $this->Session->read('Auth.User.avatar'),
                    'role' => $this->Session->read('Auth.User.Role.name')
                )));
            } else {
//                $this->response->mustRevalidate(true);
//                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Login ou mot de passe érronés!"),
                    'status' => 404,
                    'type' => 'error'
                )));
            }
        } else {
//            $this->response->mustRevalidate(true);
//            $this->response->statusCode(403);
            $this->response->body(json_encode(array(
                'text' => __("No Allowed To Access"),
                'status' => 403,
                'type' => 'error'
            )));
        }
        $this->response->send();
        die();
    }

    public function logout() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        http_response_code(200);
        $this->Auth->logout();
        echo json_encode(array(
            'text' => __("Vous êtes à présent déconnecté"),
            'status' => 200,
            'type' => 'success'
        ));
        die();
    }

    public function index() {
        header('Access-Control-Allow-Origin: *');
        $this->User->recursive = -1;
        if ($this->request->is('post')) {
            $users = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('admin')),
                'order' => array('User.full_name ASC'),
            ));
            http_response_code(200);
            echo json_encode($users);
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

// liste clients
    public function list_clients() {
        header('Access-Control-Allow-Origin: *');
        $this->User->recursive = -1;
        if ($this->request->is('post')) {
            $this->User->contain('Ville');
            $clients = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('client')),
                'order' => array('User.full_name ASC'),
            ));
            http_response_code(200);
            echo json_encode($clients);
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

// add client
    public function add_client() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $maxid = $this->User->find('first', array(
            'fields' => 'MAX(User.id) as id',
        ));
        $maxid = $maxid[0]['id'];
        $this->request->data['User']['code'] = 'C' . $maxid . date('Y');
        $this->request->data['User']['role_id'] = $this->getRole('client');
        if ($this->request->is(array('post', 'ajax'))) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->User->save($data)) {
                $clientController = new ClientsController();
                $last_id = $this->User->getLastInsertID();
                $data['User']['id'] = $last_id;
                $this->User->id = $data['User']['id'];
                $client = $this->User->read();
                $data['User']['full_name'] = $client['User']['first_name'] . " " . $client['User']['last_name'];
                $data['User']['domain'] = "colisexpress.tn";
                $data['User']['typesave'] = "add_client";
//                $clientController->save_client($data['User']);
                if (!empty($data['Data'])) {
                    foreach ($data['Data'] as $paymentuser):
                        $pu = array(
                            'PaymentsUser' => array(
                                'id' => null,
                                'user_id' => $last_id,
                                'payment_id' => $paymentuser['id']
                            )
                        );
                        $this->PaymentsUser->save($pu);
                    endforeach;
                }
                $this->User->id = $last_id;
                $lastclient = $this->User->read()['User'];
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Client ajouté avec succès"),
                    'data' => $lastclient,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function upload_file($id = null) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $file = $this->params['form']['file'];
            $this->User->id = $id;
            $this->User->recursive = -1;
            $userClient = $this->User->read()['User']['full_name'];
//            debug($id);
//            debug($file);
////            debug($userClient);
//            die();
            if (!empty($file)) {
                $dir = IMAGES . "logo_user";
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
//                $heurs = date($dir)
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($userClient . time())), "-")) . "." . $ext;
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
                    $this->request->data['url'] = "logo_user" . DS . $filename;
                    $user['User'] = $this->request->data;
                    $user = array(
                        'User' => array(
                            'id' => $id,
                            'url' => $this->request->data['url']
                        )
                    );
//                    debug($ext);
//                    debug($user);
//                    die();
                    $this->User->id = $id;
                    if ($this->User->saveField('url', $this->request->data['url'])) {
                        http_response_code(200);
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'text' => __("logo mis à jours avec succès"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            }
        }
        die();
    }

// liste commerciales
    public function list_commerciales() {
        header('Access-Control-Allow-Origin: *');
        $this->User->recursive = -1;
        if ($this->request->is('post')) {
            $commerciales = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('commerciale')),
                'order' => array('User.full_name ASC'),
            ));
            http_response_code(200);
            echo json_encode($commerciales);
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

// add commerciale
    public function add_commerciale() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $maxid = $this->User->find('first', array(
            'fields' => 'MAX(User.id) as id',
        ));
        $maxid = $maxid[0]['id'];
        $this->request->data['User']['code'] = 'COM' . $maxid . date('Y');
        $this->request->data['User']['role_id'] = $this->getRole('commerciale');
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->User->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Commerciale ajouté avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

//add user admin
    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $maxid = $this->User->find('first', array(
            'conditions' => $this->getRole('client'),
            'fields' => 'MAX(User.id) as id'
        ));
        $maxid = $maxid[0]['id'];
        $this->request->data['User']['code'] = 'C' . $maxid . date('Y');
        $this->request->data['User']['role_id'] = $this->getRole('admin');
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->User->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Utilisateur ajouté avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function add_employe() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            debug($data); die();
            if ($this->User->save($data)) {
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

// view user || client || commerciales
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->User->contain('Ville', 'Payment', 'Commercial');
            $data = $this->request->data;
            $this->User->id = $data['User']['id'];
            $client = $this->User->read();
            if (!empty($client)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $client,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                $this->response->statusCode(403);
                $this->response->body(json_encode(array(
                    'text' => __("Client non trouvé"),
                    'status' => 403,
                    'type' => 'success'
                )));
            }
            die();
        }
        die();
    }

    public function view_employee() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->User->contain('first_name', 'last_name', 'statu', 'phone', 'email', 'salaire');
            $data = $this->request->data;
            $this->User->id = $data['User']['id'];
            $client = $this->User->read();
            if (!empty($user)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $user,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                $this->response->statusCode(403);
                $this->response->body(json_encode(array(
                    'text' => __("Employee non trouvé"),
                    'status' => 403,
                    'type' => 'success'
                )));
            }
            die();
        }
        die();
    }

    function edit_employe() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data); 
//            die(); 
            if ($this->User->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Employee modifiée avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->User->read();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

// edit user || client
    function edit() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->User->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Client modifiée avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->User->read();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

// edit user || client
    function edit_client() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->User->save($data['User'])) {
                $clientController = new ClientsController();
                $this->User->id = $data['User']['id'];
                $client = $this->User->read();
                $data['User']['email'] = $client['User']['email'];
                $data['User']['full_name'] = $client['User']['first_name'] . " " . $client['User']['last_name'];
                $data['User']['domain'] = "amyevolution.com";
                $data['User']['typesave'] = "edit_client";

//                $clientController->save_client($data['User']);
                $paymentsusers = $this->PaymentsUser->find('all', array(
                    'conditions' => array('PaymentsUser.user_id' => $data['User']['id'])
                ));
                foreach ($paymentsusers as $payment):
                    $this->PaymentsUser->delete($payment['PaymentsUser']['id']);
                endforeach;
                if (!empty($data['PaymentList'])) {
                    foreach ($data['PaymentList'] as $paymentuser):
                        $pu = array(
                            'PaymentsUser' => array(
                                'id' => null,
                                'user_id' => $data['User']['id'],
                                'payment_id' => $paymentuser['id']
                            )
                        );
                        $this->PaymentsUser->save($pu);
                    endforeach;
                }
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Client modifiée avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->User->read();
//            unset($this->request->data['User']['password']);
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

// delete user || client
    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->User->contain('Role');
            $this->User->id = $this->request->data['User']['id'];
            $user = $this->User->read();
//            if ($user['Role']['name'] === 'client') {
//                $clientController = new ClientsController();
//                $clientController->delete_client($user);
//            }
            $this->User->delete($this->request->data['User']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Client supprimé avec succès"),
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

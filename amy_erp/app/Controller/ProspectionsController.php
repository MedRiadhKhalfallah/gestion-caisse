<?php

App::uses('AppController', 'Controller');

/**
 * Commandes Controller
 *
 * @property Commande $Commande
 * @property PaginatorComponent $Paginator
 */
class ProspectionsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('ajoutermsg', 'index', 'ajoutermultimsg', 'addemail', 'ajoutermultiemail', 'historiquemsg', 'historiqueemail');
    }

    public $uses = array('Prospection', 'User');

    public function ajoutermsg() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//                debug($data);
//                die();
            if ($this->Prospection->save($data)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('message envoyé avec succès'),
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

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $msg = $this->Prospection->find('all', array(
                'conditions' => array('Prospection.type' => 'message')
            ));
//            debug($msg); die();
            if (!empty($msg)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $msg,
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

    public function ajoutermultimsg() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        foreach ($tableuser as $value) {
//            debug($this->request);

        if ($this->request->is('post')) {
            $data = $this->request->data;
//            debug($data); die();
            foreach ($data['User'] as $msg):
                $msgEnr = array(
                    'Prospection' => array(
                        'content' => $data['Prospection']['content'],
                        'type' => $data['Prospection']['type'],
                        'user_id' => $msg['id']
                ));
                $this->Prospection->save($msgEnr);
            endforeach;
            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'text' => __('message envoyé avec succès'),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

// fonction permettant d'envoyer les e-mail    
    public function addemail() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->User->id = $data['Prospection']['user_id'];
            $user_email = $this->User->read()['User']['email'];
            if ($this->Prospection->save($data)) {
//                début envoie email
//
//            debug($user_email);
//            die(); 
                if (!empty($user_email)) {
                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
                    //Transport
                    $prospection = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
                            ->setUsername('h.riahi@amyevolution.com')
                            ->setPassword('amy1234567');
                    // DKIM 
                    $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
                    $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
                    //Message
                    $emailBody = "";
                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "prospectionemail.html");
                    $this->User->id = $data['Prospection']['user_id'];
                    $full_name = $this->User->read()['User']['full_name'];
                    $emailBody_new = str_replace("#content#", $data['Prospection']['content'], $emailBody);
                    $emailBody_new = str_replace("#full_name#", $full_name, $emailBody_new);
//                    debug($emailBody_new);
                    $message = Swift_Message::newInstance()
                            ->attachSigner($signer)
                            ->setTo($user_email)
                            ->setSubject("Prospection email")
                            ->setBody('Plateforme Prospection email')
                            ->addPart($emailBody_new, 'text/html')
                            ->addPart(strip_tags($emailBody_new))
                            ->setFrom('AzzouzSourour@amyevolution.com');
                    //Sending
                    $mailer = Swift_Mailer::newInstance($prospection);
                    $mailer->send($message);
                }
//                if (!empty($user_email)) {
//                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
//                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
//                    //Transport
//                    $prospection = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
//                            ->setUsername('h.riahi@amyevolution.com')
//                            ->setPassword('amy1234567');
//                    // DKIM 
//                    $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
//                    $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
//                    //Message
//                    $emailBody = "";
//
////                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "prospection.html");
//
////                        $user_email = $data['email'];
////                        $debug($data);
////                        $full_name = $data['full_name'];
////                $emailBody_new = str_replace("#username#", $data['username'], $emailBody);
////                $emailBody_new = str_replace("#password#", $data['password'], $emailBody_new);
////                $emailBody_new = str_replace("#full_name#", $full_name, $emailBody_new);
//                    $message = Swift_Message::newInstance()
//                            ->attachSigner($signer)
//                            ->setTo($user_email)
//                            ->setSubject("Compte Espace Client")
//                            ->setBody('Plateforme ColisExpress.tn')
////                            ->addPart($emailBody, 'text/html')
////                        ->addPart(strip_tags($emailBody_new))
//                            ->setFrom('nourbachrouch@gmail.com');
//                    //Sending
//                    $mailer = Swift_Mailer::newInstance($prospection);
//                    $mailer->send($message);
//                }
//           fin envoie email     
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('message envoyé avec succès'),
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

    public function ajoutermultiemail() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        if ($this->request->is('post')) {
            $data = $this->request->data;

//            debug($data); die();
            foreach ($data['User'] as $email):
//            debug($data);
//            die();
            $this->User->id = $email['id'];
            $user_email = $this->User->read()['User']['email'];
                $emailEnr = array(
                    'Prospection' => array(
                        'content' => $data['Prospection']['content'],
                        'type' => $data['Prospection']['type'],
                        'user_id' => $email['id']
                ));
                $this->Prospection->save($emailEnr);

                if (!empty($user_email)) {
                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
                    //Transport
                    $prospection = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
                            ->setUsername('h.riahi@amyevolution.com')
                            ->setPassword('amy1234567');
                    // DKIM 
                    $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
                    $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
                    //Message
                    $emailBody = "";
                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "prospectionemail.html");
//                    $this->User->id = $data['Prospection']['user_id'];
                    $this->User->id = $email['id'];
                    $full_name = $this->User->read()['User']['full_name'];
                    $emailBody_new = str_replace("#content#", $data['Prospection']['content'], $emailBody);
                    $emailBody_new = str_replace("#full_name#", $full_name, $emailBody_new);
//                    debug($emailBody_new);
                    $message = Swift_Message::newInstance()
                            ->attachSigner($signer)
                            ->setTo($user_email)
                            ->setSubject("Prospection email")
                            ->setBody('Plateforme Prospection email')
                            ->addPart($emailBody_new, 'text/html')
                            ->addPart(strip_tags($emailBody_new))
                            ->setFrom('AzzouzSourour@amyevolution.com');
                    //Sending
                    $mailer = Swift_Mailer::newInstance($prospection);
                    $mailer->send($message);
                }
            endforeach;
            sleep('2');
             

            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'text' => __('e-mail envoyé avec succès'),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

    public function historiquemsg() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $data = $this->request->data;
//        debug($data);
//        die();
        if ($this->request->is('post')) {
            $msg = $this->Prospection->find('all', array(
                'conditions' => array('Prospection.type' => 'Message', 'Prospection.user_id' => $data['Prospection']['user_id'])
            ));
            if (!empty($msg)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $msg,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
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

    public function historiqueemail() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $data = $this->request->data;
//        debug($data);
//        die();
        if ($this->request->is('post')) {
            $email = $this->Prospection->find('all', array(
                'conditions' => array('Prospection.type' => 'Email', 'Prospection.user_id' => $data['Prospection']['user_id'])
            ));
//            debug($email); 
//            die();
            if (!empty($email)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $email,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
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

}

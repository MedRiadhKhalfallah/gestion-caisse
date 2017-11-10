<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP MessagesController
 * @author famille
 */
class MessagesController extends AppController {

    public $uses = array('Message');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('inbox');
    }

    public function inbox() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            
            $data = $this->request->data;
            $read = imap_open(
                    $data['User']['host'], $data['User']['username'], $data['User']['password']
            );
            $inbox = array();
//            ini_set('ignore_repeated_errors', 1);
            $array = imap_search($read, 'NEW');
//            $array = imap_search($read, 'ALL');
//            $error = imap_errors();
//            debug($array);
//            die();
            if ($array):
                rsort($array);
                foreach ($array as $result):
                    $overview = imap_fetch_overview($read, $result, 0);
                    $message = imap_body($read, $result, 0);
                    $reply = imap_headerinfo($read, $result, 0);
                    $messageParsed = $mailParser->parse($message);         // returns a ZBateson\MailMimeParser\Message

                    $structure = imap_fetchstructure($read, $result);

                    $attachments = array();
                    /* if any attachments found... */
                    if (isset($structure->parts) && count($structure->parts)) {
                        for ($i = 0; $i < count($structure->parts); $i++) {
                            $attachments[$i] = array(
                                'is_attachment' => false,
                                'filename' => '',
                                'name' => '',
                                'attachment' => ''
                            );

                            if ($structure->parts[$i]->ifdparameters) {
                                foreach ($structure->parts[$i]->dparameters as $object) {
                                    if (strtolower($object->attribute) == 'filename') {
                                        $attachments[$i]['is_attachment'] = true;
                                        $attachments[$i]['filename'] = $object->value;
                                    }
                                }
                            }

                            if ($structure->parts[$i]->ifparameters) {
                                foreach ($structure->parts[$i]->parameters as $object) {
                                    if (strtolower($object->attribute) == 'name') {
                                        $attachments[$i]['is_attachment'] = true;
                                        $attachments[$i]['name'] = $object->value;
                                    }
                                }
                            }

                            if ($attachments[$i]['is_attachment']) {
                                $attachments[$i]['attachment'] = imap_fetchbody($read, $result, $i + 1);

                                /* 3 = BASE64 encoding */
                                if ($structure->parts[$i]->encoding == 3) {
                                    $attachments[$i]['attachment'] = base64_decode($attachments[$i]['attachment']);
                                }
                                /* 4 = QUOTED-PRINTABLE encoding */ elseif ($structure->parts[$i]->encoding == 4) {
                                    $attachments[$i]['attachment'] = quoted_printable_decode($attachments[$i]['attachment']);
                                }
                            }
                        }
                    }
                    /* iterate through each attachment and save it */
                    foreach ($attachments as $attachment) {
                        if ($attachment['is_attachment'] == 1) {
                            $filename = $attachment['name'];
                            if (empty($filename))
                                $filename = $attachment['filename'];

                            if (empty($filename))
                                $filename = time() . ".dat";
                            $folder = "attachment/" . $overview[0]->from;
                            if (!is_dir($folder)) {
                                mkdir($folder);
                            }
                            $fp = fopen("./" . $folder . "/" . $result . "-" . $filename, "w+");
                            fwrite($fp, $attachment['attachment']);
                            fclose($fp);
                        }
                    }
//                    if (!empty($attachments)) {
//                        debug($attachments);
//                        die();
//                    }
                    $mail = array(
                        'Message' => array(
                            'id' => null,
                            'subject' => $overview[0]->subject,
                            'mail_from' => $overview[0]->from,
                            'mail_to' => '',
                            'created' => date('Y-m-d H:i:s', $overview[0]->udate),
                            'user_id' => $data['User']['user_id'],
//                            'fromMail' => $reply->from[0]->mailbox . '@' . $reply->from[0]->host,
                            'content' => $message,
//                            'contentformated' => $message->getTextContent(),
                            'type' => 'recieved'
                        )
                    );
//                    debug($mail);
                    $ifExistMail = $this->Message->find('first', array(
                        'conditions' => array(
                            'Message.subject' => $mail['Message']['subject'],
                            'Message.mail_from' => $mail['Message']['mail_from'],
                            'Message.mail_to' => $mail['Message']['mail_to'],
                            'Message.created' => $mail['Message']['created'],
                            'Message.content' => $mail['Message']['content'],
                            'Message.type' => $mail['Message']['type']
                        )
                    ));
                    if (empty($ifExistMail)) {
                        $this->Message->save($mail);
                    }
                endforeach;
//                die();
            endif;
            $messages = $this->Message->find('all', array(
                'conditions' => array('Message.type' => 'recieved', 'Message.user_id' => $data['User']['user_id']),
                'order' => array('Message.created DESC')
            ));
            $messagesCount = $this->Message->find('count', array(
                'conditions' => array('Message.type' => 'recieved', 'Message.state' => 'unread', 'Message.user_id' => $data['User']['user_id'])
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $messages,
                'countUnread' => $messagesCount,
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
        die();
    }

}

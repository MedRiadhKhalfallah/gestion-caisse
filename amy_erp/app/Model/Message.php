<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppModel', 'Model');
//APP . 'Vendor' . DS . 'MailParser' . DS . 'src' . DS . 'MailMimeParser.php';
App::uses('MailParser' . DS . 'src' . DS . 'MailMimeParser.php', 'Vendor');

/**
 * CakePHP Message
 * @author famille
 */
class Message extends AppModel {

    public $belongsTo = array(
        'User'
    );

//    public function afterFind($results, $primary = false) {
//        parent::afterFind($results, $primary);
//        $mailParser = new ZBateson\MailMimeParser\MailMimeParser();
//        foreach ($results as $k => $result):
//            if (!empty($result['Message']['content'])) {
//                $messageParsed = $mailParser->parse($result['Message']['content']);         // returns a ZBateson\MailMimeParser\Message
//
//                $result['Message']['html'] = $messageParsed->getTextContent();
//                $results[$k] = $result;
//            }
//        endforeach;
//        return $results;
//    }

}

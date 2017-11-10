<?php

App::uses('AppModel', 'Model');
App::uses('Commande', 'Model');
App::uses('AuthComponent', 'Controller/Component');

/**
 * User Model
 *
 * @property Region $Region
 * @property Role $Role
 * @property Devi $Devi
 * @property Profile $Profile
 */
class User extends AppModel {

    public $useTable = "users";
    public $virtualFields = array(
        'full_name' => 'CONCAT(User.first_name, " ", User.last_name)',
        'code_name' => 'CONCAT(User.code, " - ",User.first_name, " ", User.last_name)',
        'mf' => 'CONCAT(User.matricule, "/",User.codetva, "/", User.code_category, "/", User.num_etab)'
    );
    public $displayField = 'full_name';
    public $_schema = array(
        'id' => array(
            'type' => 'integer',
            'length' => 11
        ),
        'code' => array(
            'type' => 'string',
            'length' => 254
        ),
        'username' => array(
            'type' => 'string',
            'length' => 254
        ),
        'password' => array(
            'type' => 'string',
            'length' => 254
        ),
        'email' => array(
            'type' => 'string',
            'length' => 254
        ),
        'en_email' => array(
            'type' => 'string',
            'length' => 254
        ),
        'type_client' => array(
            'type' => 'string',
            'length' => 254
        ),
        'first_name' => array(
            'type' => 'string',
            'length' => 254
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 254
        ),
        'adress' => array(
            'type' => 'string',
            'length' => 254
        ),
        'postal' => array(
            'type' => 'string',
            'length' => 254
        ),
        'ville' => array(
            'type' => 'string',
            'length' => 254
        ),
        'raison_social' => array(
            'type' => 'string',
            'length' => 254
        ),
        'nom_commercial' => array(
            'type' => 'string',
            'length' => 254
        ),
        'matricule' => array(
            'type' => 'string',
            'length' => 254
        ),
        'codetva' => array(
            'type' => 'string',
            'length' => 254
        ),
        'code_category' => array(
            'type' => 'string',
            'length' => 254
        ),
        'num_etab' => array(
            'type' => 'string',
            'length' => 254
        ),
        'en_phone' => array(
            'type' => 'string',
            'length' => 254
        ),
        'phone' => array(
            'type' => 'string',
            'length' => 254
        ),
        'url' => array(
            'type' => 'string',
            'length' => 254
        ),
        'frais_livraison' => array(
            'type' => 'string',
            'length' => 254
        ),
        'frais_annulation' => array(
            'type' => 'string',
            'length' => 254
        ),
        'role_id' => array(
            'type' => 'integer',
            'length' => 11
        ),
        'ville_id' => array(
            'type' => 'integer',
            'length' => 11
        ),
        'commerciale_id' => array(
            'type' => 'integer',
            'length' => 11
        ),
    );
//    public $validate = array(
//        'username' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
//            ),
////            'uniqueUsername' => array(
////                'rule' => 'isUnique',
//////                'message' => "Ce Nom d'utilisateur est déjà choisi.",
////                'on' => 'create'
////            )
//        ),
//        'password' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
////                'message' => 'vous devez préciser votre mot de passe',
//                'allowEmpty' => false,
//            ),
//        ),
//        'first_name' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
////                'message' => 'vous devez préciser votre nom',
//                'allowEmpty' => false,
//            ),
//        ),
//        'last_name' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
////                'message' => 'vous devez préciser votre prénom',
//                'allowEmpty' => false,
//            ),
//        ),
//        'email' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
//            ),
//            'uniqueEmail' => array(
//                'rule' => 'isUnique',
////                'message' => "Cet email exite déjà",
//            // 'on' => 'create'
//            )
//        ),
//        'adress' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
////                'message' => 'vous devez préciser votre adresse',
//                'allowEmpty' => false,
//            ),
//        ),
//        'phone' => array(
//            'notBlank' => array(
//                'rule' => array('notBlank'),
////                'message' => 'vous devez préciser votre numéro de téléphone',
//                'allowEmpty' => false,
//            ),
//        ),
//        
//    );
    public $belongsTo = array(
        'Role' => array(
            'className' => 'Role',
            'foreignKey' => 'role_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Commercial' => array(
            'className' => 'Commerciale',
            'foreignKey' => 'commerciale_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => 'user_count'
        ),
        'Ville' => array(
            'className' => 'Ville',
            'foreignKey' => 'ville_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );
    public $hasMany = array(
        'Presence' => array(
            'className' => 'Presence',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => 'Presence.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Pointage' => array(
            'className' => 'Pointage',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => 'Pointage.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'PrimesUser' => array(
            'className' => 'PrimesUser',
            'foreignKey' => 'user_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );
    public $hasAndBelongsToMany = array(
        'Payment' => array(
            'className' => 'Payment',
            'joinTable' => 'payments_users',
            'foreignKey' => 'user_id',
            'associationForeignKey' => 'payment_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        )
    );

    public function beforeSave($options = array()) {
        if (isset($this->data['User']['password'])) {
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
        }
//        if (isset($this->data['User']['email_password'])) {
//            $this->data['User']['email_password'] = AuthComponent::password($this->data['User']['email_password']);
//        }
        return true;
    }

    public function afterFind($results, $primary = false) {
        parent::afterFind($results, $primary);
        foreach ($results as $k => $result):
            if (!empty($result['User'])) {
                /**
                 * Count init 0
                 * Count ALL State CMD by Customer
                 */
                $countCmdRamassage = 0;
                $countCmdDepot = 0;
                $countCmdWait = 0;
                $countCmdWaitAffect = 0;
                $countCmdWaitNotAffect = 0;
                $countCmdRecup = 0;
                $countCmdStockWait = 0;
                $countCmdStockBack = 0;
                $countCmdStockCancel = 0;
                $countCmdOutOfStock = 0;
                $countCmdCancelOutOfStock = 0;
                $countCmdBack = 0;
                $countCmdDone = 0;
                $countCmdBill = 0;
                $countCmdBackCustomer = 0;

                $commande = new Commande();
                $commande->recursive = -1;
                if (!empty($result['User']['id'])) {
                    $commandesTransport = $commande->find('all', array(
                        'conditions' => array('Commande.type' => 'Transport', 'Commande.user_id' => $result['User']['id'])
                    ));
                    if (!empty($commandesTransport)) {
                        foreach ($commandesTransport as $index => $cmd):
                            //case Wait
                            if (in_array($cmd['Commande']['state'], array('Non Traitée', 'Non Traitée depot'))) {
                                $countCmdWait++;
                            }
                            //case Wait affecter
                            if (in_array($cmd['Commande']['state'], array('Non Traitée', 'Non Traitée depot')) && $cmd['Commande']['livreur_id'] != 0) {
                                $countCmdWaitAffect++;
                            }

                            //case Wait non affecter
                            if (in_array($cmd['Commande']['state'], array('Non Traitée', 'Non Traitée depot')) && $cmd['Commande']['livreur_id'] == 0) {
                                $countCmdWaitNotAffect++;
                            }
                            //case Recup
                            if (in_array($cmd['Commande']['state'], array('En Cours'))) {
                                $countCmdRecup++;
                            }
                            //case Stock Wait
                            if (in_array($cmd['Commande']['state'], array('En Stock')) && $cmd['Commande']['isStock'] == true) {
                                $countCmdStockWait++;
                            }
                            //case Stock Wait Back
                            if (in_array($cmd['Commande']['state'], array('Retour')) && $cmd['Commande']['isStock'] == true) {
                                $countCmdStockBack++;
                            }
                            //case Stock Wait Cancel
                            if (in_array($cmd['Commande']['state'], array('Annulée')) && $cmd['Commande']['isStock'] == true) {
                                $countCmdStockCancel++;
                            }
                            //case Cmd out of stock
                            if (in_array($cmd['Commande']['state'], array('AttenteLivraison')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdOutOfStock++;
                            }
                            //case Cmd Cancel
                            if (in_array($cmd['Commande']['state'], array('Annulée')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdOutOfStock++;
                            }
                            //case Cmd Back
                            if (in_array($cmd['Commande']['state'], array('Retour')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdBack++;
                            }
                            //case Cmd Done
                            if (in_array($cmd['Commande']['state'], array('Livrée')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdDone++;
                            }
                            //case Cmd Bill
                            if (in_array($cmd['Commande']['state'], array('Facturée')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdBill++;
                            }
                            //case Cmd Back Customer
                            if (in_array($cmd['Commande']['state'], array('Retour Expéditeur')) && $cmd['Commande']['isStock'] == false) {
                                $countCmdBackCustomer++;
                            }
                            //case commande ramassage 
                            if (in_array($cmd['Commande']['state'], array('Non Traitée'))) {
                                $countCmdRamassage++;
                            }
                            //case commande ramassage 
                            if (in_array($cmd['Commande']['state'], array('Non Traitée depot'))) {
                                $countCmdDepot++;
                            }
                        endforeach;
                        $result['User']['countCmdRamassage'] = $countCmdRamassage;
                        $result['User']['countCmdDepot'] = $countCmdDepot;
                        $result['User']['countCmdWait'] = $countCmdWait;
                        $result['User']['countCmdWaitAffect'] = $countCmdWaitAffect;
                        $result['User']['countCmdWaitNotAffect'] = $countCmdWaitNotAffect;
                        $result['User']['countCmdRecup'] = $countCmdRecup;
                        $result['User']['countCmdStockWait'] = $countCmdStockWait;
                        $result['User']['countCmdStockBack'] = $countCmdStockBack;
                        $result['User']['countCmdStockCancel'] = $countCmdStockCancel;
                        $result['User']['countCmdOutOfStock'] = $countCmdOutOfStock;
                        $result['User']['countCmdCancelOutOfStock'] = $countCmdCancelOutOfStock;
                        $result['User']['countCmdBack'] = $countCmdBack;
                        $result['User']['countCmdDone'] = $countCmdDone;
                        $result['User']['countCmdBill'] = $countCmdBill;
                        $result['User']['countCmdBackCustomer'] = $countCmdBackCustomer;
                        $results[$k] = $result;
                    } else {
                        $result['User']['countCmdRamassage'] = 0;
                        $result['User']['countCmdDepot'] = 0;

                        $result['User']['countCmdWait'] = 0;
                        $result['User']['countCmdWaitAffect'] = 0;
                        $result['User']['countCmdWaitNotAffect'] = 0;
                        $result['User']['countCmdRecup'] = 0;
                        $result['User']['countCmdStockWait'] = 0;
                        $result['User']['countCmdStockBack'] = 0;
                        $result['User']['countCmdStockCancel'] = 0;
                        $result['User']['countCmdOutOfStock'] = 0;
                        $result['User']['countCmdCancelOutOfStock'] = 0;
                        $result['User']['countCmdBack'] = 0;
                        $result['User']['countCmdDone'] = 0;
                        $result['User']['countCmdBill'] = 0;
                        $result['User']['countCmdBackCustomer'] = 0;
                        $results[$k] = $result;
                    }
                }
            }
        endforeach;
        return $results;
    }

}

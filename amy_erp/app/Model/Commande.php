<?php

App::uses('AppModel', 'Model');

/**
 * Commande Model
 *
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 * @property User $User
 */
class Commande extends AppModel {

    /**
     * Validation rules
     *
     * @var array
     */
//    public $virtualFields = array(
//        'ref' => 'CONCAT(Commande.ref)'
//    );
    public $displayField = 'ref';
//    public $validate = array(
//        'fournisseur_id' => array(
//            'numeric' => array(
//                'rule' => array('numeric'),
//            //'message' => 'Your custom message here',
//            //'allowEmpty' => false,
//            //'required' => false,
//            //'last' => false, // Stop validation after this rule
//            //'on' => 'create', // Limit validation to 'create' or 'update' operations
//            ),
//        ),
//        'user_id' => array(
//            'numeric' => array(
//                'rule' => array('numeric'),
//            //'message' => 'Your custom message here',
//            //'allowEmpty' => false,
//            //'required' => false,
//            //'last' => false, // Stop validation after this rule
//            //'on' => 'create', // Limit validation to 'create' or 'update' operations
//            ),
//        ),
//        'state' => array(
//            'boolean' => array(
//                'rule' => array('boolean'),
//            //'message' => 'Your custom message here',
//            //'allowEmpty' => false,
//            //'required' => false,
//            //'last' => false, // Stop validation after this rule
//            //'on' => 'create', // Limit validation to 'create' or 'update' operations
//            ),
//        ),
//        'nbr_product' => array(
//            'numeric' => array(
//                'rule' => array('numeric'),
//            //'message' => 'Your custom message here',
//            //'allowEmpty' => false,
//            //'required' => false,
//            //'last' => false, // Stop validation after this rule
//            //'on' => 'create', // Limit validation to 'create' or 'update' operations
//            ),
//        ),
//    );
    public $hasMany = array(
        'Bon' => array(
            'className' => 'Bon',
            'foreignKey' => 'commande_id',
            'dependent' => true,
            'conditions' => '',
            'fields' => '',
            'order' => 'Bon.id ASC',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Reglement' => array(
            'className' => 'Reglement',
            'foreignKey' => 'commande_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'Historique' => array(
            'className' => 'Historique',
            'foreignKey' => 'commande_id',
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
    public $hasOne = array( 
        'Facture' => array(
            'className' => 'Facture',
            'foreignKey' => 'commande_id'
        )
    );

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'User' => array(
            'className' => 'User',
            'foreignKey' => 'user_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Getby' => array(
            'className' => 'Commerciale',
            'foreignKey' => 'com_id',
            'conditions' => '',
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'order' => ''
        ),
        'Livreur' => array(
            'className' => 'Livreur',
            'foreignKey' => 'livreur_id',
            'conditions' => '',
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone', 'full_name'),
            'order' => ''
        ),  
        'Receiver' => array(
            'className' => 'Receiver',
            'foreignKey' => 'receiver_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Fournisseur' => array(
            'className' => 'Fournisseur',
            'foreignKey' => 'fournisseur_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
        ),
        'Commercial' => array(
            'className' => 'Commerciale',
            'foreignKey' => "commerciale_id",
            'fields' => array('id', 'user_count', 'first_name', 'last_name', 'phone'),
            'counterCache' => true
        ),
        'Tva' => array(
            'className' => 'Tva',
            'foreignKey' => 'tva_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        ),
        'Cp' => array(
            'className' => 'Cp',
            'foreignKey' => 'cp_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );

    public function afterFind($results, $primary = false) {
        parent::afterFind($results, $primary);
        foreach ($results as $k => $result):
            if (!empty($result['Commande']['type']) && !empty($result['Bon'][0]['Product'])) {
                if ($result['Commande']['type'] === 'Commande' && $result['Commande']['state'] === 'Finalisée') {
                    $totalRgl = 0;
                    $totalTtcCmd = 0;
                    $ifPayed = false;
                    $remise_globale_commande = $result['Commande']['remise_globale'];
                    if (!empty($result['Reglement'])) {
                        if (!empty($result['Bon'])) {
                            foreach ($result['Bon'] as $bon):
                                $totalTtcCmd = $totalTtcCmd + (($bon['last_unit_price'] * $bon['qte'] * (1 + $bon['Product']['Tva']['value'] / 100) * (1 - $bon['remise'] / 100)));
                            endforeach;
                            foreach ($result['Reglement'] as $reglement):
                                $somme_regle = $reglement['value'];
                                if ($reglement['part'] != 0) {
                                    $somme_regle = $reglement['part'];
                                }
                                $totalRgl += $somme_regle;
                            endforeach;
                            $totalTtcCmd = $totalTtcCmd * (1 - ($remise_globale_commande / 100));
                            $totalRestant = $totalTtcCmd - $totalRgl;
                            $totalRestantToTest = intval(number_format($totalRestant, 0, "", ""));
                            if ($totalRestantToTest < 0) {
                                $totalRestantToTest *= -1;
                            }
                            if ($totalRestantToTest == 0 || $totalRestantToTest === "0") {
                                $ifPayed = true;
                            }
                            $result['Commande']['total_ttc'] = number_format($totalTtcCmd, 3, ".", "");
                            $result['Commande']['restant'] = number_format($totalRestant, 3, ".", "");
                            $result['Commande']['total_payee'] = number_format($totalTtcCmd - $totalRestant, 3, ".", "");
                            $result['Commande']['is_payed'] = $ifPayed;
                            $results[$k] = $result;
                        }
                    } else {
                        if (!empty($result['Bon'])) {
                            foreach ($result['Bon'] as $bon):
                                $totalTtcCmd = $totalTtcCmd + (($bon['last_unit_price'] * $bon['qte'] * (1 + $bon['Product']['Tva']['value'] / 100) * (1 - $bon['remise'] / 100)));
                            endforeach;
                            $totalTtcCmd = $totalTtcCmd * (1 - ($remise_globale_commande / 100));
                            $ifPayed = false;
                            $totalRestant = $totalTtcCmd - $totalRgl;
                            $result['Commande']['total_ttc'] = number_format($totalTtcCmd, 3, ".", "");
                            $result['Commande']['restant'] = number_format($totalRestant, 3, ".", "");
                            $result['Commande']['total_payee'] = number_format($totalTtcCmd - $totalRestant, 3, ".", "");
                            $result['Commande']['is_payed'] = $ifPayed;
                            $results[$k] = $result;
                        }
                        $result['Commande']['is_payed'] = $ifPayed;
                        $results[$k] = $result;
                    }


                    // Expiration
//                    $datetime1 = new DateTime($commande['Commande']['modified']);
//                    $datetime2 = new DateTime(date('Y-m-d H:i:s'));
//                    $interval = $datetime1->diff($datetime2);
//                    $diff = $interval->format('%a');
//                    $commande['Commande']['diff_expired'] = $diff;
                }
            }else {
                $result['Commande']['total_payee'] = 0;
                $result['Commande']['is_payed'] = false;
                $results[$k] = $result;
            }
        endforeach;
        return $results;
    }

}

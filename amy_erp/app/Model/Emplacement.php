<?php

App::uses('AppModel', 'Model');

/**
 * Emplacement Model
 *
 * @property Famille $Famille
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 * @property  $
 * @property n $n
 */
class Emplacement extends AppModel {
    /**
     * Validation rules
     *
     * @var array
     */
    // The Associations below have been created with all possible keys, those that are not needed can be removed

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Stock' => array(
            'className' => 'Stock',
            'foreignKey' => 'stock_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );
    public $hasMany = array(
        'Sousemplacement' => array(
            'className' => 'Sousemplacement',
            'foreignKey' => 'emplacement_id',
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
        'EmplacementProduct' => array(
            'className' => 'Product',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'emplacement_id',
            'associationForeignKey' => 'product_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        )
    );

//    public function afterFind($results, $primary = false) {
//        parent::afterFind($results, $primary);
//        App::uses('Bon', 'Model');
//        foreach ($results as $k => $result):
//            if (!empty($result['Emplacement']['product_id'])) {
//                $stock = new Bon();
//                $bl = $stock->find('first', array(
//                    'conditions' => array('Bon.product_id' => $result['Emplacement']['product_id'])
//                ));
////                debug($results);
////                die();
//                if (!empty($result['Emplacement']['product_id'])) {
//                    $ifCommandeDone = $stock->find('all', array(
//                        'contain' => array('Commande' => array(
//                                'conditions' => array('Commande.state' => 'Finalisée'),
//                                'fields' => array('Commande.id', 'Commande.state')
//                            )),
//                        'conditions' => array('Bon.product_id' => $result['Emplacement']['product_id'], 'Bon.avoir' => false),
//                        'fields' => array('Bon.id', 'Bon.qte')
//                    ));
//                    $listCmdDone = array();
//                    if (!empty($ifCommandeDone)) {
////                        debug($ifCommandeDone);
////                        die();
//                        foreach ($ifCommandeDone as $cmd):
//                            if ($cmd['Commande']['state'] !== null || $cmd['Commande']['state'] == false) {
//                                array_push($listCmdDone, $cmd['Commande']['id']);
//                            }
//                        endforeach;
//                        $stockCount = $stock->find('list', array(
//                            'conditions' => array('Bon.commande_id' => $listCmdDone, 'Bon.product_id' => $result['Emplacement']['product_id'], 'Bon.avoir' => false),
//                            'fields' => array('Bon.id', 'Bon.qte')
//                        ));
//                        $count = array_sum($stockCount);
//                        $result['Emplacement']['countOut'] = -$count;
//                        $results[$k] = $result;
//                    } else {
//                        $result['Emplacement']['countOut'] = 0;
//                        $results[$k] = $result;
//                    }
//                }
//            }
//        endforeach;
//        return $results;
//    }
}

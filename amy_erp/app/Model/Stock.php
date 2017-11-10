<?php

App::uses('AppModel', 'Model');

/**
 * Stock Model
 *
 * @property Famille $Famille
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 * @property  $
 * @property n $n
 */
class Stock extends AppModel {

    /**
     * Validation rules
     *
     * @var array
     */
    // The Associations below have been created with all possible keys, those that are not needed can be removed

    public $hasMany = array(
        'Emplacement' => array(
            'className' => 'Emplacement',
            'foreignKey' => 'stock_id',
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
        'StockProduct' => array(
            'className' => 'Product',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'stock_id',
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

    public function afterFind($results, $primary = false) {
        parent::afterFind($results, $primary);
        App::uses('Bon', 'Model');
        App::uses('ProductsStock', 'Model');
        foreach ($results as $k => $result):
            $product = new ProductsStock();
            $count_product = $product->find('count', array(
                'conditions' => array('ProductsStock.stock_id' => $result['Stock']['id'], 'ProductsStock.product_id >' => 0)
            ));
//            debug($results);
//            die();
            if (!empty($result['StockProduct'])) {
                $stock = new Bon();
                $countStockProduct = 0;
                foreach ($result['StockProduct'] as $kk => $sp):
                    $ifCommandeDone = $stock->find('all', array(
                        'contain' => array('Commande' => array(
                                'conditions' => array('Commande.state' => 'Finalisée'),
                                'fields' => array('Commande.id', 'Commande.state')
                            )),
                        'conditions' => array('Bon.product_id' => $sp['id'], 'Bon.avoir' => false),
                        'fields' => array('Bon.id', 'Bon.qte')
                    ));
                    $listCmdDone = array();
                    if (!empty($ifCommandeDone)) {
//                        debug($ifCommandeDone);
//                        die();
                        foreach ($ifCommandeDone as $cmd):
                            if ($cmd['Commande']['state'] !== null || $cmd['Commande']['state'] == false) {
                                array_push($listCmdDone, $cmd['Commande']['id']);
                            }
                        endforeach;
                        $stockCount = $stock->find('list', array(
                            'conditions' => array('Bon.commande_id' => $listCmdDone, 'Bon.product_id' => $sp['id'], 'Bon.avoir' => false),
                            'fields' => array('Bon.id', 'Bon.qte')
                        ));
                        $countStockProduct += count($stockCount);
                    }
                    if ($countStockProduct > 0) {
                        $count = array_sum($stockCount);
                        $sp['countOut'] = -$countStockProduct;
                        $sp['productCount'] = $count_product;
                        $result['StockProduct'][$kk] = $sp;
                    } else {
                        $sp['countOut'] = 0;
                        $sp['productCount'] = $count_product;
                        $result['StockProduct'][$kk] = $sp;
                    }
                endforeach;
                $results[$k] = $result;
            }
        endforeach;
        return $results;
    }

}

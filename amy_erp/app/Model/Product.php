<?php

App::uses('AppModel', 'Model');
App::uses('Commande', 'Model');
App::uses('Bon', 'Model');

/**
 * Product Model
 *
 * @property Fournisseur $Fournisseur
 * @property Famille $Famille
 * @property Commande $Commande
 * @property Stock $Stock
 * @property Facture $Facture
 */
class Product extends AppModel {

    /**
     * Display field
     *
     * @var string
     */
    public $displayField = 'name';

    /**
     * Validation rules
     *
     * @var array
     */
    public $validate = array(
        'name' => array(
            'notBlank' => array(
                'rule' => array('notBlank'),
            //'message' => 'Your custom message here',
            //'allowEmpty' => false,
            //'required' => false,
            //'last' => false, // Stop validation after this rule
            //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
        'price' => array(
            'numeric' => array(
                'rule' => array('numeric'),
            //'message' => 'Your custom message here',
            //'allowEmpty' => false,
            //'required' => false,
            //'last' => false, // Stop validation after this rule
            //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
        'fournisseur_id' => array(
            'numeric' => array(
                'rule' => array('numeric'),
            //'message' => 'Your custom message here',
            //'allowEmpty' => false,
            //'required' => false,
            //'last' => false, // Stop validation after this rule
            //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
        'famille_id' => array(
            'numeric' => array(
                'rule' => array('numeric'),
            //'message' => 'Your custom message here',
            //'allowEmpty' => false,
            //'required' => false,
            //'last' => false, // Stop validation after this rule
            //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
    );

    // The Associations below have been created with all possible keys, those that are not needed can be removed

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Fournisseur' => array(
            'className' => 'Fournisseur',
            'foreignKey' => 'fournisseur_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Famille' => array(
            'className' => 'Famille',
            'foreignKey' => 'famille_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Tva' => array(
            'className' => 'Tva',
            'foreignKey' => 'tva_id',
            'conditions' => '',
            'fields' => array('id', 'value', 'name'),
            'order' => ''
        ),
        'Category' => array(
            'className' => 'Category',
            'foreignKey' => 'category_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
        'Unite' => array(
            'className' => 'Unite',
            'foreignKey' => 'unite_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        ),
    );
//    public $hasOne = array(
//        'Stock' => array(
//            'className' => 'Stock',
//            'foreignKey' => 'product_id'
//        )
//    );
    /**
     * hasMany associations
     *
     * @var array
     */
    public $hasMany = array(
        'Bon' => array(
            'className' => 'Bon',
            'foreignKey' => 'product_id',
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
//        'Stock' => array(
//            'className' => 'Stock',
//            'foreignKey' => 'product_id',
//            'dependent' => false,
//            'conditions' => '',
//            'fields' => '',
//            'order' => '',
//            'limit' => '',
//            'offset' => '',
//            'exclusive' => '',
//            'finderQuery' => '',
//            'counterQuery' => ''
//        )
    );

    /**
     * hasAndBelongsToMany associations
     *
     * @var array
     */
    public $hasAndBelongsToMany = array(
        'Facture' => array(
            'className' => 'Facture',
            'joinTable' => 'factures_products',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'facture_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        ),
        'Stock' => array(
            'className' => 'Stock',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'stock_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        ),
        'Emplacement' => array(
            'className' => 'Emplacement',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'emplacement_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        ),
        'Sousemplacement' => array(
            'className' => 'Sousemplacement',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'sousemplacement_id',
            'unique' => 'keepExisting',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'finderQuery' => '',
        ),
        'Indication' => array(
            'className' => 'Indication',
            'joinTable' => 'products_stocks',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'indication_id',
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
        $commande = new Commande();
        $bon = new Bon();
        $commandesAchats = $commande->find('list', array(
            'conditions' => array('Commande.type' => 'Achat', 'Commande.state <>' => 'Finalisée', 'Commande.isDemandeprix' => false)
        ));
        $commandesVentes = $commande->find('list', array(
            'conditions' => array('Commande.type' => 'Commande', 'Commande.state' => 'Non Traitée')
        ));
        $blsVentes = $commande->find('list', array(
            'conditions' => array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée')
        ));
        $cmds_ids_achats = array();
        $cmds_ids_ventes = array();
        $bls_ids_ventes = array();
        foreach ($commandesAchats as $id => $cmd):
            array_push($cmds_ids_achats, $id);
        endforeach;
        foreach ($commandesVentes as $id => $cmd):
            array_push($cmds_ids_ventes, $id);
        endforeach;
        foreach ($blsVentes as $id => $cmd):
            array_push($bls_ids_ventes, $id);
        endforeach;
        foreach ($results as $k => $result):
            $qte_attente = 0;
            $qte_reserve = 0;
            $qte_out = 0;
            if (!empty($result['Product']['id'])) {
                $product_id = $result['Product']['id'];
                $bon->recursive = -1;
                $bonsAchats = $bon->find('list', array(
                    'conditions' => array(
                        'Bon.product_id' => $product_id, 'Bon.commande_id IN' => $cmds_ids_achats
                    ),
                    'fields' => array('Bon.id', 'Bon.qte')
                ));
                $bonsVentes = $bon->find('list', array(
                    'conditions' => array(
                        'Bon.product_id' => $product_id, 'Bon.commande_id IN' => $cmds_ids_ventes
                    ),
                    'fields' => array('Bon.id', 'Bon.qte')
                ));
                $bonsBlsVentes = $bon->find('list', array(
                    'conditions' => array(
                        'Bon.product_id' => $product_id, 'Bon.commande_id IN' => $bls_ids_ventes
                    ),
                    'fields' => array('Bon.id', 'Bon.qte')
                ));
                //calcul qte en attente
                foreach ($bonsAchats as $b):
                    $qte_attente += $b;
                endforeach;
                foreach ($bonsVentes as $b):
                    $qte_reserve += $b;
                endforeach;
                foreach ($bonsBlsVentes as $b):
                    $qte_out += $b;
                endforeach;
            }
            if (!empty($result['Product']['tva_id'])) {
                $this->Tva->id = $result['Product']['tva_id'];
                $tva = $this->Tva->read();
                $result['Product']['Tva'] = $tva['Tva'];
                $results[$k] = $result;
            }
            $result['Stock']['qte_attente'] = $qte_attente;
            $result['Stock']['qte_reserve'] = $qte_reserve;
            $result['Stock']['qte_out'] = $qte_out;
            $results[$k] = $result;
        endforeach;
        return $results;
    }

}

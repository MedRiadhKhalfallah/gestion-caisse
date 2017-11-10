<?php

App::uses('AppModel', 'Model');

/**
 * Indication Model
 *
 * @property Famille $Famille
 * @property Product $Product
 * @property Fournisseur $Fournisseur
 * @property  $
 * @property n $n
 */
class Indication extends AppModel {
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
        'Sousemplacement' => array(
            'className' => 'Sousemplacement',
            'foreignKey' => 'sousemplacement_id',
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'counterCache' => true
        )
    );

}

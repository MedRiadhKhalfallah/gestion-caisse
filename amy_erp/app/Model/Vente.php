<?php

App::uses('AppModel', 'Model');

/**
 * CakePHP Vente
 * @author hedi
 */
class Vente extends AppModel {

    //The Associations below have been created with all possible keys, those that are not needed can be removed
    public $displayField = "name";
    public $belongsTo = array(
        'Fournisseur'
    );
   
}

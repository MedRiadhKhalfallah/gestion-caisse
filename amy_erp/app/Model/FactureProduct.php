<?php

App::uses('AppModel', 'Model');

class FactureProduct extends AppModel {


    public $useTable = 'factures_products';
    public $belongsTo = array(
        'Facture',
//        'Tva',
        'Product'
    );

}

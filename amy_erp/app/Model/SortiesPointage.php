<?php

App::uses('AppModel', 'Model');

/**
 * SortiesPointage Model
 *
 * @property Pointage $Pointage
 */
class SortiesPointage extends AppModel {

    public $useTable = 'sorties_pointages';

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Pointage' => array(
            'className' => 'Pointage',
            'foreignKey' => 'pointage_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );

}

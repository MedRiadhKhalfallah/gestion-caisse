<?php
App::uses('AppModel', 'Model');
/**
 * Prospection Model
 *
 * @property User $User
 */
class Prospection extends AppModel {

/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'id';


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
		)
	);
}

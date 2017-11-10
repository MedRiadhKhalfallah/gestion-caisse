<?php

App::uses('AppModel', 'Model');

/**
 * Configuration Model
 *
 */
class Utilisateur extends AppModel {

    public $useDbConfig = 'client';
    public $useTable = "utilisateurs";
    public $name = "Utilisateur";

}

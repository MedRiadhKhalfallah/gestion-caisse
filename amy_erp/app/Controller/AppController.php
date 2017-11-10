<?php

App::uses('Controller', 'Controller');

class AppController extends Controller {

    public $uses = array('Role', 'Configuration', 'Type', 'Compte', 'Facture', 'Livreur', 'Commande');
    public $helpers = array('Text', 'Form', 'Html', 'Session');
    public $components = array(
        'Session',
        'RequestHandler',
        'Paginator',
        'Auth' => array(
            'authorize' => array('Controller')
        ),
        'Flash'
    );

    

    function sendMessage($livreur_id = null, $state = null, $isStock = null) {
        $this->Livreur->id = $livreur_id;
        $message = "";
        if ($state === "Non Traitée") {
            $message = "Une commande ramassage vous a été affectée";
        }
        if ($state === "En stock" || $state === "AttenteLivraison" || $state === "Retour" || $state === "Annulée") {
            $message = "Une commande en attente livraison vous a été affectée";
        }
        if ($state === "full") {
            $message = "Plusieurs commandes vous ont été affectée";
        }
        $playerID = $this->Livreur->read('deviceID');
        if (!empty($playerID)) {
            $content = array(
                "en" => $message
            );

            $fields = array(
                'app_id' => "668d6f88-b9ad-4553-9095-fef105bc707f",
                'include_player_ids' => array($playerID['Livreur']['deviceID']),
                'data' => array("foo" => "bar"),
                'contents' => $content
            );

            $fields = json_encode($fields);
//        print("\nJSON sent:\n");
//        print($fields);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                'Authorization: Basic MjBiYzQ0NzktZDNmMi00MDk2LTkzZmMtM2I3MzRkOTE0YjNm'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

            $response = curl_exec($ch);
            curl_close($ch);

            return $response;
        }
        return null;
    }

    function make_comparer() {
        // Normalize criteria up front so that the comparer finds everything tidy
        $criteria = func_get_args();
        foreach ($criteria as $index => $criterion) {
            $criteria[$index] = is_array($criterion) ? array_pad($criterion, 3, null) : array($criterion, SORT_ASC, null);
        }

        return function($first, $second) use (&$criteria) {
            foreach ($criteria as $criterion) {
                // How will we compare this round?
                list($column, $sortOrder, $projection) = $criterion;
                $sortOrder = $sortOrder === SORT_DESC ? -1 : 1;

                // If a projection was defined project the values now
                if ($projection) {
                    $lhs = call_user_func($projection, $first[$column]);
                    $rhs = call_user_func($projection, $second[$column]);
                } else {
                    $lhs = $first[$column];
                    $rhs = $second[$column];
                }

                // Do the actual comparison; do not return if equal
                if ($lhs < $rhs) {
                    return -1 * $sortOrder;
                } else if ($lhs > $rhs) {
                    return 1 * $sortOrder;
                }
            }

            return 0; // tiebreakers exhausted, so $first == $second
        };
    }

    public function factureTotal($id = null) {
        $this->Facture->contain('Product', 'Type');
        $this->Facture->id = $id;
        $facture = $this->Facture->read();
        $price_ht = 0;
        $price_ttc = 0;
        $tva = 0;
        $last_timbre = $facture['Facture']['last_timbre_price'];
        $remise_globale = $facture['Facture']['remise_globale'];
        foreach ($facture['Product'] as $product):
            $remise = ((($product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 + ($product['Tva']['value'] / 100))) * ($product['FacturesProduct']['remise'])) / 100);
            $price_ht += $product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 - ($product['FacturesProduct']['remise'] / 100));
            $price_ttc += (($product['FacturesProduct']['last_unit_price'] * (1 - ($product['FacturesProduct']['remise'] / 100)) * $product['FacturesProduct']['qte'] * (1 + $product['Tva']['value'] / 100)));
            $tva += $product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 - ($product['FacturesProduct']['remise'] / 100)) * ($product['Tva']['value'] / 100);
        endforeach;
        $montant_ht = $price_ht * (1 - $remise_globale / 100);
        $montant_ttc = $price_ttc * (1 - $remise_globale / 100) + $last_timbre;
        return array(
            'date' => $facture['Facture']['created'],
            'type' => $facture['Type']['name'],
            'montant_ht' => $montant_ht,
            'montant_ttc' => $montant_ttc,
            'tva' => $tva
        );
    }

    public function factureTypeID($type = null) {
        $type = $this->Type->find('first', array(
            'conditions' => array('Type.name' => $type)
        ));
        return $type['Type']['id'];
    }

    public function beforeFilter() {
        parent::beforeFilter();
        $this->layout = false;
        $this->Auth->allow('logout', 'login', 'factureTotal', 'sendMessage', 'findCommandeByRef');
        $config_default = $this->getConfiguration();
        $config = current($this->getConfiguration());
        $this->set(compact('config_default', 'config'));
    }

    public function findCommandeByRef($ref = null) {
        if (!empty($ref)) {
            $this->Commande->contain('User', 'Receiver');
            $commande = $this->Commande->find('first', array(
                'conditions' => array('Commande.ref' => $ref)
            ));
            if (!empty($commande)) {
                return $commande;
            } else {
                return array();
            }
        }
        return array();
    }

    public function getConfiguration() {
        return $this->Configuration->find("first");
    }

    public function update_compte_comptable($compte = null, $debit = null, $credit = null, $date = null, $facture_id = null) {
        $compte_id = $this->Compte->find('first', array('conditions' => array('Compte.name' => $compte)));
        debug($compte_id);
        $ecriture = array(
            'Ecriture' => array(
                'compte_id' => $compte_id['Compte']['id'],
                'facture_id' => $facture_id,
                'debit' => $debit,
                'credit' => $credit,
                'date' => $date
            )
        );
        $this->Compte->create();
        $this->Compte->save($ecriture);
    }

    public function getRole($name = null) {
        $role = $this->Role->find('first', array(
            'conditions' => array('Role.name' => $name)
        ));
        $role_id = $role['Role']['id'];
        if (empty($role)) {
            $role = array(
                'Role' => array(
                    'id' => null,
                    'name' => 'admin'
                )
            );
            $this->Role->save($role);
            $role = $this->Role->find('first', array(
                'conditions' => array('Role.name' => $name)
            ));
            $role_id = $role['Role']['id'];
        }
        return $role_id;
    }

    public function isAuthorized($user) {
        $role_name = $user['Role']['name'];
        $prefix = $this->params['prefix'];

        // Root peut accéder à toute action
        if (!empty($role_name) && $role_name === 'root') {
            return true;
        }
        // Accès par prefix & role pour autre que root
        if (!empty($role_name) && ($role_name === $prefix)) {
            return true;
        }
        if (empty($prefix)) {
            return true;
        }
        // Refus par défaut
        return false;
    }

    public function beforeRender() {
        parent::beforeRender();
        if (!empty($this->params['prefix']) && $this->params['action'] === $this->params['prefix'] . "_login") {
            $this->redirect(array('controller' => 'users', 'action' => 'login', $this->params['prefix'] => false));
        }
    }

}

<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

App::uses('AppController', 'Controller');

/**
 * CakePHP StatsController
 * @author hedi
 */
class StatsController extends AppController {

    public $uses = array('Commande', 'Facture', 'User', 'Bon', 'Fournisseur', 'Stock');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('get_stats', 'sales_ventes', 'state_vente_client', 'sales_achats', 'sales_achats_fournisseur', 'sales_stock', 'sales_products', 'buys_sales_products', 'sales_comparatif_ventes', 'comparatif_global');
    }

    public function get_stats() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        setlocale(LC_ALL, 'fr_FR', 'fra');
        setlocale(LC_TIME, 'fr_FR', 'fra');
        //Column Charts
        $dataColumnCharts = array();
        $products = array();
        $dataTopSeven = array();
        $dataTopSevenProducts = array();
        $dataCustomersID = array();
        $dataCustomersStats = array();
        $currentDateMonth = date('Y-m-d H:i:s');
        $month = utf8_encode(ucfirst(strftime('%B', strtotime($currentDateMonth))));
        $monthNumber = date('m');
//        $monthNumber = "05";
        $maxDayOfMonth = cal_days_in_month(CAL_GREGORIAN, $monthNumber, date('Y'));
        if ($this->request->is('post')) {
            $request = $this->request->data;
            $this->Commande->contain('Bon');
//            $request['Commerciale']['id'] = 1;
            $dateStart = date('Y-m-');
//            $dateStart = "2016-05-";
            $countCmd = 0;
            for ($index = 1; $index <= $maxDayOfMonth; $index++):
                $day = null;
                if (strlen($index) > 1) {
                    $day = $index;
                } else {
                    $day = "0" . $index;
                }
                $Day = $dateStart . $day;
//                debug($Day);
                $commandes = null;
                $commandes = $this->Commande->find('all', array(
                    'conditions' => array(
                        "Commande.created LIKE" => $Day . " %",
//                        'Commande.type' => 'Commande',
                        'Commande.state' => 'Finalisée'
                    )
                ));
                if (count($commandes) === 0) {
//                    array_push($dataColumnCharts, array('y' => 0, 'label' => "Jour $index(" . ucfirst(strftime('%A', strtotime($DayStart))) . ")"));
                } else {
                    $finalTtc = 0;
                    $dateCmd = "";
                    $k = 0;
                    foreach ($commandes as $commande):
                        $dateCmd = $commande['Commande']['created'];
//                        if (date('Y-m-d', strtotime($dateCmd)) == "2016-08-05") {
//                            debug($commande['Commande']['ref'] . " - " . $commande['Commande']['created']);
//                        }
                        $totalTTC = 0;
                        array_push($dataCustomersID, $commande['Commande']['user_id']);
                        $remiseGlobale = $commande['Commande']['remise_globale'];
                        foreach ($commande['Bon'] as $bon):
                            array_push($products, $bon['product_id']);
                            $remise = ($bon['last_unit_price'] * $bon['remise'] ) / 100;
                            $totalTTC = $totalTTC + (($bon['last_unit_price'] - $remise ) * $bon['qte']);
//                            debug($dateCmd. " - " .$totalTTC);
                        endforeach;
                        $finalTtc = $finalTtc + ($totalTTC - (($totalTTC * $remiseGlobale ) / 100));
                        $k = $k + 1;
                    endforeach;
                    array_push($dataColumnCharts, array('label' => date('Y-m-d', strtotime($dateCmd)), 'y' => $finalTtc, 'indexLabel' => "Total(" . $finalTtc . ")", 'markerType' => "triangle", 'markerColor' => "#6B8E23", 'markerSize' => 12));
                }
            endfor;
            $products = array_count_values($products);
            arsort($products);
            $index = 1;
//        debug($products);
//        die();
            foreach ($products as $k => $product):
                if ($index < 8) {
                    array_push($dataTopSeven, $k);
                }
                $index++;
            endforeach;
            foreach ($dataTopSeven as $k => $product):
                $this->Bon->Product->id = $product;
                $p = $this->Bon->Product->read('name')['Product']['name'];
                if ($k === 0) {
                    array_push($dataTopSevenProducts, array('y' => $products[$product], 'exploded' => true, 'legendText' => $p, 'indexLabel' => $p));
                } else {
                    array_push($dataTopSevenProducts, array('y' => $products[$product], 'legendText' => $p, 'indexLabel' => $p));
                }
            endforeach;
            http_response_code(200);
            echo json_encode(array(
                'month' => $month,
                'sales' => $dataColumnCharts,
                'top' => $dataTopSevenProducts,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        http_response_code(403);
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

// revenue mensuel de vente par mois
    public function sales_ventes() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        require_once APP . 'Vendor/DateTimeLang/DateTimeFrench.php';

        //init local datetime
        date_default_timezone_set('Europe/Paris');
// --- La setlocale() fonctionnne pour strftime mais pas pour DateTime->format()
        setlocale(LC_ALL, 'fr_FR.utf8', 'fra'); // OK
        //generate sales stats
        $monthsCommandes = array();
        $months = array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
//        debug($months);
//        die();
        foreach ($months as $month):
            $conditions['MONTH(Commande.created)'] = $month;
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva');
            $commandes = $this->Commande->find('all', array(
                'conditions' => array($conditions, 'Commande.state' => 'Finalisée')
            ));
            if (!empty($commandes)) {
//                debug($commandes);
//                die();
                $montant = 0;
                $remise = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($commandes as $commande):
                    $last_timbre = $commande['Commande']['last_timbre_price'];

                    $remise_globale = $commande['Commande']['remise_globale'];
                    foreach ($commande['Bon'] as $product):
                        $price_ht = $product['last_unit_price'] * $product['qte'];
                        $remise = ((($product['last_unit_price'] * $product['qte'] * (1 + ($product['Product']['Tva']['value'] / 100))) * ($product['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Product']['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
                    endforeach;
                endforeach;
                $montant = $price_ttc + $last_timbre;
                $timestamp = null;
                if ($month < 10) {
                    $timestamp = ("2016-0" . $month . "-10 12:12:11");
                } else {
                    $timestamp = ("2016-" . $month . "-10 12:12:11");
                }
                $datetime = new DateTimeFrench($timestamp, new DateTimeZone('Europe/Paris'));
//                debug($datetime->format('F'));
//                die();
                array_push($monthsCommandes, array(
                    'label' => $datetime->format('F'),
                    'y' => $montant
                ));
            }
        endforeach;
//        debug($monthsCommandes);
//        die();
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($monthsCommandes);
        die();
    }

// revenue mensuel de vente par client
    function state_vente_client() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $mantantFactures = array();
        $Nomclient = array();
        $data = array();
        $role_client = $this->User->Role->find('first', array(
            'conditions' => array('Role.name' => 'client')
        ));
        $clients = $this->User->find('all', array(
            'conditions' => array('User.role_id' => $role_client['Role']['id'])
        ));
//        $count = $this->User->find('count', array('conditions' => array('User.type' => 'Client')));
        $index = 1;
        foreach ($clients as $k => $client):
//            $conditions[''] = $;
//            debug($client);
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva');
            $request = $this->request->data;
            $conditionsdate = array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée', 'Commande.user_id' => $client['User']['id']);
            if (!empty($request['Facture']['first_date']) && !empty($request['Facture']['last_date'])) {
                $first_date = $request['Facture']['first_date'];
                $last_date = $request['Facture']['last_date'];
                $conditionsdate = array(
                    "Commande.created BETWEEN '$first_date' AND '$last_date'",
                    'Commande.type' => 'Commande',
                    'Commande.state' => 'Finalisée',
                    'Commande.user_id' => $client['User']['id']
                );
            }
            $commandesVente = $this->Commande->find('all', array(
                'conditions' => $conditionsdate
            ));
            if (empty($commandesVente)) {
                $montant = 0;
            }
            if (!empty($commandesVente)) {
                $montant = 0;
                $remise = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($commandesVente as $commande):
                    $last_timbre = $commande['Commande']['last_timbre_price'];

                    $remise_globale = $commande['Commande']['remise_globale'];
                    foreach ($commande['Bon'] as $product):
                        $price_ht = $product['last_unit_price'] * $product['qte'];
                        $remise = ((($product['last_unit_price'] * $product['qte'] * (1 + ($product['Product']['Tva']['value'] / 100))) * ($product['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Product']['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
                    endforeach;
                endforeach;
                $montant = $price_ttc;
            }else {
                $mantant = 0;
            }
//            array_push($Nomclient, [$client['User']['full_name'],$montant] );
            array_push($Nomclient, $client['User']['full_name']);
//            array_push($mantantCommandes, floatval(number_format($montant, 3, ".", ".")));
            if ($index < 8 && $montant != 0) {
//                array_push($dataTopSeven, $k);
                array_push($data, array('y' => $montant, 'legendText' => $client['User']['full_name'] . " (" . $montant . ")", 'indexLabel' => $client['User']['full_name']));
            }
            $index++;
        endforeach;
//debug($data); die();
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($data);
        die();
    }

// revenue mensuel des achats par fournisseur
    function sales_achats() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $mantantFactures = array();
        $Nomfournisseur = array();
        $data = array();
        $request = $this->request->data;
        $fournisseurs = $this->Fournisseur->find('all');
        $index = 1;
        foreach ($fournisseurs as $k => $fournisseur):
            $conditions = array('Facture.type_id' => $this->factureTypeID('achat'), 'Facture.fournisseur_id' => $fournisseur['Fournisseur']['id']);
            if (!empty($request['Facture']['first_date']) && !empty($request['Facture']['last_date'])) {
                $first_date = $request['Facture']['first_date'];
                $last_date = $request['Facture']['last_date'];
                $conditions = array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.type_id' => $this->factureTypeID('achat'),
                    'Facture.fournisseur_id' => $fournisseur['Fournisseur']['id']
                );
            }
            $facturesachats = $this->Facture->find('all', array(
                'conditions' => $conditions
            ));
            if (empty($facturesachats)) {
                $montant = 0;
            }
            if (!empty($facturesachats)) {
                $montant = 0;
                $remise = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($facturesachats as $facture):
                    $last_timbre = $facture['Facture']['last_timbre_price'];
                    $remise_globale = $facture['Facture']['remise_globale'];
                    foreach ($facture['Product'] as $product):
                        $price_ht = $product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'];
                        $remise = ((($product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 + ($product['Tva']['value'] / 100))) * ($product['FacturesProduct']['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
                    endforeach;
                endforeach;
                $montant = $price_ttc;
            }
            if ($index < 8 && $montant != 0) {
                array_push($data, array('y' => $montant, 'name' => $fournisseur['Fournisseur']['name'] . " (" . $montant . ")", 'legendMarkerType' => 'triangle'));
            }
            $index++;
        endforeach;
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($data);
        die();
    }

// revenue mensuel des ventes par client
    function sales_comparatif_ventes() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $mantantFactures = array();
        $Nomfournisseur = array();
        $data = array();
        $request = $this->request->data;
        $role_client = $this->User->Role->find('first', array(
            'conditions' => array('Role.name' => 'client')
        ));
        $clients = $this->User->find('all', array(
            'conditions' => array('User.role_id' => $role_client['Role']['id'])
        ));
        $index = 1;
        foreach ($clients as $k => $client):
            $conditions = array('Commande.type' => 'Commande', 'Commande.user_id' => $client['User']['id'], 'Commande.state' => 'Finalisée', 'Commande.avoir' => 0);
            if (!empty($request['Facture']['first_date']) && !empty($request['Facture']['last_date'])) {
                $first_date = $request['Facture']['first_date'];
                $last_date = $request['Facture']['last_date'];
                $conditions = array(
                    "Commande.modified BETWEEN '$first_date' AND '$last_date'",
//                    'Commande.type' => 'Commande',
                    'Commande.user_id' => $client['User']['id'],
                    'Commande.state' => 'Finalisée',
                    'Commande.avoir' => 0
                );
            }
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva');
            $facturesventes = $this->Commande->find('all', array(
                'conditions' => $conditions
            ));
            if (empty($facturesventes)) {
                $montant = 0;
            }
            if (!empty($facturesventes)) {
//                debug($facturesventes); 
                $montant = 0;
                $remise = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($facturesventes as $commande):
                    $last_timbre = $commande['Commande']['last_timbre_price'];

                    $remise_globale = $commande['Commande']['remise_globale'];
                    foreach ($commande['Bon'] as $product):
                        $price_ht = $product['last_unit_price'] * $product['qte'];
                        $remise = ((($product['last_unit_price'] * $product['qte'] * (1 + ($product['Product']['Tva']['value'] / 100))) * ($product['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Product']['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
                    endforeach;
                endforeach;
                $montant = $price_ttc;
            }
            if ($index < 8 && $montant != 0) {
                array_push($data, array('y' => $montant, 'name' => $client['User']['full_name'] . " (" . $montant . ")", 'legendMarkerType' => 'triangle'));
            }
            $index++;
        endforeach;
        $conditions = array('Commande.type' => 'Commande', 'Commande.state' => 'Finalisée', 'Commande.avoir' => 0);
        if (!empty($request['Facture']['first_date']) && !empty($request['Facture']['last_date'])) {
            $first_date = $request['Facture']['first_date'];
            $last_date = $request['Facture']['last_date'];
            $conditions = array(
                "Commande.created BETWEEN '$first_date' AND '$last_date'",
                'Commande.type' => 'Commande',
                'Commande.state' => 'Finalisée',
                'Commande.avoir' => 0
            );
        }
        $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva', 'User');
        $commandesventes = $this->Commande->find('all', array(
            'conditions' => $conditions
        ));
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode(array(
            'data' => $data,
            'commandes' => $commandesventes
        ));
        die();
    }

// revenue mensuel de vente par mois costom fournisseur
    public function sales_achats_fournisseur() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        require_once APP . 'Vendor/DateTimeLang/DateTimeFrench.php';

        require_once APP . 'Vendor/DateTimeLang/DateTimeFrench.php';

        //init local datetime
        date_default_timezone_set('Europe/Paris');
// --- La setlocale() fonctionnne pour strftime mais pas pour DateTime->format()
        setlocale(LC_ALL, 'fr_FR.utf8', 'fra'); // OK
        //generate sales stats
        $monthsFactures = array();
        $months = array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
        foreach ($months as $month):
            $conditions['MONTH(Facture.created)'] = $month;
            $this->Facture->contain('Product');
            $request = $this->request->data;
            $conditionsdate = array($conditions, 'Facture.type_id' => $this->factureTypeID('achat'), 'Facture.fournisseur_id' => $request['Fournisseur']['id']);
            if (!empty($request['Facture']['first_date']) && !empty($request['Facture']['last_date'])) {
                $first_date = $request['Facture']['first_date'];
                $last_date = $request['Facture']['last_date'];
                $conditionsdate = array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    $conditions,
                    'Facture.type_id' => $this->factureTypeID('achat'),
                    'Facture.fournisseur_id' => $request['Fournisseur']['id']
                );
            }

            $factures = $this->Facture->find('all', array(
                'conditions' => array($conditionsdate)
            ));
            if (!empty($factures)) {
                $montant = 0;
                $remise = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($factures as $facture):
                    $last_timbre = $facture['Facture']['last_timbre_price'];
                    $remise_globale = $facture['Facture']['remise_globale'];
                    foreach ($facture['Product'] as $product):
                        $price_ht = $product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'];
                        $remise = ((($product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 + ($product['Tva']['value'] / 100))) * ($product['FacturesProduct']['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
//                        $price_total = $price_ttc * (1 - $remise_globale / 100);
//                        $montant = $price_total;
                    endforeach;
                endforeach;
                $montant = $price_ttc + $last_timbre;
                $timestamp = null;
                if ($month < 10) {
                    $timestamp = ("2016-0" . $month . "-10 12:12:11");
                } else {
                    $timestamp = ("2016-" . $month . "-10 12:12:11");
                }
                $datetime = new DateTimeFrench($timestamp, new DateTimeZone('Europe/Paris'));
                array_push($monthsFactures, array(
                    'label' => $datetime->format('F'),
//                    'date' => $datetime->format('Y-m-d'),
                    'y' => $montant
                ));
            }
        endforeach;
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($monthsFactures);
        die();
    }

    function sales_stock() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $stocks = $this->Stock->find('all');
        $entree = 0;
        $sortie = 0;
        foreach ($stocks as $stock):
            $entree = $entree + $stock['Stock']['qte'];
            $sortie = $sortie + (- $stock['Stock']['countOut']);
        endforeach;
//        $entree = $this->Stock->find('count', array('conditions' => array('Stock.mouvement' => 'Entree')));
//        $sortie = $this->Stock->find('count', array('conditions' => array('Stock.mouvement' => 'Sortie')));
        $data = array(
            0 => array(
                'y' => $sortie,
                'name' => __("Sortie"),
                'legendMarkerType' => __("square")
            ),
            1 => array(
                'y' => $entree - $sortie,
                'name' => __("Stock"),
                'legendMarkerType' => __("circle")
            ),
        );
//        debug($data);
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($data);
        die();
    }

// etat comparatif produit vente/achat

    public function sales_products() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        setlocale(LC_ALL, 'fr_FR', 'fra');
        setlocale(LC_TIME, 'fr_FR', 'fra');
        $ventes = array();
        $achats = array();
        $this->Commande->contain('Bon', 'Bon.Product');
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $first_date = $data['Stat']['first_date'];
            $last_date = $data['Stat']['last_date'];
            $conditions = array('Commande.state' => "Finalisée", 'Commande.avoir' => false);
            if (!empty($first_date) && !empty($last_date)) {
                $conditions = array(
                    "Commande.modified BETWEEN '$first_date' AND '$last_date'",
                    'Commande.state' => "Finalisée",
                    'Commande.avoir' => false
                );
            }
            //Ventes Stats
            $commandes = $this->Commande->find('all', array(
                'conditions' => $conditions,
                'order' => array('Commande.modified ASC')
            ));
            $filterVentes = array();
            if (!empty($commandes)) {
                foreach ($commandes as $commande):
                    $date = new DateTime($commande['Commande']['modified']);
                    array_push($ventes, array($date->format('Y-m-d') => 0));
                endforeach;
            }
            //delete duplicate date
            foreach ($ventes as $vente):
                $currentDate = array_keys($vente)[0];
                if (!array_key_exists($currentDate, $filterVentes)) {
                    $filterVentes[$currentDate] = 0;
                }
            endforeach;
            $ventes = array();
            foreach ($filterVentes as $k => $vente):
                $totalMarge = 0;
                $qteTotale = 0;
                $currentDate = $k . " %";
                $this->Commande->contain('Bon', 'Bon.Product');
                $commandesVentes = $this->Commande->find('all', array(
                    'conditions' => array('Commande.state' => "Finalisée", 'Commande.avoir' => false, 'Commande.modified LIKE' => $currentDate),
                    'order' => array('Commande.modified ASC')
                ));
                foreach ($commandesVentes as $commande):
                    foreach ($commande['Bon'] as $bon):
                        if ($bon['avoir'] == false && $bon['product_id'] === $data['Product']['id']):
                            $totalMarge += (($bon['last_unit_price'] - $bon['Product']['prix_achat']) * $bon['qte']);
                            $qteTotale += $bon['qte'];
                        endif;
                    endforeach;
                endforeach;
                array_push($ventes, array('label' => $k, 'y' => $totalMarge));
            endforeach;
            http_response_code(200);
            echo json_encode(array(
                'ventes' => $ventes,
                'achats' => $achats,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

    public function buys_sales_products() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        setlocale(LC_ALL, 'fr_FR', 'fra');
        setlocale(LC_TIME, 'fr_FR', 'fra');
        $ventes = array();
        $achats = array();
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $first_date = $data['Stat']['first_date'];
            $last_date = $data['Stat']['last_date'];
            //Ventes Stats
            $conditions = array('Commande.state' => "Finalisée", 'Commande.avoir' => false);
            if (!empty($first_date) && !empty($last_date)) {
                $conditions = array(
                    "Commande.modified BETWEEN '$first_date' AND '$last_date'",
                    'Commande.state' => "Finalisée",
                    'Commande.avoir' => false
                );
            }
            $this->Commande->contain('Bon', 'Bon.Product');
            $commandes = $this->Commande->find('all', array(
                'conditions' => $conditions,
                'order' => array('Commande.modified ASC')
            ));
            $filterVentes = array();
            if (!empty($commandes)) {
                foreach ($commandes as $commande):
                    $date = new DateTime($commande['Commande']['modified']);
                    array_push($ventes, array($date->format('Y-m-d') => 0));
                endforeach;
            }
            //delete duplicate date
            foreach ($ventes as $vente):
                $currentDate = array_keys($vente)[0];
                if (!array_key_exists($currentDate, $filterVentes)) {
                    $filterVentes[$currentDate] = 0;
                }
            endforeach;
            $ventes = array();
            foreach ($filterVentes as $k => $vente):
                $totalMarge = 0;
                $qteTotale = 0;
                $currentDate = $k . " %";
                $this->Commande->contain('Bon', 'Bon.Product');
                $commandesVentes = $this->Commande->find('all', array(
                    'conditions' => array('Commande.state' => "Finalisée", 'Commande.avoir' => false, 'Commande.modified LIKE' => $currentDate),
                    'order' => array('Commande.modified ASC')
                ));
                foreach ($commandesVentes as $commande):
                    foreach ($commande['Bon'] as $bon):
                        if ($bon['avoir'] == false && $bon['product_id'] === $data['Product']['id']):
                            $totalMarge += (($bon['last_unit_price'] - $bon['Product']['prix_achat']) * $bon['qte']);
                            $qteTotale += $bon['qte'];
                        endif;
                    endforeach;
                endforeach;
                array_push($ventes, array('label' => $k, 'y' => $qteTotale));
            endforeach;
            //Achats Stats
            $conditionsFactures = array('Facture.type_id' => $this->factureTypeID('achat'), 'Facture.avoir' => false);
            if (!empty($first_date) && !empty($last_date)) {
                $conditionsFactures = array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.type_id' => $this->factureTypeID('achat'),
                    'Facture.avoir' => false
                );
            }
            $this->Facture->contain('Product');
            $factures = $this->Facture->find('all', array(
                'conditions' => $conditionsFactures,
                'order' => array('Facture.created ASC')
            ));
            $filterAchats = array();
            if (!empty($factures)) {
                foreach ($factures as $facture):
                    $date = new DateTime($facture['Facture']['created']);
                    array_push($achats, array($date->format('Y-m-d') => 0));
                endforeach;
            }
            //delete duplicate date
            foreach ($achats as $achat):
                $currentDate = array_keys($achat)[0];
                if (!array_key_exists($currentDate, $filterAchats)) {
                    $filterAchats[$currentDate] = 0;
                }
            endforeach;
            $achats = array();
            foreach ($filterAchats as $k => $achat):
                $qteTotale = 0;
                $currentDate = $k . " %";
                $this->Facture->contain('Product');
                $facturesAchats = $this->Facture->find('all', array(
                    'conditions' => array('Facture.type_id' => $this->factureTypeID('achat'), 'Facture.avoir' => false, 'Facture.created LIKE' => $currentDate),
                    'order' => array('Facture.created ASC')
                ));
//                debug(count($facturesAchats));
                foreach ($facturesAchats as $facture):
//                    debug($facture);
//                    die();
                    foreach ($facture['Product'] as $product):
                        if ($product['id'] === $data['Product']['id']):
                            $qteTotale += $product['FacturesProduct']['qte'];
                        endif;
                    endforeach;
                endforeach;
                array_push($achats, array('label' => $k, 'y' => $qteTotale));
            endforeach;
//            debug($ventes);
            $datesVentes = array();
            $datesAchats = array();
            foreach ($ventes as $k => $vente):
                array_push($datesVentes, $vente['label']);
            endforeach;
            foreach ($achats as $k => $achat):
                array_push($datesAchats, $achat['label']);
            endforeach;
            $datesVentesManquantes = array();
            $datesAchatsManquantes = array();
            foreach ($datesVentes as $dv):
                if (!in_array($dv, $datesAchats)) {
                    array_push($datesAchatsManquantes, $dv);
                }
            endforeach;
            foreach ($datesAchats as $da):
                if (!in_array($da, $datesVentes)) {
                    array_push($datesVentesManquantes, $da);
                }
            endforeach;
            foreach ($datesVentesManquantes as $dvm):
                array_push($ventes, array('label' => $dvm, 'y' => 0));
            endforeach;
            foreach ($datesAchatsManquantes as $dam):
                array_push($achats, array('label' => $dam, 'y' => 0));
            endforeach;
//            debug($achats);
//            debug($ventes);
//            die();
            $this->array_sort_by_column($achats, "label");
            $this->array_sort_by_column($ventes, "label");
            http_response_code(200);
            echo json_encode(array(
                'ventes' => $ventes,
                'achats' => $achats,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

    function array_sort_by_column(&$arr, $col, $dir = SORT_ASC) {
        $sort_col = array();
        foreach ($arr as $key => $row) {
            $sort_col[$key] = $row[$col];
        }

        array_multisort($sort_col, $dir, $arr);
    }

    // comparatif globale vente achat
    public function comparatif_global() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        setlocale(LC_ALL, 'fr_FR', 'fra');
        setlocale(LC_TIME, 'fr_FR', 'fra');
        $ventes = array();
        $achats = array();
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $first_date = $data['Stat']['first_date'];
            $last_date = $data['Stat']['last_date'];
            //Ventes Stats
//            debug($first_date);
//            debug($last_date);
//            die();
            $conditions = array('Commande.state' => "Finalisée", 'Commande.avoir' => false);
            if (!empty($first_date) && !empty($last_date)) {
                $conditions = array(
                    "Commande.modified BETWEEN '$first_date' AND '$last_date'",
                    'Commande.state' => "Finalisée",
                    'Commande.avoir' => false
                );
            }
            $this->Commande->contain('Bon', 'Bon.Product');
            $commandes = $this->Commande->find('all', array(
                'conditions' => $conditions,
                'order' => array('Commande.modified ASC')
            ));
            $filterVentes = array();
            if (!empty($commandes)) {
                foreach ($commandes as $commande):
                    $date = new DateTime($commande['Commande']['modified']);
                    array_push($ventes, array($date->format('Y-m-d') => 0));
                endforeach;
            }
            //delete duplicate date
            foreach ($ventes as $vente):
                $currentDate = array_keys($vente)[0];
                if (!array_key_exists($currentDate, $filterVentes)) {
                    $filterVentes[$currentDate] = 0;
                }
            endforeach;
            $ventes = array();
//            debug()
            foreach ($filterVentes as $k => $vente):
                $totalTTC = 0;
                $currentDate = $k . " %";
                $this->Commande->contain('Bon', 'Bon.Product');
                $commandesVentes = $this->Commande->find('all', array(
                    'conditions' => array('Commande.state' => "Finalisée", 'Commande.avoir' => false, 'Commande.modified LIKE' => $currentDate),
                    'order' => array('Commande.modified ASC')
                ));
                foreach ($commandesVentes as $commande):
                    $total_ttc = 0;
                    foreach ($commande['Bon'] as $bon):
                        if ($bon['avoir'] == false):
                            $total_ttc = $total_ttc + ($bon['last_unit_price'] * $bon['qte'] * (1 - $bon['remise'] / 100) * (1 + $bon['Product']['Tva']['value'] / 100));
                        endif;
                    endforeach;
                    $totalTTC = $total_ttc * (1 - $commande['Commande']['remise_globale'] / 100);
                endforeach;
                array_push($ventes, array('label' => $k, 'y' => $totalTTC));
            endforeach;
//            debug($ventes);die();
            //Achats Stats
            $conditionsFactures = array('Facture.type_id' => $this->factureTypeID('achat'), 'Facture.avoir' => false);
            if (!empty($first_date) && !empty($last_date)) {
                $conditionsFactures = array(
                    "Facture.created BETWEEN '$first_date' AND '$last_date'",
                    'Facture.type_id' => $this->factureTypeID('achat'),
                    'Facture.avoir' => false
                );
            }
            $this->Facture->contain('Product');
            $factures = $this->Facture->find('all', array(
                'conditions' => $conditionsFactures,
                'order' => array('Facture.created ASC')
            ));
            $filterAchats = array();
            if (!empty($factures)) {
                foreach ($factures as $facture):
                    $date = new DateTime($facture['Facture']['created']);
                    array_push($achats, array($date->format('Y-m-d') => 0));
                endforeach;
            }
            //delete duplicate date
            foreach ($achats as $achat):
                $currentDate = array_keys($achat)[0];
                if (!array_key_exists($currentDate, $filterAchats)) {
                    $filterAchats[$currentDate] = 0;
                }
            endforeach;
            $achats = array();
            foreach ($filterAchats as $k => $achat):
                $qteTotale = 0;
                $totalTTCAchat = 0;
                $currentDate = $k . " %";
                $this->Facture->contain('Product');
                $facturesAchats = $this->Facture->find('all', array(
                    'conditions' => array('Facture.type_id' => $this->factureTypeID('achat'), 'Facture.avoir' => false, 'Facture.created LIKE' => $currentDate),
                    'order' => array('Facture.created ASC')
                ));
//                debug(count($facturesAchats));
                foreach ($facturesAchats as $facture):
//                    debug($facture);
//                    die();
                    $total_ttc_achat = 0;
                    foreach ($facture['Product'] as $product):
                        $total_ttc_achat = $total_ttc_achat + ($product['FacturesProduct']['last_unit_price'] * $product['FacturesProduct']['qte'] * (1 - $product['FacturesProduct']['remise'] / 100) * (1 + $product['Tva']['value'] / 100));
                    endforeach;
                    $totalTTCAchat = $total_ttc_achat * (1 - $facture['Facture']['remise_globale'] / 100);
                endforeach;
                array_push($achats, array('label' => $k, 'y' => $totalTTCAchat));
            endforeach;
//            debug($ventes);
            $datesVentes = array();
            $datesAchats = array();
            foreach ($ventes as $k => $vente):
                array_push($datesVentes, $vente['label']);
            endforeach;
            foreach ($achats as $k => $achat):
                array_push($datesAchats, $achat['label']);
            endforeach;
            $datesVentesManquantes = array();
            $datesAchatsManquantes = array();
            foreach ($datesVentes as $dv):
                if (!in_array($dv, $datesAchats)) {
                    array_push($datesAchatsManquantes, $dv);
                }
            endforeach;
            foreach ($datesAchats as $da):
                if (!in_array($da, $datesVentes)) {
                    array_push($datesVentesManquantes, $da);
                }
            endforeach;
//            debug($datesVentes);
//            debug($datesAchats);
//            debug($datesAchatsManquantes);
//            debug($datesVentesManquantes);
//            die();
            foreach ($datesVentesManquantes as $dvm):
                array_push($ventes, array('label' => $dvm, 'y' => 0));
            endforeach;
            foreach ($datesAchatsManquantes as $dam):
                array_push($achats, array('label' => $dam, 'y' => 0));
            endforeach;
//            debug($achats);
//            debug($ventes);
//            die();
            $this->array_sort_by_column($achats, "label");
            $this->array_sort_by_column($ventes, "label");
            http_response_code(200);
            echo json_encode(array(
                'ventes' => $ventes,
                'achats' => $achats,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        http_response_code(403);
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
        die();
    }

// revenue mensuel de vente par mois
    public function sales_achat_ventes_stock() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        require_once APP . 'Vendor/DateTimeLang/DateTimeFrench.php';

        //init local datetime
        date_default_timezone_set('Europe/Paris');
// --- La setlocale() fonctionnne pour strftime mais pas pour DateTime->format()
        setlocale(LC_ALL, 'fr_FR.utf8', 'fra'); // OK
        //generate sales stats
        $monthsCommandes = array();
        $months = array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
//        debug($months);
//        die();
        foreach ($months as $month):
            $conditions['MONTH(Commande.created)'] = $month;
            $conditionsdate = array(
                $conditions,
                'Commande.type' => 'Commande',
                'Commande.state' => 'Finalisée'
            );
            $conditionsdateachat = array(
                $conditions,
                'Commande.type' => 'Achat',
                'Commande.state' => 'Finalisée'
            );
            if (!empty($request['Commande']['first_date']) && !empty($request['Commande']['last_date'])) {
                $first_date = $request['Commande']['first_date'];
                $last_date = $request['Facture']['last_date'];
                $conditionsdate = array(
                    $conditions,
                    "Commande.created BETWEEN '$first_date' AND '$last_date'",
                    'Commande.type' => 'Commande',
                    'Commande.state' => 'Finalisée'
                );
                $conditionsdateachat = array(
                    $conditions,
                    "Commande.created BETWEEN '$first_date' AND '$last_date'",
                    'Commande.type' => 'Achat',
                    'Commande.state' => 'Finalisée'
                );
            }
            $this->Commande->contain('Bon', 'Bon.Product', 'Bon.Product.Tva');
            $commandes = $this->Commande->find('all', array(
                'conditions' => $conditionsdate
            ));
            $commandesachat = $this->Commande->find('all', array(
                'conditions' => $conditionsdateachat
            ));
            if (!empty($commandes)) {
//                debug($commandes);
//                die();
                $montant = 0;
                $remise = 0;
                $price_ht_achat = 0;
                $price_ht = 0;
                $price_ttc = 0;
                $remise_globale = 0;
                foreach ($commandes as $commande):
                    $last_timbre = $commande['Commande']['last_timbre_price'];
                    $remise_globale = $commande['Commande']['remise_globale'];
                    foreach ($commande['Bon'] as $product):
                        $price_ht = $product['last_unit_price'] * $product['qte'];
                        $remise = ((($product['last_unit_price'] * $product['qte'] * (1 + ($product['Product']['Tva']['value'] / 100))) * ($product['remise'])) / 100);
                        $price_ttc = $price_ttc + ((($price_ht * (1 + $product['Product']['Tva']['value'] / 100)) - $remise) * (1 - $remise_globale / 100));
                    endforeach;
                endforeach;
                $montant = $price_ttc + $last_timbre;
                $timestamp = null;
                if ($month < 10) {
                    $timestamp = ("2016-0" . $month . "-10 12:12:11");
                } else {
                    $timestamp = ("2016-" . $month . "-10 12:12:11");
                }
                $datetime = new DateTimeFrench($timestamp, new DateTimeZone('Europe/Paris'));
//                debug($datetime->format('F'));
//                die();
                array_push($monthsCommandes, array(
                    'label' => $datetime->format('F'),
                    'y' => $montant
                ));
            }
        endforeach;
//        debug($monthsCommandes);
//        die();
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($monthsCommandes);
        die();
    }

}

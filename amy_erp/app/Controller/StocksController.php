<?php

App::uses('AppController', 'Controller');

/**
 * Stocks Controller
 *
 * @property Stock $Stock
 * @property PaginatorComponent $Paginator
 */
class StocksController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'add', 'view', 'edit', 'delete', 'init_stock', 'valide_stock', 'mouvement_stock');
    }

    public $uses = array('ProductsStock', 'Stock', 'Configuration', 'Product', 'Fournisseur', 'Famille', 'Commande', 'Bon', 'User');

    public function init_stock() {
        $this->Product->recursive = -1;
        $products = $this->Product->find('all');
        $inStock = 0;
        $horsStock = 0;
        foreach ($products as $product):
            $stock = array(
                'ProductsStock' => array(
                    'stock_id' => 1,
                    'product_id' => $product['Product']['id'],
                    'qte' => 10
                )
            );
            $this->ProductsStock->create();
            $this->ProductsStock->save($stock);

        endforeach;
        die('FIN');
    }

    public function init_stock_colis($name = null) {
        if ($name != NULL) {
            //verif entrepot transporteur
            $ifExistStockTransport = $this->Stock->find('first', array(
                'conditions' => array('Stock.name' => 'Transporteur')
            ));
            $stock_id = $ifExistStockTransport['Stock']['id'];
            if (empty($ifExistStockTransport)) {
                
            }
            //verif emplacement transporteur/zone
            $ifExistEmplacement = $this->Emplacement->find('first', array(
                'conditions' => array('Emplacement.name' => $name)
            ));
            if (empty($ifExistEmplacement)) {
                $Emplacement = array(
                    'Emplacement' => array(
                        'id' => null,
                        'name' => $name,
                    )
                );
                $this->Emplacement->save($Emplacement);
                $lastID = $this->Emplacement->getLastInsertID();
                $emplacements = array('En attente', 'Retour', 'Annulation');
                foreach ($emplacements as $emplacement):
                    //verif sousemplcement tranporteur/commande/etat
                    $data = array(
                        'Emplacement' => array(
                            'id' => null,
                            'name' => $name,
                        )
                    );
                endforeach;
            }
        }
        return null;
    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Stock->contain('Product', 'Product.Fournisseur', 'Product.Famille', 'Product.Emplacement', 'Product.Sousemplacement', 'Product.Indication');
            $this->Stock->contain('StockProduct');
            $stocks = $this->Stock->find('all', array('order' => array('Stock.created DESC')));
            echo json_encode($stocks);
            die();
        }
        die();
    }

//view Stock
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $this->Stock->contain('Emplacement', 'StockProduct', 'StockProduct.Fournisseur', 'StockProduct.Famille', 'StockProduct.Tva', 'StockProduct.Unite', 'StockProduct.Category');
            $data = $this->request->data;
            $this->Stock->id = $data['Stock']['id'];
            $stock = $this->Stock->read();
            if (!empty($stock)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $stock,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Stock non trouvé"),
                    'status' => 404,
                    'type' => 'error'
                )));
            }
            die();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

    public function mouvement_stock() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
        $request = $this->request->data;
        $first_date = $request['Stock']['first_date'];
        $last_date = $request['Stock']['last_date'];
        $first_date = $first_date . " 00:00:00";
        $last_date = $last_date . " 23:59:59";
        $bons = $this->Bon->find('all', array(
            'conditions' => array(
                "Bon.modified BETWEEN '$first_date' AND '$last_date'",
                'Bon.product_id' => $this->request->data['Stock']['product_id'],
                'Bon.qte >=' => $this->request->data['Stock']['qte'],
                'Bon.avoir' => false
            )
        ));
        $cmd_ids = array();
        foreach ($bons as $bon):
            array_push($cmd_ids, $bon['Bon']['commande_id']);
        endforeach;
        $this->Commande->contain('Bon', 'User');
        $commandes = $this->Commande->find('all', array(
            'conditions' => array('Commande.id' => $cmd_ids, 'Commande.state' => 'Finalisée', 'Commande.avoir' => 0)
        ));
        $listeUsersQte = array();
        foreach ($commandes as $commande):
//            debug($commande['Commande']);
            $qte_bons = $this->Bon->find('first', array(
                'conditions' => array(
                    "Bon.modified BETWEEN '$first_date' AND '$last_date'",
                    "Bon.commande_id" => $commande['Commande']['id'],
                    'Bon.product_id' => $this->request->data['Stock']['product_id'],
                    'Bon.qte >=' => $this->request->data['Stock']['qte'],
                    'Bon.avoir' => false
                )
            ));
            if (!empty($qte_bons)) {
                $dataUq = array(
                    'user_id' => $commande['User']['id'],
                    'full_name' => $commande['User']['full_name'],
                    'phone' => $commande['User']['phone'],
                    'adress' => $commande['User']['adress'],
                    'raison_social' => $commande['User']['raison_social'],
                    'qte' => $qte_bons['Bon']['qte'],
                );
                array_push($listeUsersQte, $dataUq);
            }
        endforeach;
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($listeUsersQte);
        die();
//        }
//        die();
    }

// validation de stock

    public function valide_stock() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data); die();
            $this->Stock->id = $data['Stock']['id'];
//            $stateStock = false;
//            $message = "Invalidité de stock mis à jour";
            if ($data['Stock']['valide'] === 'true') {
                $this->Stock->saveField('valide', TRUE);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __("Ligne de stock valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                $this->Stock->saveField('valide', FALSE);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __("Invalidité de stock mis à jour"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
//        header('HTTP/1.0 403 Forbidden');
//        echo json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        ));
//        die();
    }

    public function add() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            $ifExistStock = $this->Stock->find('first', array(
//                'conditions' => array('Stock.product_id' => $data['Stock']['product_id'])
//            ));
//            if (!empty($ifExistStock)) {
//                $this->Stock->id = $ifExistStock['Stock']['id'];
//                $qte = $data['Stock']['qte'] + $ifExistStock['Stock']['qte'];
//                $this->Stock->saveField('qte', $qte);
////                debug($ifExistStock);
//            } else {
//            }
            $this->Stock->save($data);
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Entrepôt ajouté avec succès"),
                'LastId' => $this->Stock->getLastInsertID(),
                'status' => 200,
                'type' => 'success'
            ));
//            }
            die();
        }
    }

//    public function view() {
//        header('Cache-Control: no-cache, must-revalidate');
//        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
//        header('Access-Control-Allow-Origin: *');
//        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
//            $data = $this->request->data;
//            $this->Stock->contain('Product', 'Product.Tva', 'Product.Fournisseur', 'Product.Category', 'Product.Famille', 'Product.Emplacement', 'Product.Sousemplacement', 'Product.Indication');
//            $this->Stock->id = $data['Stock']['id'];
//            $stock = $this->Stock->read();
//            if (!empty($stock)) {
//                $this->response->statusCode(200);
//                $this->response->body(json_encode(array(
//                    'text' => $stock,
//                    'status' => 200,
//                    'type' => 'success'
//                )));
//                $this->response->send();
//                die();
//            } else {
////                http_response_code(404);
//                $this->response->statusCode(404);
//                $this->response->body(json_encode(array(
//                    'text' => __("Stock non trouvé"),
//                    'status' => 404,
//                    'type' => 'success'
//                )));
//            }
//            die();
//        }
//        $this->response->statusCode(403);
//        $this->response->body(json_encode(array(
//            'text' => __("Not Allowed To Access"),
//            'status' => 403,
//            'type' => 'error'
//        )));
//        die();
//    }

    function edit() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->Stock->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Stock modifié avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Stock->read();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        die();
    }

    function delete() {
        $this->response->header('Access-Control-Allow-Origin: *');
        $this->response->header('Access-Control-Allow-Methods: *');
        $this->response->header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        $this->response->type('json');
        $this->response->send();
        if ($this->request->is(array('post', 'options'))) {
            $this->Stock->delete($this->request->data['Stock']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Ce Stock a était supprimé avec succès"),
                'status' => '200',
                'type' => 'success'
            )));
            $this->response->send();
            die();
        }
        $this->response->statusCode(403);
        $this->response->body(json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        )));
        $this->response->send();
        die();
    }

}

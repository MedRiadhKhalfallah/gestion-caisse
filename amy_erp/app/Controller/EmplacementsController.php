<?php

App::uses('AppController', 'Controller');

/**
 * Emplacements Controller
 *
 * @property Emplacement $Emplacement
 * @property PaginatorComponent $Paginator
 */
class EmplacementsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('products_emplacement', 'custom_product', 'product_stock', 'custom_stock', 'sousemplacement_stock', 'emplacement_stock', 'index', 'add', 'view', 'edit', 'delete', 'init_emplacement', 'valide_emplacement', 'mouvement_emplacement');
    }

    public $uses = array('ProductsStock', 'Emplacement', 'Configuration', 'Product', 'Fournisseur', 'Famille', 'Stock', 'Commande', 'Bon', 'User', 'Sousemplacement', 'Ville');

//    public function init_emplacement() {
//        $villes = $this->Ville->find('all', array(
//            'fields' => array('Ville.name')
//        ));
//        foreach ($villes as $ville):
//            $emplacement = array(
//                'id' => NULL,
//                'name' => $ville['Ville']['name'],
//                'stock_id' => 3
//            );
////            debug($emplacement);
//            $this->Emplacement->save($emplacement);
//        endforeach;
//        die();
//    }

    public function index() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Emplacement->contain('Stock', 'Stock.Product', 'Sousemplacement');
            $emplacements = $this->Emplacement->find('all', array('order' => array('Emplacement.created DESC')));
            echo json_encode($emplacements);
            die();
        }
        die();
    }

    public function custom_stock() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $limit = 9;
            if (!empty($data['Stock']['limit'])) {
                $limit = $data['Stock']['limit'];
            }
            if (!empty($data['Stock']['id'])) {
                $p_s = $this->ProductsStock->find('list', array(
                    'conditions' => array('ProductsStock.stock_id' => $data['Stock']['id']),
                    'fields' => array('ProductsStock.id', 'ProductsStock.product_id')
                ));
                $products = array();
                if (!empty($p_s)) {
                    $search = "";
                    if (!empty($data['Stock']['searchKey'])) {
                        $search = $data['Stock']['searchKey'];
                        $filters = array(
                            'Product.id IN' => $p_s,
                            "lower(Product.ref) like '%" . $search . "%' or "
                            . "lower(Product.name) like '%" . $search . "%'");
                        $this->Paginator->settings['conditions'] = $filters;
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['order'] = 'Product.name ASC';
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    } else {
                        $this->Paginator->settings['conditions'] = array('Product.id IN' => $p_s);
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['order'] = 'Product.name ASC';
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    }
                }
                if (empty($this->request->params['paging']['Product'])) {
                    $paging = false;
                } else {
                    $paging = $this->request->params['paging']['Product'];
                }
                http_response_code(200);
                echo json_encode(array(
                    'data' => $products,
                    'paging' => $paging,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

// list product for custom emplacement
    public function products_emplacement() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $limit = 9;
            if (!empty($data['Emplacement']['limit'])) {
                $limit = $data['Emplacement']['limit'];
            }
            if (!empty($data['Emplacement']['id'])) {
                $p_s = $this->ProductsStock->find('list', array(
                    'conditions' => array('ProductsStock.emplacement_id' => $data['Emplacement']['id']),
                    'fields' => array('ProductsStock.id', 'ProductsStock.product_id')
                ));
                $products = array();
                if (!empty($p_s)) {
                    $search = "";
                    if (!empty($data['Emplacement']['searchKey'])) {
                        $search = $data['Emplacement']['searchKey'];
                        $filters = array(
                            'Product.id IN' => $p_s,
                            "lower(Product.ref) like '%" . $search . "%' or "
                            . "lower(Product.name) like '%" . $search . "%'");
                        $this->Paginator->settings['conditions'] = $filters;
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    } else {
                        $this->Paginator->settings['conditions'] = array('Product.id IN' => $p_s);
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['order'] = 'Product.name ASC';
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    }
                }
                if (empty($this->request->params['paging']['Product'])) {
                    $paging = false;
                } else {
                    $paging = $this->request->params['paging']['Product'];
                }
                http_response_code(200);
                echo json_encode(array(
                    'data' => $products,
                    'paging' => $paging,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function custom_product() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $limit = 9;
            if (!empty($data['Sousemplacement']['limit'])) {
                $limit = $data['Sousemplacement']['limit'];
            }
            if (!empty($data['Sousemplacement']['id'])) {
                $p_s = $this->ProductsStock->find('list', array(
                    'conditions' => array('ProductsStock.sousemplacement_id' => $data['Sousemplacement']['id']),
                    'fields' => array('ProductsStock.id', 'ProductsStock.product_id')
                ));
                $products = array();
                if (!empty($p_s)) {
                    $search = "";
                    if (!empty($data['Sousemplacement']['searchKey'])) {
                        $search = $data['Sousemplacement']['searchKey'];
                        $filters = array(
                            'Product.id IN' => $p_s,
                            "lower(Product.ref) like '%" . $search . "%' or "
                            . "lower(Product.name) like '%" . $search . "%'");
                        $this->Paginator->settings['conditions'] = $filters;
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['order'] = 'Product.name ASC';
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    } else {
                        $this->Paginator->settings['conditions'] = array('Product.id IN' => $p_s);
                        $this->Paginator->settings['contain'] = array('Famille', 'Fournisseur', 'Category');
                        $this->Paginator->settings['order'] = 'Product.name ASC';
                        $this->Paginator->settings['paramType'] = 'querystring';
                        $this->Paginator->settings['limit'] = $limit;
                        $products = $this->paginate('Product');
                        foreach ($products as $k => $product):
                            if ($product['Product']['type'] === "Colis") {
                                $cmd = $this->findCommandeByRef($product['Product']['name']);
                                if (!empty($cmd)) {
                                    $product['Commande'] = $cmd['Commande'];
                                    $product['User'] = $cmd['User'];
                                    $product['Receiver'] = $cmd['Receiver'];
                                    $products[$k] = $product;
                                }
                            }
                        endforeach;
                    }
                }
                if (empty($this->request->params['paging']['Product'])) {
                    $paging = false;
                } else {
                    $paging = $this->request->params['paging']['Product'];
                }
                http_response_code(200);
                echo json_encode(array(
                    'data' => $products,
                    'paging' => $paging,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function product_stock() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $productstock = $this->ProductsStock->find('all', array(
                'conditions' => array('ProductsStock.stock_id' => $this->request->data['Stock']['id']),
                'order' => array('ProductsStock.created DESC')
            ));
            if (!empty($stock)) {
                http_response_code(200);
                echo json_encode(array(
                    'data' => $productstock,
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    public function emplacement_stock() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $emplacement = $this->Emplacement->find('all', array(
                'conditions' => array('Emplacement.stock_id' => $this->request->data['Stock']['id']),
                'order' => array('Emplacement.created DESC')
            ));
            if (!empty($emplacement)) {
                http_response_code(200);
                echo json_encode(array(
                    'data' => $emplacement,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas d\'emplacement pour cet entrepôt'),
                    'status' => 200,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    public function sousemplacement_stock() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $sousemplacement = $this->Sousemplacement->find('all', array(
                'conditions' => array('Sousemplacement.emplacement_id' => $this->request->data['Emplacement']['id']),
                'order' => array('Sousemplacement.created DESC')
            ));
            if (!empty($sousemplacement)) {
                http_response_code(200);
                echo json_encode(array(
                    'data' => $sousemplacement,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                echo json_encode(array(
                    'data' => __('Pas de sous emplacement pour cet Emplacement'),
                    'status' => 200,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    public function mouvement_emplacement() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
        $request = $this->request->data;
        $first_date = $request['Emplacement']['first_date'];
        $last_date = $request['Emplacement']['last_date'];
        $first_date = $first_date . " 00:00:00";
        $last_date = $last_date . " 23:59:59";
        $bons = $this->Bon->find('all', array(
            'conditions' => array(
                "Bon.modified BETWEEN '$first_date' AND '$last_date'",
                'Bon.product_id' => $this->request->data['Emplacement']['product_id'],
                'Bon.qte >=' => $this->request->data['Emplacement']['qte'],
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
                    'Bon.product_id' => $this->request->data['Emplacement']['product_id'],
                    'Bon.qte >=' => $this->request->data['Emplacement']['qte'],
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

// validation de emplacement

    public function valide_emplacement() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
//            debug($data); die();
            $this->Emplacement->id = $data['Emplacement']['id'];
//            $stateEmplacement = false;
//            $message = "Invalidité de emplacement mis à jour";
            if ($data['Emplacement']['valide'] === 'true') {
                $this->Emplacement->saveField('valide', TRUE);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __("Ligne de emplacement valider avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                $this->Emplacement->saveField('valide', FALSE);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __("Invalidité de emplacement mis à jour"),
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
            $this->Emplacement->save($data);
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode(array(
                'text' => __("Emplacement ajouté avec succès"),
                'LastId' => $this->Emplacement->getLastInsertID(),
                'status' => 200,
                'type' => 'success'
            ));
//            }
            die();
        }
    }

    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $this->Stock->contain('Sousemplacement', 'Stock', 'EmplacementProduct', 'EmplacementProduct.Fournisseur', 'EmplacementProduct.Famille', 'EmplacementProduct.Tva', 'EmplacementProduct.Unite', 'EmplacementProduct.Category');
            $this->Emplacement->id = $data['Emplacement']['id'];
            $emplacement = $this->Emplacement->read();
            if (!empty($emplacement)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $emplacement,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Emplacement non trouvé"),
                    'status' => 404,
                    'type' => 'success'
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

    function edit() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put'))) {
            $data = $this->request->data;
            if ($this->Emplacement->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Emplacement modifié avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        } else {
            $this->request->data = $this->Emplacement->read();
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
            $this->Emplacement->delete($this->request->data['Emplacement']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("Ce Emplacement a était supprimé avec succès"),
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

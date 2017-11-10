<?php

App::uses('AppController', 'Controller');

/**
 * Products Controller
 *
 * @property Product $Product
 * @property PaginatorComponent $Paginator
 */
class ProductsController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('products_famille', 'index_product', 'ajout_product', 'view', 'edit', 'delete', 'update_unite');
    }

    public $uses = array('Product', 'Configuration', 'Stock', 'ProductsStock', 'Famille');

    public function update_unite() {
        $products = $this->Product->find('all', array('order' => array('Product.created DESC')));
        foreach ($products as $product):
            $this->Product->id = $product['Product']['id'];
            $name = $this->Product->read('name')['Product']['name'];
            $unite_id = $this->Product->Unite->find('first', array(
                'conditions' => array('Unite.name' => 'ens')
            ));
            if (strpos($name, 'Kit') !== false) {
                echo $name . "<br>";
                $this->Product->saveField("unite_id", $unite_id['Unite']['id']);
            }
            if (strpos($name, 'kit') !== false) {
                echo $name . "<br>";
                $this->Product->saveField("unite_id", $unite_id['Unite']['id']);
            }
        endforeach;
        die();
    }

    function index_product() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $products = $this->Product->find('all', array(
                'conditions' => array('Product.type <>' => 'Colis'),
                'order' => array('Product.created DESC')));
            echo json_encode($products);
            die();
        }
        die();
    }

    public function products_famille() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            debug($this->request->data);
//            $this->Product->contain('Famille');
            $productsfamille = $this->Product->find('all', array(
                'conditions' => array('Product.type <>' => 'Colis', 'Product.famille_id' => $this->request->data['Product']['id']),
                'order' => array('Product.modified DESC')
            ));
            http_response_code(200);
            echo json_encode(array(
                'data' => $productsfamille, 
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    public function ajout_product() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
            if ($this->Product->save($data)) {
                $dataStock = array(
                    'ProductsStock' => array(
                        'id' => NULL,
                        'product_id' => $this->Product->getLastInsertID(),
                        'qte' => 0,
                        'stock_id' => 1
                    )
                );
                $this->ProductsStock->save($dataStock);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Produit ajouté avec succès"),
                    'LastId' => $this->Product->getLastInsertID(),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
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
            $this->Product->id = $data['Product']['id'];
            $product = $this->Product->read();
            if (!empty($product)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $product,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
//                http_response_code(404);
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Produit non trouvé"),
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
//        header("Content-Type: multipart/form-data");
        header("Access-Control-Allow-Headers: Process-Data, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put', 'post'))) {
            $data = $this->request->data;
            $file = $this->params['form']['file'];
//            debug($file);
//            debug($data); die();
            $product['Product'] = $data;
            if (!empty($file)) {
                $dir = IMAGES . "products";
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($product['Product']['name'])) . "." . $ext, "-"));
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
                    $product['Product']['url'] = "products" . DS . $filename;
                    if ($this->Product->save($product)) {
                        http_response_code(200);
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'text' => __("Produit modifié avec success"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            } else {
                if ($this->Product->save($data)) {
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("Produit modifié avec success"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }

            die();
        } else {
            $this->request->data = $this->Product->read();
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
            $this->Product->delete($this->request->data['Product']['id']);
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => __("ce Produit a était supprimé avec succès"),
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

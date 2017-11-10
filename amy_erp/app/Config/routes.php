<?php

Router::connect('/', array('controller' => 'users', 'action' => 'login'));
//Gestion Admin
Router::connect('/admin/users', array('controller' => 'users', 'action' => 'index', 'admin' => true));
Router::connect('/admin/add-user', array('controller' => 'users', 'action' => 'add_user', 'admin' => true));
Router::connect('/admin/list-user', array('controller' => 'users', 'action' => 'list_user', 'admin' => true));
Router::connect('/admin/edit-user', array('controller' => 'users', 'action' => 'edit_user', 'admin' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/admin/delete-:id', array('controller' => 'users', 'action' => 'delete', 'admin' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//gestion clients for manager
Router::connect('/gestion-clients', array('controller' => 'users', 'action' => 'list_client', 'manager' => true));
Router::connect('/gestion-clients/add-client', array('controller' => 'users', 'action' => 'add_client', 'manager' => true));
Router::connect('/gestion-clients/edit-:id', array('controller' => 'users', 'action' => 'edit_client', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-clients/view-:id', array('controller' => 'users', 'action' => 'view_client', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-clients/delete-:id', array('controller' => 'users', 'action' => 'delete_client', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));

//Gestion Manager
// gestion devis manager
Router::connect('/manager/users', array('controller' => 'users', 'action' => 'index', 'manager' => true));
Router::connect('/manager/gestion-devis', array('controller' => 'devis', 'action' => 'index', 'manager' => true));
Router::connect('/manager/gestion-devis/view-:id', array('controller' => 'devis', 'action' => 'view', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-devis/edit-:id', array('controller' => 'devis', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-devis/add', array('controller' => 'devis', 'action' => 'add', 'manager' => true));
Router::connect('/manager/bon-livraison', array('controller' => 'commandes', 'action' => 'livraison', 'manager' => true));
Router::connect('/manager/gestion-devis/bon-livraison-:id', array('controller' => 'devis', 'action' => 'bon_livraison', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-devis/bon-commande-:id', array('controller' => 'devis', 'action' => 'bon_commande', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-devis/bon-livraison-facture-:id', array('controller' => 'devis', 'action' => 'bon_livraison_facture', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-produits/get_price', array('controller' => 'products', 'action' => 'get_price', 'manager' => true));
Router::connect('/gestion-produits/product-by-code', array('controller' => 'products', 'action' => 'product_name', 'manager' => true));
Router::connect('/manager/gestion-devis/delete-:id', array('controller' => 'devis', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-produits/get_product', array('controller' => 'products', 'action' => 'get_product', 'manager' => true));
Router::connect('/manager/gestion-devis/bon-edit', array('controller' => 'devis', 'action' => 'bon_edit', 'manager' => true));
Router::connect('/manager/gestion-devis/update_remise', array('controller' => 'devis', 'action' => 'update_remise', 'manager' => true));
/**
 * gestion commande for Manager
 */
Router::connect('/manager/gestion-commandes', array('controller' => 'commandes', 'action' => 'index', 'manager' => true));
Router::connect('/manager/gestion-commandes/count', array('controller' => 'commandes', 'action' => 'count_commande', 'manager' => true));
 Router::connect('/manager/bon-livraison', array('controller' => 'commandes', 'action' => 'livraison', 'manager' => true));
Router::connect('/manager/bon-livraison-sans-facture', array('controller' => 'commandes', 'action' => 'livraison_sans_facture', 'manager' => true));
Router::connect('/manager/bon-livraison-avec-facture', array('controller' => 'commandes', 'action' => 'livraison_facture', 'manager' => true));
Router::connect('/manager/gestion-commandes/add', array('controller' => 'commandes', 'action' => 'add', 'manager' => true));
Router::connect('/manager/gestion-commandes/view-:id', array('controller' => 'commandes', 'action' => 'view', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/edit-:id', array('controller' => 'commandes', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/delete-:id', array('controller' => 'commandes', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/bon-edit', array('controller' => 'commandes', 'action' => 'bon_edit', 'manager' => true));
Router::connect('/manager/gestion-commandes/etats-commandes', array('controller' => 'commandes', 'action' => 'state_commandes', 'manager' => true));
Router::connect('/manager/gestion-commandes/bon-livraison-:id', array('controller' => 'commandes', 'action' => 'bon_livraison', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/bon-livraison-facture-:id', array('controller' => 'commandes', 'action' => 'bon_livraison_facture', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));


//Router::connect('/manager/gestion-commandes/delete-:id', array('controller' => 'commandes', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/non-traite', array('controller' => 'commandes', 'action' => 'commandes_by_state', 'state' => 'init', 'manager' => true));
Router::connect('/manager/gestion-commandes/en-cours', array('controller' => 'commandes', 'action' => 'commandes_by_state', 'state' => 'wait', 'manager' => true));
Router::connect('/manager/gestion-commandes/finalise', array('controller' => 'commandes', 'action' => 'commandes_by_state', 'state' => 'done', 'manager' => true));
Router::connect('/gestion-commandes/avoir', array('controller' => 'commandes', 'action' => 'index_avoir', 'manager' => true));
Router::connect('/manager/gestion-commandes/treate-:id', array('controller' => 'commandes', 'action' => 'treated', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/bon-livraison-:id', array('controller' => 'commandes', 'action' => 'bon_livraison', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-commandes/bon-livraison-facture-:id', array('controller' => 'commandes', 'action' => 'bon_livraison_facture', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/commandes/edit_bl_code', array('controller' => 'commandes', 'action' => 'edit_bl_code', 'manager' => true));
Router::connect('/manager/commandes/update_remise', array('controller' => 'commandes', 'action' => 'update_remise', 'manager' => true));

// gestion produit manager
//Router::connect('/gestion-produits/product-by-code', array('controller' => 'products', 'action' => 'product_name', 'admin' => true));
Router::connect('/manager/gestion-produits/add', array('controller' => 'products', 'action' => 'add', 'manager' => true));
Router::connect('/manager/gestion-produits/edit-:id', array('controller' => 'products', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//Router::connect('/manager/gestion-produits/view-:id', array('controller' => 'products', 'action' => 'view', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-produits/delete-:id', array('controller' => 'products', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/manager/gestion-produits', array('controller' => 'products', 'action' => 'index', 'manager' => true));

//Gestion Famille
Router::connect('/gestion-familles', array('controller' => 'familles', 'action' => 'index', 'manager' => true));
Router::connect('/gestion-familles/add', array('controller' => 'familles', 'action' => 'add', 'manager' => true));
Router::connect('/gestion-familles/edit-:id', array('controller' => 'familles', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-familles/delete-:id', array('controller' => 'familles', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//Gestion Category
Router::connect('/gestion-categories', array('controller' => 'categories', 'action' => 'index', 'manager' => true));
Router::connect('/gestion-categories/add', array('controller' => 'categories', 'action' => 'add', 'manager' => true));
Router::connect('/gestion-categories/edit-:id', array('controller' => 'categories', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-categories/delete-:id', array('controller' => 'categories', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//Gestion Tva
Router::connect('/gestion-taxes', array('controller' => 'tvas', 'action' => 'index', 'manager' => true));
Router::connect('/gestion-taxes/add', array('controller' => 'tvas', 'action' => 'add', 'manager' => true));
Router::connect('/gestion-taxes/edit-:id', array('controller' => 'tvas', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-taxes/delete-:id', array('controller' => 'tvas', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//Gestion Fournisseur
Router::connect('/gestion-fournisseurs', array('controller' => 'fournisseurs', 'action' => 'index', 'manager' => true));
Router::connect('/gestion-fournisseurs/add', array('controller' => 'fournisseurs', 'action' => 'add', 'manager' => true));
Router::connect('/gestion-fournisseurs/edit-:id', array('controller' => 'fournisseurs', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-fournisseurs/delete-:id', array('controller' => 'fournisseurs', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
//Gestion Facture for manager
Router::connect('/gestion-factures', array('controller' => 'factures', 'action' => 'index', 'manager' => true));
Router::connect('/manage_achat', array('controller' => 'factures', 'action' => 'manage_achat', 'manager' => true));
Router::connect('/gestion-factures/add', array('controller' => 'factures', 'action' => 'add', 'manager' => true));
Router::connect('/gestion-factures/avoir', array('controller' => 'factures', 'action' => 'index_avoir', 'manager' => true));
Router::connect('/gestion-factures/view-:id', array('controller' => 'factures', 'action' => 'view', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-factures/edit-:id', array('controller' => 'factures', 'action' => 'edit', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-factures/delete-:id', array('controller' => 'factures', 'action' => 'delete', 'manager' => true), array('pass' => array('id'), 'id' => '[0-9]+'));
Router::connect('/gestion-factures/bon-livraison-:id', array('controller' => 'factures', 'action' => 'bon_livraison', 'admin' => true), array('pass' => array('id'), 'id' => '[0-9]+'));

/**
 * Load all plugin routes. See the CakePlugin documentation on
 * how to customize the loading of plugin routes.
 */
CakePlugin::routes();

/**
 * Load the CakePHP default routes. Only remove this if you do not want to use
 * the built-in default routes.
 */
require CAKE . 'Config' . DS . 'routes.php';

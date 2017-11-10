<?php

App::import('Component', 'Pear.Pear');
$pear = new PearComponent(new ComponentCollection);
$pear->import('Numbers/Words');
$factureWord = new Numbers_Words();
?>
<?php $sommeFinal = explode('.', number_format($pricettc, 3)); ?>
<?php

$sommeTexte = ucfirst($factureWord->toWords($sommeFinal[0], 'fr')) . __(" Dinars et ") . ucfirst($factureWord->toWords($sommeFinal[1], 'fr')) . __(" Millimes");
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
echo json_encode(array(
    'text' => $sommeTexte,
    'status' => 200,
    'type' => 'success'
));
die();
?>
<?php

App::uses('AppController', 'Controller');
App::uses('CakeEmail', 'Network/Email');

class PagesController extends AppController {

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('show_config', 'config_pointage', 'test_pdf', 'mail_tester', 'import_localite', 'purge_cache', 'config', 'towords', 'show_page', 'import_client', 'import_voiture', 'update_client');
    }

    public $uses = array('Configuration', 'Post', 'Ville', 'User', 'Delegation', 'Localite');

//    public function json_insert() {
//        $days_in = '[{"Lundi": ["8-13", "14-17"]}, {"Mardi": ["8-13", "14-17"]},{"Mercredi": ["8-13", "14-17"]}]';
//        debug($days_in);
//        $daysAfter = json_decode($days_in, true);
//        debug($daysAfter);
//        echo (string) json_encode($daysAfter);
//        die();
//    }

    public function towords($pricettc = 0) {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->set(compact('pricettc'));
    }

    public function test_pdf() {
        $pathPdfCmd = "'wkhtmltopdf ";
        $options = "--zoom 1 -O Portrait -L 0 -R 0 ";
        $linkHtml = "http://batiment.amyevolution.com/admin/gestion-devis/view-220?key=123 --print-media-type";
        $filename = " /home/erp/www/app/webroot/files/pdf/facture" . time() . ".pdf 2>&1'";

        require_once APP . "Vendor" . DS . "PhpSCL" . DS . "Net" . DS . "SSH2.php";

        $ssh = new Net_SSH2('91.134.140.168');
        $ssh->login('root', 'p5lxClVQ');

        $ssh->read('[prompt]');
        $ssh->write("sudo php --version\n");
        $ssh->read('Password:');
        $ssh->write("Password\n");
        echo $ssh->read('[prompt]');
        die('done');
    }

    public function mail_tester() {
//        if ($this->request->is('post')) {
//            require_once APP . "Vendor" . DS . "Classes" . DS . "PHPExcel.php";
//            $data = $this->request->data;
//            $objPHPExcel = PHPExcel_IOFactory::load($data['User']['file']['tmp_name']);
//            $sheetData = $objPHPExcel->getSheet(0)->toArray(null, true, true, true);
//            $header = $sheetData[1];
//            $nbrEmail = 0;
//            foreach ($sheetData as $k => $row):
//                if ($k > 6) {
//                    debug($row);
//                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
//                    require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib/classes/Swift/Signers/DKIMSigner.php';
////            require_once "/home/amyevolunt/www/app" . DS . 'Vendor' . DS . 'SwiftMailer' . DS . 'lib' . DS . '/swift_required.php';
//                    //Transport
//                    $transport = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
//                            ->setUsername('h.riahi@amyevolution.com')
//                            ->setPassword('amy1234567');
//                    // DKIM 
//                    $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
//                    $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
//
//                    //Message
//                    $emailBody = file_get_contents(APP . "Vendor" . DS . "MailTemplate" . DS . "account.html");
//
//                    $emailBody_new = str_replace("#username#", $row['A'], $emailBody);
//                    $emailBody_new = str_replace("#password#", $row['B'], $emailBody_new);
//                    $emailBody_new = str_replace("#full_name#", $row['D'], $emailBody_new);
//                    $emailClient = $row['C'];
//                    $message = Swift_Message::newInstance()
//                            ->attachSigner($signer)
////                ->setTo('tic.hedi@gmail.com')
//                            ->setTo($emailClient)
////                            ->setTo('theljaoui.mohamed@gmail.com')
//                            ->setCc(array(
//                                'a.amdouni@amyevolution.com',
//                                't.mohamed@amyevolution.com'
//                            ))
//                            ->setSubject("Compte Espace Client")
//                            ->setBody('Plateforme ColisExpress.tn')
//                            ->addPart($emailBody_new, 'text/html')
//                            ->addPart(strip_tags($emailBody_new))
//                            ->setFrom('no-reply@colisexpress.tn');
//                    //Sending
//                    $mailer = Swift_Mailer::newInstance($transport);
//                    if ($mailer->send($message)) {
//                        $nbrEmail++;
//                    }
//                    sleep(2);
////                    die();
//                }
//            endforeach;
//            echo "Nbr. Email envoyé : " . $nbrEmail;
//            die();
//        }
    }

    function randomPassword() {
        $alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 6; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    function randomCodeClient() {
        $alphabet = '1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 5; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }

    function randomLogin($prefix = null, $ste = "-CET") {
        $alphabet = '1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 5; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return $prefix . implode($pass) . $ste; //turn the array into a string
    }

    public function import_localite() {
        ini_set('memory_limit', '2048M');
        set_time_limit(0);
        Configure::write("debug", 1);
//        ob_start();
        $rowToSave = 0;
//        $objPHPExcelToSave = new PHPExcel();
        $dataExist = 0;
        $newData = 0;
        if ($this->request->is('post')) {
            require_once APP . "Vendor" . DS . "Classes" . DS . "PHPExcel.php";
            $data = $this->request->data;
            $objPHPExcel = PHPExcel_IOFactory::load($data['Localite']['file']['tmp_name']);
            $sheetData = $objPHPExcel->getSheet(1)->toArray(null, true, true, true);
            $header = $sheetData[1];
            $textEmail = "";
            $localites = array();
            $ville = $this->Ville->find('first', array(
                'conditions' => array('Ville.name' => 'Mannouba')
            ));
            debug($ville['Ville']['id']);
            foreach ($sheetData as $k => $row):
//                $this->Delegation->recursive = -1;
                $delegation = $this->Delegation->find('first', array(
                    'conditions' => array('Delegation.name' => trim($row['A']), 'Delegation.ville_id' => 0)
                ));

                if (!empty($delegation)) {
                    $this->Delegation->id = $delegation['Delegation']['id'];
                    $this->Delegation->saveField('ville_id', $ville['Ville']['id']);
                    $localiteToSave = array(
                        'Localite' => array(
                            'id' => null,
                            'name' => trim($row['B']),
                            'zip_code' => strval(trim($row['C'])),
                            'delegation_id' => $delegation['Delegation']['id']
                        )
                    );
//                    $ifExistLocalite = $this->Localite->find('first', array(
//                        'conditions' => array('Localite.name' => trim($row['B']))
//                    ));
//                    $this->Localite->save($localiteToSave);
//                    debug($localiteToSave);
//                    if (empty($ifExistLocalite)) {
//                    }
                } else {
//                    echo debug($row['A']);
                    // debug(trim(str_replace(" ", "", $row['A'])));
                }
            endforeach;
            die();
        }
    }

    public function import_voiture() {
        ini_set('memory_limit', '2048M');
        set_time_limit(0);
        Configure::write("debug", 1);
//        ob_start();
        $rowToSave = 0;
//        $objPHPExcelToSave = new PHPExcel();
        $dataExist = 0;
        $newData = 0;
        if ($this->request->is('post')) {
            require_once APP . "Vendor" . DS . "Classes" . DS . "PHPExcel.php";
            $data = $this->request->data;
            $objPHPExcel = PHPExcel_IOFactory::load($data['User']['file']['tmp_name']);
            $sheetData = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            $header = $sheetData[1];
            $textEmail = "";
            foreach ($sheetData as $k => $row):
                if ($k > 1) {
//                    debug($row);
                    $login = strtoupper(substr(explode(" ", trim($row['A']))[0], 0, 1)) . strtoupper(substr(explode(" ", trim($row['A']))[1], 0, 1));
                    $loginPost = $this->randomLogin($login);
                    $password = $this->randomPassword();
                    $textEmail .= "<br>Nom Livreur : " . $row['A'] . " | Login : " . $loginPost . " | " . " Mot de passe : " . $password;
                    $user = array(
                        'User' => array(
                            'id' => null,
                            'username' => $loginPost,
                            'password' => $password,
                            'first_name' => explode(" ", trim($row['A']))[0],
                            'last_name' => explode(" ", trim($row['A']))[1],
                            'matricule_voiture' => $row['B'],
                            'phone' => "Perso : " . $row['C'] . "/Pro : " . $row['D'],
                            'role_id' => 6
                        )
                    );
//                    $this->User->save($user);
                }
            endforeach;
            debug($textEmail);
//            $Email = new CakeEmail('smtp');
//            $Email->template('default', 'default')
//                    ->subject('Accès Livreur')
//                    ->to('h.riahi@amyevolution.com')
//                    ->emailFormat("html")
//                    ->message($textEmail)
//                    ->from('no-reply@colisexpress.tn')
//                    ->send();
        }
    }

    public function update_client() {
        $this->User->recursive = -1;
        $users = $this->User->find('all', array(
            'conditions' => array('User.role_id' => 4)
        ));
//        foreach ($users as $user):
//            $this->User->id = $user['User']['id'];
//            $this->User->saveField('phone', str_replace(",", "", $user['User']['phone']));
//            $mt = $user['User']['matricule'];
//            $raison_social = $user['User']['raison_social'];
//            $nom_commercial = $user['User']['nom_commercial'];
//            if ($mt == null) {
//                $this->User->saveField('nom_commercial', $raison_social);
//                $this->User->saveField('raison_social', null);
//            } else {
//                $this->User->saveField('raison_social', $nom_commercial);
//                $this->User->saveField('nom_commercial', null);
//            }
//        endforeach;
        die();
    }

    public function import_client() {
        ini_set('memory_limit', '2048M');
        set_time_limit(0);
        Configure::write("debug", 1);
//        ob_start();
        $rowToSave = 0;
//        $objPHPExcelToSave = new PHPExcel();
        $dataExist = 0;
        $newData = 0;
        $types = array('notpro' => 'Particulier', 'pro' => 'Professionnel');
        if ($this->request->is('post')) {
            require_once APP . "Vendor" . DS . "Classes" . DS . "PHPExcel.php";
            $data = $this->request->data;
            $objPHPExcel = PHPExcel_IOFactory::load($data['User']['file']['tmp_name']);
            $sheetData = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            $header = $sheetData[1];
            echo "<table>";
            foreach ($sheetData as $k => $row):
                if ($k > 1) {
//                    debug($row);
                    $login = "";
                    ($row['B'] == null || $row['C'] == null) ? $login = strtoupper(substr(trim($row['A']), 0, 2)) : $login = strtoupper(substr(trim($row['B']), 0, 1)) . strtoupper(substr(trim($row['C']), 0, 1));
//                    debug($login);
                    $loginPost = $this->randomLogin($login);
                    $password = $this->randomPassword();
//                    debug($loginPost);
                    $data = array(
                        'username' => $loginPost,
                        'password' => $password
                    );
                    $type_client = "Professionnel";
                    $nom_commercial = "";
                    $raison_social = "";
                    if (empty($row['I'])) {
                        $type_client = "Particulier";
                        $nom_commercial = $row['A'];
                        $raison_social = "";
                    } else {
                        $nom_commercial = "";
                        $raison_social = $row['A'];
                    }
                    $ville_id = $this->Ville->find('first', array(
                        'conditions' => array('Ville.name' => ucwords($row['H']))
                    ));
                    $user = array(
                        'User' => array(
                            'id' => null,
                            'code' => $this->randomCodeClient(),
                            'username' => $loginPost,
                            'password' => $password,
                            'email' => trim($row['E']),
                            'type_client' => $type_client,
                            'raison_social' => $raison_social,
                            'nom_commercial' => $nom_commercial,
                            'adress' => trim($row['F']),
                            'postal' => $row['G'],
                            'ville_id' => $ville_id['Ville']['id'],
                            'role_id' => 4,
                            'first_name' => $row['B'],
                            'last_name' => $row['C'],
                            'phone' => strval($row['D']),
                            'matricule' => $row['I'],
                            'frais_livraison' => $row['J'],
                            'frais_annulation' => $row['K'],
                        )
                    );
                    echo "<tr><td>$loginPost</td><td>$password</td><td>" . trim($row['E']) . "</td><td>$nom_commercial</td></tr>";
//                    debug($user);
//                    $ifExistUser = $this->User->find('first', array(
//                        'conditions' => array('User.email' => trim($row['E']))
//                    ));
//                    if (empty($ifExistUser)) {
                    $this->User->save($user);
//                    }
//                    if (!empty($row['E'])) {
//                        $Email->template('validate_register', 'default')
//                                ->emailFormat('html')
//                                ->subject('Espace Client ColisExpress.tn')
//                                ->to(trim($row['E']))
//                                ->cc(array('h.riahi@amyevolution.com', 'commercial@colisexpress.tn'))
//                                ->viewVars($data)
//                                ->from('no-reply@colisexpress.tn')
//                                ->send();
//                    }
//                    die();
                }
            endforeach;
            echo "</table>";
            die();
//            $objPHPExcelWrite = new PHPExcel_Writer_Excel2007($objPHPExcelToSave);
//            $objPHPExcelWrite->save("france_ilefrance.xlsx");
            debug("New DATA : " . $newData);
            debug("Existing DATA : " . $dataExist);
//            ob_end_clean();
            die();
            $this->set(compact('dataExist', 'newData'));
        }
        $this->set(compact('dataExist', 'newData'));
    }

    public function purge_cache() {
        header('Access-Control-Allow-Origin: *, https://espaceclient.amyevolution.com', 'https://livreur.amyevolution.com');
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        //$commande = 'curl -X DELETE "https://api.cloudflare.com/client/v4/zones/85ca93e18b5076dd8381edca6ea1748b/purge_cache" -H "X-Auth-Email: tic.hedi@gmail.com" -H "X-Auth-Key: 6edacd58d686f2f70354c49ea26f083ef6571"       -H "Content-Type: application/json" --data "{\"purge_everything\":true}"';
        // Generated by curl-to-PHP: http://incarnate.github.io/curl-to-php/
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://api.cloudflare.com/client/v4/zones/85ca93e18b5076dd8381edca6ea1748b/purge_cache");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"purge_everything\":true}");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");


        $headers = array();
        $headers[] = "X-Auth-Email: tic.hedi@gmail.com";
        $headers[] = "X-Auth-Key: bd1b7873f74a38bfc322d3dd7c598651e9c49";
        $headers[] = "Content-Type: application/json";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        echo $result;
        curl_close($ch);
        die();
    }

    // config
    public function show_config() {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $config = $this->Configuration->find('first');
            $days_in = $config['Configuration']['jours_travail'];
            $daysAfter = json_decode($days_in, true);
//            debug($daysAfter);
//            die();
            http_response_code(200);
            echo json_encode(array(
                'data' => $config,
                'jours_travail' => $daysAfter,
                'status' => 403,
                'type' => 'error'
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

    function config() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
//        header("Content-Type: multipart/form-data");
        header("Access-Control-Allow-Headers: Process-Data, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('put', 'post'))) {
            $data = $this->request->data;
            $file = $this->params['form']['file'];
//            debug($data);
//            debug($file);
//            die();
            if (!empty($file)) {
                $dir = IMAGES . "logo";
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($data['raison_social'])) . "." . $ext, "."));
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
//                debug($filename); die();
//                $data['logo'] = "logo" . DS . $filename;
                $data['logo'] = $filename;
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
//                    debug($file["tmp_name"], $dir . DS . $filename);
//                    debug($data);
//                    die();
                    if ($this->Configuration->save($data)) {
                        http_response_code(200);
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'text' => __("Configuration Mis à jour avec succès"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            } else {
                if ($this->Configuration->save($data)) {
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("Configuration Mis à jour avec succès"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }
            die();
        } else {
            $this->request->data = $this->Configuration->read();
        }
    }

    // config pointages
    public function config_pointage() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            debug($data);
//            die();
//            debug($data['Configuration']['joursTravails']);
//            $jourTravail = [];
            foreach ($data['Configuration']['joursTravails'] as $config):
                $name_jour = $config['jour'];
                $heursTravail = [$config['date_debut'], $config['jour_fin'], $config['date_debut_midi'], $config['date_fin_midi']];
                $jourTravail[$name_jour] = $heursTravail;
            endforeach;
//            debug($jourTravail);
//            die();
            $configu = array(
                'Configuration' => array(
                    'id' => 1,
                    'type_pointage' => $data['Configuration']['type_pointage'],
                    'ip_pointeuse' => $data['Configuration']['ip_pointeuse'],
                    'NHT' => $data['Configuration']['NHT'],
                    'price_hs' => $data['Configuration']['price_hs'],
                    'jours_travail' => json_encode($jourTravail)
                )
            );
//            debug(json_encode($jourTravail));
//            die();
            if ($this->Configuration->save($configu)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Configuration Mis à jour avec succès"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    //CMS PART
    public function show_page($type = null) {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: Process-Data, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        header("Content-Type: application/json");
        if ($this->request->is('post')) {
            $page = $this->Post->find('first', array(
                'conditions' => array('Post.type' => $type)
            ));
            if (!empty($page)) {
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $page,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                header('HTTP/1.0 404 Not Found');
                echo json_encode(array(
                    'text' => __("Contenu Non Trouvé"),
                    'status' => 404,
                    'type' => 'error'
                ));
            }
            die();
        }
        header('HTTP/1.0 403 Forbidden');
        echo json_encode(array(
            'text' => __("Not Allowed To Access"),
            'status' => 403,
            'type' => 'error'
        ));
        die();
    }

}

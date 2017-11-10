<?php

App::uses('AppController', 'Controller');
App::uses('ClientsController', 'Controller');

class EmployesController extends AppController {

    public $uses = array('User', 'Ville', 'Commercial', 'PaymentsUser', 'Pointage', 'SortiesPointage');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('addemail', 'list_employee', 'view', 'view_test');
    }

// envoie mail
    public function addemail() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $file = $this->params['form']['file'];
            $dir = APP . "webroot" . DS . "tmp_email";
            $attachements = null;
            $filename = "";
            if (!empty($file)) {
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                $filename = $file['name'];
                if (move_uploaded_file($file['tmp_name'], $dir . DS . $filename)) {
//                    $attachements = Swift_Attachment::newInstance($dir . DS . $filename);
                }
            }
            require_once APP . 'Plugin' . DS . 'SwiftMailer' . DS . 'lib' . DS . 'swift_required.php';
            //Transport
            $mailbox = Swift_SmtpTransport::newInstance('ns0.ovh.net', 587)
                    ->setUsername('h.riahi@amyevolution.com')
                    ->setPassword('amy1234567');
            // DKIM 
            $privateKey = file_get_contents(APP . "Vendor" . DS . "Keys" . DS . "dkim.private.key");
            $signer = new Swift_Signers_DKIMSigner($privateKey, 'amyevolution.com', 'default');
            $message = Swift_Message::newInstance()
                    ->attachSigner($signer)
                    ->setTo($data['email'])
                    ->setSubject($data['objet'])
                    ->attach(Swift_Attachment::fromPath($dir . DS . $filename))
                    ->addPart($data['content'], 'text/html')
                    ->setFrom('test@amyevolution.com');
            //Sending
            $mailer = Swift_Mailer::newInstance($mailbox);
            if ($mailer->send($message)) {
                unlink($dir . DS . $filename);
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => __('Mail envoyé avec succès'),
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            }
        }
        die();
    }

    // export list employées
    public function list_employee() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        $this->User->recursive = -1;
        if ($this->request->is('post')) {
            $employes = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
                'fields' => array(
                    'CONCAT(User.first_name, " ", User.last_name) AS NomComplet',
                    'User.last_name AS Nom',
                    'User.first_name AS Prenom',
                    'User.num_cin AS CIN',
                    'User.status AS Titre',
                    'User.num_cnss AS NumCNSS',
                    'User.count_kids AS NbreEnfant',
                    'User.phone AS Telephone',
                    'User.email AS Email',
                    'User.salaire AS SalaireNET'
                )
            ));
            http_response_code(200);
            $employes_exports = array();
            if (!empty($employes)) {
                foreach ($employes as $employe):
                    if (empty($employe['User']['Email'])) {
                        $employe['User']['Email'] = "";
                    }
                    array_push($employes_exports, $employe['User']);
                endforeach;
            }
            echo json_encode($employes_exports);
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

// view employé
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            setlocale(LC_ALL, "fr_FR.utf8");
            $data = $this->request->data;
            $m = date('m');
            $y = date('Y');
            if (!empty($data['User']['mois'])) {
                $m = $data['User']['mois'];
            }
            if (!empty($data['User']['annee'])) {
                $y = $data['User']['annee'];
            }
            $date = $y . '-' . $m . '-%';
//            debug($date);
            $jour_travail = $this->getConfiguration()['Configuration']['jours_travail'];
            $daysAfter = json_decode($jour_travail, true);
            $this->User->contain('Ville', 'Pointage', 'Pointage.SortiesPointage', 'PrimesUser.date LIKE "' . $date . '"', 'PrimesUser.Prime');
            $id = $data['User']['id'];
            $this->User->id = $id;
            $employe = $this->User->read();
            $date = date('Y') . '-' . date('m') . "-%";
//            debug($employe);
            if (!empty($employe)) {
                $this->Pointage->contain('SortiesPointage');
                // liste pointage to employé not absent
                $pointages = $this->Pointage->find('all', array(
                    'conditions' => array(
                        'Pointage.user_id' => $id,
                        'Pointage.created LIKE' => $date,
                    )
                ));
                // calcul count hour
                $TH = 0;
                $TH_glob = 0;
                if (!empty($pointages)) {
                    foreach ($pointages as $pointage):
                        if ($pointage['Pointage']['isAbsent'] == FALSE) {
                            // heure de travail global 
                            $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                            if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                                $time_jour = $daysAfter[$jour_pointage];
                                // matin
                                $strStartMatin_glob = date('Y-m-d') . ' ' . $time_jour[0];
                                $strEndMatin_glob = date('Y-m-d') . ' ' . $time_jour[1];
                                $dteStartMatin_glob = new DateTime($strStartMatin_glob);
                                $dteEndMatin_glob = new DateTime($strEndMatin_glob);
                                $dteDiffMatin_glob = $dteStartMatin_glob->diff($dteEndMatin_glob);
                                $dteHourDiffMatin_glob = $dteDiffMatin_glob->format("%H");
                                $dteMinuteDiffMatin_glob = $dteDiffMatin_glob->format("%I");
                                // midi
                                $dteHourDiffMidi_glob = 0;
                                $dteMinuteDiffMidi_glob = 0;
                                if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                    $strStartMidi_glob = date('Y-m-d') . ' ' . $time_jour[2];
                                    $strEndMidi_glob = date('Y-m-d') . ' ' . $time_jour[3];
                                    $dteStartMidi_glob = new DateTime($strStartMidi_glob);
                                    $dteEndMidi_glob = new DateTime($strEndMidi_glob);
                                    $dteDiffMidi_glob = $dteStartMidi_glob->diff($dteEndMidi_glob);
                                    $dteHourDiffMidi_glob = $dteDiffMidi_glob->format("%H");
                                    $dteMinuteDiffMidi_glob = $dteDiffMidi_glob->format("%I");
                                }
                                // calcul total
                                $total_hour_glob = $dteHourDiffMatin_glob + $dteHourDiffMidi_glob;
                                $total_minute_glob = $dteMinuteDiffMatin_glob + $dteMinuteDiffMidi_glob;
                            }
                            $TH_glob += $total_hour_glob . '.' . $total_minute_glob;
                            //heures de travail personnel
                            $this->SortiesPointage->recursive = -1;
                            // total heure supp
                            $hs = $this->SortiesPointage->find('all', array(
                                'conditions' => array('SortiesPointage.pointage_id' => $pointage['Pointage']['id'], 'SortiesPointage.type' => 'HS')
                            ));
                            $dteHourDiffHS = 0;
                            $dteMinuteDiffHS = 0;
                            if (!empty($hs)) {
                                foreach ($hs as $hour):
//                            //debug($hour);
                                    $strStart = $hour['SortiesPointage']['date_sortie'];
                                    $strEnd = $hour['SortiesPointage']['date_entree'];
                                    $dteStart = new DateTime($strStart);
                                    $dteEnd = new DateTime($strEnd);
                                    $dteDiff = $dteStart->diff($dteEnd);
                                    $dteHourDiff = $dteDiff->format("%H");
                                    $dteMinuteDiff = $dteDiff->format("%I");
                                    $dteHourDiffHS += $dteHourDiff;
                                    $dteMinuteDiffHS += $dteMinuteDiff;
                                endforeach;
                            }
                            // end total heure supp
                            // total heure sortie
                            $sorties = $this->SortiesPointage->find('all', array(
                                'conditions' => array('SortiesPointage.pointage_id' => $pointage['Pointage']['id'], 'SortiesPointage.type' => 'Sortie')
                            ));
                            $dteHourDiffSortie = 0;
                            $dteMinuteDiffSortie = 0;
                            $dteHourDiffSortieNotAuto = 0;
                            $dteMinuteDiffSortieNotAuto = 0;
                            if (!empty($sorties)) {
                                foreach ($sorties as $sortie):
//                            //debug($sortie);
                                    if ($sortie['SortiesPointage']['cause'] === 'Abandon') {
                                        $strStart = $sortie['SortiesPointage']['date_sortie'];
                                        $strEnd = $sortie['SortiesPointage']['date_entree'];
                                        $dteStart = new DateTime($strStart);
                                        $dteEnd = new DateTime($strEnd);
                                        $dteDiff = $dteStart->diff($dteEnd);
                                        $dteHourDiff = $dteDiff->format("%H");
                                        $dteMinuteDiff = $dteDiff->format("%I");
                                        $dteHourDiffSortieNotAuto += $dteHourDiff;
                                        $dteMinuteDiffSortieNotAuto += $dteMinuteDiff;
                                    }
                                endforeach;
                            }
                            $EM = ($pointage['Pointage']['date_entree']) ? $pointage['Pointage']['date_entree'] : 'Non Pointé';
                            $SM = ($pointage['Pointage']['date_sortie']) ? $pointage['Pointage']['date_sortie'] : 'Non Pointé';
                            $ES = ($pointage['Pointage']['date_entree_midi']) ? $pointage['Pointage']['date_entree_midi'] : 'Non Pointé';
                            $SS = ($pointage['Pointage']['date_sortie_midi']) ? $pointage['Pointage']['date_sortie_midi'] : 'Non Pointé';
                            $dteHourDiffMatin = 0;
                            $dteMinuteDiffMatin = 0;
                            if ($EM !== 'Non Pointé' && $SM !== 'Non Pointé') {
                                // calcul
                                // matin
                                $strStartMatin = $EM;
                                $strEndMatin = $SM;
                                $dteStartMatin = new DateTime($strStartMatin);
                                $dteEndMatin = new DateTime($strEndMatin);
                                $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                                $dteHourDiffMatin = $dteDiffMatin->format("%H");
                                $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                            }
                            // midi
                            $dteHourDiffMidi = 0;
                            $dteMinuteDiffMidi = 0;
                            if ($ES !== 'Non Pointé' && $SS !== 'Non Pointé') {
                                $strStartMidi = $ES;
                                $strEndMidi = $SS;
                                $dteStartMidi = new DateTime($strStartMidi);
                                $dteEndMidi = new DateTime($strEndMidi);
                                $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                                $dteHourDiffMidi = $dteDiffMidi->format("%H");
                                $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                            }
                            // calcul total
                            $total_hour = $dteHourDiffMatin + $dteHourDiffMidi + $dteHourDiffHS - $dteHourDiffSortieNotAuto;
                            $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi + $dteMinuteDiffHS - $dteMinuteDiffSortieNotAuto;
                            // end calcul
                            if ($total_minute < 0) {
                                $total_minute = - $total_minute;
                                $total_hour = $total_hour - 1;
                            }
                            $TH += $total_hour . '.' . $total_minute;
                        } else if ($pointage['Pointage']['isAutorise'] == TRUE || in_array($pointage['Pointage']['cause'], ['Congé', 'Mission'])) {
                            $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                            if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                                $time_jour = $daysAfter[$jour_pointage];
                                // matin
                                $strStartMatin = date('Y-m-d') . ' ' . $time_jour[0];
                                $strEndMatin = date('Y-m-d') . ' ' . $time_jour[1];
                                $dteStartMatin = new DateTime($strStartMatin);
                                $dteEndMatin = new DateTime($strEndMatin);
                                $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                                $dteHourDiffMatin = $dteDiffMatin->format("%H");
                                $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                                // midi
                                $dteHourDiffMidi = 0;
                                $dteMinuteDiffMidi = 0;
                                if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                    $strStartMidi = date('Y-m-d') . ' ' . $time_jour[2];
                                    $strEndMidi = date('Y-m-d') . ' ' . $time_jour[3];
                                    $dteStartMidi = new DateTime($strStartMidi);
                                    $dteEndMidi = new DateTime($strEndMidi);
                                    $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                                    $dteHourDiffMidi = $dteDiffMidi->format("%H");
                                    $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                                }
                                // calcul total
                                $total_hour = $dteHourDiffMatin + $dteHourDiffMidi;
                                $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi;
                            }
                            $TH += $total_hour . '.' . $total_minute;
                            $TH_glob += $total_hour . '.' . $total_minute;
                        } else {
                            $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                            if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                                $time_jour = $daysAfter[$jour_pointage];
                                // matin
                                $strStartMatin = date('Y-m-d') . ' ' . $time_jour[0];
                                $strEndMatin = date('Y-m-d') . ' ' . $time_jour[1];
                                $dteStartMatin = new DateTime($strStartMatin);
                                $dteEndMatin = new DateTime($strEndMatin);
                                $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                                $dteHourDiffMatin = $dteDiffMatin->format("%H");
                                $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                                // midi
                                $dteHourDiffMidi = 0;
                                $dteMinuteDiffMidi = 0;
                                if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                    $strStartMidi = date('Y-m-d') . ' ' . $time_jour[2];
                                    $strEndMidi = date('Y-m-d') . ' ' . $time_jour[3];
                                    $dteStartMidi = new DateTime($strStartMidi);
                                    $dteEndMidi = new DateTime($strEndMidi);
                                    $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                                    $dteHourDiffMidi = $dteDiffMidi->format("%H");
                                    $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                                }
                                // calcul total
                                $total_hour = $dteHourDiffMatin + $dteHourDiffMidi;
                                $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi;
                            }
                            $TH += - $total_hour . '.' . $total_minute;
                            $TH_glob += - $total_hour . '.' . $total_minute;
                        }
                    endforeach;
                }
                $hs_total = $TH - $TH_glob;
                if ($hs_total < 0) {
                    $hs_total = 0;
                }
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $employe,
                    'TH' => $TH,
                    'TH_glob' => $TH_glob,
                    'hs_total' => $hs_total,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->body(json_encode(array(
                    'text' => __("Empolyé non trouvé"),
                    'status' => 403,
                    'type' => 'success'
                )));
            }
            die();
        }
        die();
    }

// view employé
    public function view_test($id) {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//        if ($this->request->is('post')) {
        $data = $this->request->data;
        setlocale(LC_ALL, "fr_FR.utf8");
        $this->User->contain('Ville', 'Pointage', 'Pointage.SortiesPointage');
        $jour_travail = $this->getConfiguration()['Configuration']['jours_travail'];
        $daysAfter = json_decode($jour_travail, true);

//            $id = $data['User']['id'];
//            $this->User->id = $data['User']['id'];
        $this->User->id = $id;
        $employe = $this->User->read();
        $date = date('Y') . '-' . date('m') . "-%";
//            debug($employe);
        if (!empty($employe)) {
            $this->Pointage->contain('SortiesPointage');
            // liste pointage to employé not absent
            $pointages = $this->Pointage->find('all', array(
                'conditions' => array(
                    'Pointage.user_id' => $id,
//                    'Pointage.isAbsent' => FALSE,
                    'Pointage.created LIKE' => $date,
                )
            ));
            // calcul count hour
            $TH = 0;
            $TH_glob = 0;
            if (!empty($pointages)) {
                foreach ($pointages as $pointage):
                    if ($pointage['Pointage']['isAbsent'] == FALSE) {
                        // heure de travail global 
                        $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                            $time_jour = $daysAfter[$jour_pointage];
                            // matin
                            $strStartMatin_glob = date('Y-m-d') . ' ' . $time_jour[0];
                            $strEndMatin_glob = date('Y-m-d') . ' ' . $time_jour[1];
                            $dteStartMatin_glob = new DateTime($strStartMatin_glob);
                            $dteEndMatin_glob = new DateTime($strEndMatin_glob);
                            $dteDiffMatin_glob = $dteStartMatin_glob->diff($dteEndMatin_glob);
                            $dteHourDiffMatin_glob = $dteDiffMatin_glob->format("%H");
                            $dteMinuteDiffMatin_glob = $dteDiffMatin_glob->format("%I");
                            // midi
                            $dteHourDiffMidi_glob = 0;
                            $dteMinuteDiffMidi_glob = 0;
                            if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                $strStartMidi_glob = date('Y-m-d') . ' ' . $time_jour[2];
                                $strEndMidi_glob = date('Y-m-d') . ' ' . $time_jour[3];
                                $dteStartMidi_glob = new DateTime($strStartMidi_glob);
                                $dteEndMidi_glob = new DateTime($strEndMidi_glob);
                                $dteDiffMidi_glob = $dteStartMidi_glob->diff($dteEndMidi_glob);
                                $dteHourDiffMidi_glob = $dteDiffMidi_glob->format("%H");
                                $dteMinuteDiffMidi_glob = $dteDiffMidi_glob->format("%I");
                            }
                            // calcul total
                            $total_hour_glob = $dteHourDiffMatin_glob + $dteHourDiffMidi_glob;
                            $total_minute_glob = $dteMinuteDiffMatin_glob + $dteMinuteDiffMidi_glob;
                        }
                        $TH_glob += $total_hour_glob . '.' . $total_minute_glob;
                        //heures de travail personnel
                        $this->SortiesPointage->recursive = -1;
                        // total heure supp
                        $hs = $this->SortiesPointage->find('all', array(
                            'conditions' => array('SortiesPointage.pointage_id' => $pointage['Pointage']['id'], 'SortiesPointage.type' => 'HS')
                        ));
                        $dteHourDiffHS = 0;
                        $dteMinuteDiffHS = 0;
                        if (!empty($hs)) {
                            foreach ($hs as $hour):
//                            //debug($hour);
                                $strStart = $hour['SortiesPointage']['date_sortie'];
                                $strEnd = $hour['SortiesPointage']['date_entree'];
                                $dteStart = new DateTime($strStart);
                                $dteEnd = new DateTime($strEnd);
                                $dteDiff = $dteStart->diff($dteEnd);
                                $dteHourDiff = $dteDiff->format("%H");
                                $dteMinuteDiff = $dteDiff->format("%I");
                                $dteHourDiffHS += $dteHourDiff;
                                $dteMinuteDiffHS += $dteMinuteDiff;
                            endforeach;
                        }
                        // end total heure supp
                        // total heure sortie
                        $sorties = $this->SortiesPointage->find('all', array(
                            'conditions' => array('SortiesPointage.pointage_id' => $pointage['Pointage']['id'], 'SortiesPointage.type' => 'Sortie')
                        ));
                        $dteHourDiffSortie = 0;
                        $dteMinuteDiffSortie = 0;
                        $dteHourDiffSortieNotAuto = 0;
                        $dteMinuteDiffSortieNotAuto = 0;
                        if (!empty($sorties)) {
                            foreach ($sorties as $sortie):
//                            //debug($sortie);
                                if ($sortie['SortiesPointage']['cause'] === 'Abandon') {
                                    $strStart = $sortie['SortiesPointage']['date_sortie'];
                                    $strEnd = $sortie['SortiesPointage']['date_entree'];
                                    $dteStart = new DateTime($strStart);
                                    $dteEnd = new DateTime($strEnd);
                                    $dteDiff = $dteStart->diff($dteEnd);
                                    $dteHourDiff = $dteDiff->format("%H");
                                    $dteMinuteDiff = $dteDiff->format("%I");
                                    $dteHourDiffSortieNotAuto += $dteHourDiff;
                                    $dteMinuteDiffSortieNotAuto += $dteMinuteDiff;
                                }
                            endforeach;
                        }
                        $EM = ($pointage['Pointage']['date_entree']) ? $pointage['Pointage']['date_entree'] : 'Non Pointé';
                        $SM = ($pointage['Pointage']['date_sortie']) ? $pointage['Pointage']['date_sortie'] : 'Non Pointé';
                        $ES = ($pointage['Pointage']['date_entree_midi']) ? $pointage['Pointage']['date_entree_midi'] : 'Non Pointé';
                        $SS = ($pointage['Pointage']['date_sortie_midi']) ? $pointage['Pointage']['date_sortie_midi'] : 'Non Pointé';
                        $dteHourDiffMatin = 0;
                        $dteMinuteDiffMatin = 0;
                        if ($EM !== 'Non Pointé' && $SM !== 'Non Pointé') {
                            // calcul
                            // matin
                            $strStartMatin = $EM;
                            $strEndMatin = $SM;
                            $dteStartMatin = new DateTime($strStartMatin);
                            $dteEndMatin = new DateTime($strEndMatin);
                            $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                            $dteHourDiffMatin = $dteDiffMatin->format("%H");
                            $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                        }
                        // midi
                        $dteHourDiffMidi = 0;
                        $dteMinuteDiffMidi = 0;
                        if ($ES !== 'Non Pointé' && $SS !== 'Non Pointé') {
                            $strStartMidi = $ES;
                            $strEndMidi = $SS;
                            $dteStartMidi = new DateTime($strStartMidi);
                            $dteEndMidi = new DateTime($strEndMidi);
                            $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                            $dteHourDiffMidi = $dteDiffMidi->format("%H");
                            $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                        }
                        // calcul total
                        $total_hour = $dteHourDiffMatin + $dteHourDiffMidi + $dteHourDiffHS - $dteHourDiffSortieNotAuto;
                        $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi + $dteMinuteDiffHS - $dteMinuteDiffSortieNotAuto;
                        // end calcul
                        if ($total_minute < 0) {
                            $total_minute = - $total_minute;
                            $total_hour = $total_hour - 1;
                        }
                        $TH += $total_hour . '.' . $total_minute;
                    } else if ($pointage['Pointage']['isAutorise'] == TRUE || in_array($pointage['Pointage']['cause'], ['Congé', 'Mission'])) {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                            $time_jour = $daysAfter[$jour_pointage];
                            // matin
                            $strStartMatin = date('Y-m-d') . ' ' . $time_jour[0];
                            $strEndMatin = date('Y-m-d') . ' ' . $time_jour[1];
                            $dteStartMatin = new DateTime($strStartMatin);
                            $dteEndMatin = new DateTime($strEndMatin);
                            $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                            $dteHourDiffMatin = $dteDiffMatin->format("%H");
                            $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                            // midi
                            $dteHourDiffMidi = 0;
                            $dteMinuteDiffMidi = 0;
                            if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                $strStartMidi = date('Y-m-d') . ' ' . $time_jour[2];
                                $strEndMidi = date('Y-m-d') . ' ' . $time_jour[3];
                                $dteStartMidi = new DateTime($strStartMidi);
                                $dteEndMidi = new DateTime($strEndMidi);
                                $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                                $dteHourDiffMidi = $dteDiffMidi->format("%H");
                                $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                            }
                            // calcul total
                            $total_hour = $dteHourDiffMatin + $dteHourDiffMidi;
                            $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi;
                        }
                        $TH += $total_hour . '.' . $total_minute;
                        $TH_glob += $total_hour . '.' . $total_minute;
                    } else {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($pointage['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
                            $time_jour = $daysAfter[$jour_pointage];
                            // matin
                            $strStartMatin = date('Y-m-d') . ' ' . $time_jour[0];
                            $strEndMatin = date('Y-m-d') . ' ' . $time_jour[1];
                            $dteStartMatin = new DateTime($strStartMatin);
                            $dteEndMatin = new DateTime($strEndMatin);
                            $dteDiffMatin = $dteStartMatin->diff($dteEndMatin);
                            $dteHourDiffMatin = $dteDiffMatin->format("%H");
                            $dteMinuteDiffMatin = $dteDiffMatin->format("%I");
                            // midi
                            $dteHourDiffMidi = 0;
                            $dteMinuteDiffMidi = 0;
                            if ($time_jour[2] !== '' && $time_jour[2] !== NULL) {
                                $strStartMidi = date('Y-m-d') . ' ' . $time_jour[2];
                                $strEndMidi = date('Y-m-d') . ' ' . $time_jour[3];
                                $dteStartMidi = new DateTime($strStartMidi);
                                $dteEndMidi = new DateTime($strEndMidi);
                                $dteDiffMidi = $dteStartMidi->diff($dteEndMidi);
                                $dteHourDiffMidi = $dteDiffMidi->format("%H");
                                $dteMinuteDiffMidi = $dteDiffMidi->format("%I");
                            }
                            // calcul total
                            $total_hour = $dteHourDiffMatin + $dteHourDiffMidi;
                            $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi;
                        }
                        $TH += - $total_hour . '.' . $total_minute;
                        $TH_glob += - $total_hour . '.' . $total_minute;
                    }
                endforeach;
            }
            $hs_total = $TH - $TH_glob;
            if ($hs_total < 0) {
                $hs_total = 0;
            }
            debug($hs_total);
            debug($TH);
            debug($TH_glob);
            debug($pointages);
            die();
            $this->response->statusCode(200);
            $this->response->body(json_encode(array(
                'text' => $employe,
                'status' => 200,
                'type' => 'success'
            )));
            $this->response->send();
            die();
        } else {
            $this->response->body(json_encode(array(
                'text' => __("Empolyé non trouvé"),
                'status' => 403,
                'type' => 'success'
            )));
        }
        die();
//        }
        die();
    }

}

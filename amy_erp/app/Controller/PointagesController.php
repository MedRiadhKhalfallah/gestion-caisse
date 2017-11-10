<?php

App::uses('AppController', 'Controller');

/**
 * Users Controller
 *
 * @property User $User
 * @property PaginatorComponent $Paginator
 */
class PointagesController extends AppController {

    public $uses = array('User', 'Ville', 'Pointage', 'PaymentsUser', 'SortiesPointage');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('save_data_pointeuse_app', 'index_automatique', 'cron', 'save_data_pointeuse', 'save_info_pointeuse', 'load_info_test', 'load_info', 'index', 'showHoursCount', 'add_pointage', 'pointage_absent', 'add_sortie', 'add_hs', 'edit_sortie', 'list_HS', 'view');
    }

    function _group_by($array, $key) {
        $return = array();
        foreach ($array as $val) {
            $return[$val[$key]][] = $val;
        }
        return $return;
    }

    public function object_to_array($data) {
        if (is_array($data) || is_object($data)) {
            $result = array();
            foreach ($data as $key => $value) {
                $result[$key] = object_to_array($value);
            }
            return $result;
        }
        return $data;
    }

    // fiche de presence (pointage manuel)
    public function index() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
            $data = $this->request->data;
            if (!empty($data['Pointage']['date'])) {
                $date = $data['Pointage']['date'];
            }
//            ////debug($data); 
//            die(); 
            $this->User->contain('Pointage.created LIKE "' . $date . ' %"', 'Pointage.SortiesPointage', 'Pointage.type_pointage = "Manuel"');
//            $this->User->contain('Pointage.created LIKE "' . $date . ' %"', 'Pointage.SortiesPointage');
            $pointages = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
            ));
            if (!empty($pointages)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $pointages,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => __('list vide'),
                    'status' => 304,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    // fiche de presence (pointage automatique)
    public function index_automatique() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
            $data = $this->request->data;
            if (!empty($data['Pointage']['date'])) {
                $date = $data['Pointage']['date'];
            }
            $this->User->contain('Pointage.created LIKE "' . $date . ' %"', 'Pointage.SortiesPointage', 'Pointage.type_pointage = "Automatique"');
            $pointages = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee'), 'User.pin <>' => 0),
                'order' => array('User.first_name ASC')
            ));
            $count_pointage = 0;
            foreach ($pointages as $i => $pointage):
                if (!empty($pointage['Pointage'])) {
                    foreach ($pointage['Pointage'] as $k => $point):
                        $point['datePointage'] = json_decode($point['date_pointage'], true);
                        $pointage['Pointage'][$k] = $point;
                        if (count(json_decode($point['date_pointage'], true)) > $count_pointage) {
                            $count_pointage = count(json_decode($point['date_pointage'], true));
                        }
                    endforeach;
                    $pointages[$i] = $pointage;
                }
            endforeach;
            if (!empty($pointages)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $pointages,
                    'length' => $count_pointage,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => __('list vide'),
                    'status' => 304,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    // start script cron : save data in pointauese
    public function save_data_pointeuse() {
        require APP . 'Vendor/autoload.php';
        require_once APP . 'Vendor' . DS . 'lib/TADFactory.php';
        require_once APP . 'Vendor' . DS . 'lib/TAD.php';
        require_once APP . 'Vendor' . DS . 'lib/TADResponse.php';
        require_once APP . 'Vendor' . DS . 'lib/Providers/TADSoap.php';
        require_once APP . 'Vendor' . DS . 'lib/Providers/TADZKLib.php';
        require_once APP . 'Vendor' . DS . 'lib/Exceptions/ConnectionError.php';
        require_once APP . 'Vendor' . DS . 'lib/Exceptions/FilterArgumentError.php';
        require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedArgument.php';
        require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedCommand.php';
        $date = date('Y-m-d');
        $day = date('d') - 1;
//        $date = date('Y-m-') . $day;
//        debug($date1);die();
//        $date = '2017-05-18';
        $tad = (new TADFactory(['ip' => '192.168.1.201', 'encoding' => 'utf-8']))->get_instance();
        $this->User->recursive = -1;
        $all_employes = $this->User->find('all', array(
            'conditions' => array('User.role_id' => $this->getRole('employee'))
        ));
        $pin_employes = array();
        foreach ($all_employes as $employe):
            if (!in_array($employe['User']['pin'], $pin_employes)):
                array_push($pin_employes, $employe['User']['pin']);
            endif;
        endforeach;
        // register user if not exist
        $all_user_info = $tad->get_all_user_info();
        $full_user = simplexml_load_string("<?xml version='1.0' encoding='UTF-8'?>" . utf8_encode($all_user_info->get_response_body())) or die("Error: Cannot create object");
        $rowUser = (array) $full_user;
        $all_user = current($rowUser);
        if (!empty($all_user)) {
            foreach ($all_user as $user):
                $user_array = (array) $user;
                if (!in_array($user_array['PIN'], $pin_employes)):
                    $new_employe = array(
                        'User' => array(
                            'id' => NULL,
                            'pin' => $user_array['PIN'],
                            'pin_pointeuse' => $user_array['PIN2'],
                            'first_name' => $user_array['Name'],
                            'role_id' => $this->getRole('employee')
                        )
                    );
                    $this->User->save($new_employe);
                endif;
            endforeach;
        }
        // register pointage for user
        $att_logs = $tad->get_att_log();
        $filtered_att_logs = $att_logs->filter_by_date(
                ['start' => $date, 'end' => $date]
        );
        $all_pointages = $filtered_att_logs->to_array();
        $pointages_in_pin = $this->_group_by($all_pointages['Row'], 'PIN');
        foreach ($pointages_in_pin as $k => $point):
            $user = $this->User->find('first', array(
                'conditions' => array('User.role_id' => $this->getRole('employee'), 'User.pin_pointeuse' => $k),
                'fields' => array('User.id', 'User.pin')
            ));
            $pointage = $this->Pointage->find('first', array(
                'conditions' => array('Pointage.created LIKE' => $date . ' %', 'Pointage.user_id' => $user['User']['id'], 'Pointage.type_pointage' => 'Automatique')
            ));
            $list_date = array();
            foreach ($point as $pt):
                array_push($list_date, array('DateTime' => $pt['DateTime']));
            endforeach;
            if (!empty($pointage)) {
                $new_pointage = array(
                    'Pointage' => array(
                        'id' => $pointage['Pointage']['id'],
                        'user_id' => $user['User']['id'],
                        'date_pointage' => json_encode($list_date),
                        'type_pointage' => 'Automatique',
                        'created' => $date . ' 08:00:00'
                    )
                );
            } else {
                $new_pointage = array(
                    'Pointage' => array(
                        'id' => NULL,
                        'user_id' => $user['User']['id'],
                        'date_pointage' => json_encode($list_date),
                        'type_pointage' => 'Automatique',
                        'created' => $date . ' 08:00:00'
                    )
                );
            }
            debug($new_pointage);
            $this->Pointage->save($new_pointage);
        endforeach;
        die();
    }

    // end script cron 
    // start scritp save data in pointauese erp
    public function save_data_pointeuse_app() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            require APP . 'Vendor/autoload.php';
            require_once APP . 'Vendor' . DS . 'lib/TADFactory.php';
            require_once APP . 'Vendor' . DS . 'lib/TAD.php';
            require_once APP . 'Vendor' . DS . 'lib/TADResponse.php';
            require_once APP . 'Vendor' . DS . 'lib/Providers/TADSoap.php';
            require_once APP . 'Vendor' . DS . 'lib/Providers/TADZKLib.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/ConnectionError.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/FilterArgumentError.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedArgument.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedCommand.php';
            $date = date('Y-m-d');
            $tad = (new TADFactory(['ip' => '192.168.1.201', 'encoding' => 'utf-8']))->get_instance();
            $this->User->recursive = -1;
            $all_employes = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee'))
            ));
            $pin_employes = array();
            foreach ($all_employes as $employe):
                if (!in_array($employe['User']['pin'], $pin_employes)):
                    array_push($pin_employes, $employe['User']['pin']);
                endif;
            endforeach;
            // register user if not exist
            $all_user_info = $tad->get_all_user_info();
            $full_user = simplexml_load_string("<?xml version='1.0' encoding='UTF-8'?>" . utf8_encode($all_user_info->get_response_body())) or die("Error: Cannot create object");
            $rowUser = (array) $full_user;
            $all_user = current($rowUser);
            if (!empty($all_user)) {
                foreach ($all_user as $user):
                    $user_array = (array) $user;
                    if (!in_array($user_array['PIN'], $pin_employes)):
                        $new_employe = array(
                            'User' => array(
                                'id' => NULL,
                                'pin' => $user_array['PIN'],
                                'pin_pointeuse' => $user_array['PIN2'],
                                'first_name' => $user_array['Name'],
                                'role_id' => $this->getRole('employee')
                            )
                        );
                        $this->User->save($new_employe);
                    endif;
                endforeach;
            }
            // register pointage for user
            $att_logs = $tad->get_att_log();
            $filtered_att_logs = $att_logs->filter_by_date(
                    ['start' => $date, 'end' => $date]
            );
            $all_pointages = $filtered_att_logs->to_array();
            $pointages_in_pin = $this->_group_by($all_pointages['Row'], 'PIN');
            foreach ($pointages_in_pin as $k => $point):
                $user = $this->User->find('first', array(
                    'conditions' => array('User.role_id' => $this->getRole('employee'), 'User.pin_pointeuse' => $k),
                    'fields' => array('User.id', 'User.pin')
                ));
                $pointage = $this->Pointage->find('first', array(
                    'conditions' => array('Pointage.created LIKE' => $date . ' %', 'Pointage.user_id' => $user['User']['id'])
                ));
                $list_date = array();
                foreach ($point as $pt):
                    array_push($list_date, array('DateTime' => $pt['DateTime']));
                endforeach;
                if (!empty($pointage)) {
                    $new_pointage = array(
                        'Pointage' => array(
                            'id' => $pointage['Pointage']['id'],
                            'user_id' => $user['User']['id'],
                            'date_pointage' => json_encode($list_date),
                            'type_pointage' => 'Automatique',
                            'created' => $date . ' 08:00:00'
                        )
                    );
                } else {
                    $new_pointage = array(
                        'Pointage' => array(
                            'id' => NULL,
                            'user_id' => $user['User']['id'],
                            'date_pointage' => json_encode($list_date),
                            'type_pointage' => 'Automatique',
                            'created' => $date . ' 08:00:00'
                        )
                    );
                }
                $this->Pointage->save($new_pointage);
            endforeach;
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'text' => __('Pointage avec succès'),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
    }

    // end script cron 
    // save info pointauese
    public function save_info_pointeuse() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            require APP . 'Vendor/autoload.php';
            require_once APP . 'Vendor' . DS . 'lib/TADFactory.php';
            require_once APP . 'Vendor' . DS . 'lib/TAD.php';
            require_once APP . 'Vendor' . DS . 'lib/TADResponse.php';
            require_once APP . 'Vendor' . DS . 'lib/Providers/TADSoap.php';
            require_once APP . 'Vendor' . DS . 'lib/Providers/TADZKLib.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/ConnectionError.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/FilterArgumentError.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedArgument.php';
            require_once APP . 'Vendor' . DS . 'lib/Exceptions/UnrecognizedCommand.php';
            $date = date('Y-m-d');
            if (!empty($data['Pointage']['date'])) {
                $date = $data['Pointage']['date'];
            }
            $tad = (new TADFactory(['ip' => '192.168.1.201', 'encoding' => 'utf-8']))->get_instance();
            // list pointage in date [$date]
            $att_logs = $tad->get_att_log();
            $filtered_att_logs = $att_logs->filter_by_date(
                    ['start' => $date, 'end' => $date]
            );
            $all_pointages = $filtered_att_logs->to_array();
            // list user pointer
            $list_user_point = array();
            $list_user_point_name = array();
            $list_user_point_id = array();
//            $ap = current($all_pointages);
            $ap = $all_pointages['Row'];
            foreach ($ap as $k => $point):
                if (!in_array($point['PIN'], $list_user_point_id)):
                    array_push($list_user_point_id, $point['PIN']);
                    $user_info = $tad->get_user_info(['pin' => $point['PIN']]);
                    $full_name_xml = simplexml_load_string("<?xml version='1.0' encoding='UTF-8'?>" . utf8_encode($user_info->get_response_body())) or die("Error: Cannot create object");
                    $full_name_array = (array) $full_name_xml;
                    $full_name_row = (array) $full_name_array['Row'];
                    $full_name = $full_name_row['Name'];
                    array_push($list_user_point, array('full_name' => $full_name));
                    array_push($list_user_point_name, $full_name);
                endif;
                $user_info = $tad->get_user_info(['pin' => $point['PIN']]);
                $full_name_xml = simplexml_load_string("<?xml version='1.0' encoding='UTF-8'?>" . utf8_encode($user_info->get_response_body())) or die("Error: Cannot create object");
                $full_name_array = (array) $full_name_xml;
                $full_name_row = (array) $full_name_array['Row'];
                $full_name = $full_name_row['Name'];
                $point['full_name'] = $full_name;
                $point['isAbsent'] = FALSE;
                $point['date'] = explode(" ", $point['DateTime'])[0];
                $ap[$k] = $point;
            endforeach;
            $pointage_not_absent = $this->_group_by($ap, 'full_name');
            $pointage_notabsent = array();
            $times = array();
            foreach ($pointage_not_absent as $k => $pointage):
                array_push($pointage_notabsent, array($k => $pointage));
                array_push($times, $pointage);
            endforeach;
            // Get attendance logs for all users;
            $all_user_info = $tad->get_all_user_info();
            $full_user = simplexml_load_string("<?xml version='1.0' encoding='UTF-8'?>" . utf8_encode($all_user_info->get_response_body())) or die("Error: Cannot create object");
            $rowUser = (array) $full_user;
            $all_user = current($rowUser);
            $user_absent_name = array();
            $user_absent = array();
            $pointage_absent = array();
            foreach ($all_user as $user):
                $user_array = (array) $user;
                if (!empty($user_array['Name'])):
                    if (!in_array($user_array['Name'], $list_user_point_name)) {
                        array_push($user_absent_name, $user_array['Name']);
                        array_push($user_absent, array('full_name' => $user_array['Name']));
                        array_push($pointage_absent, array($user_array['Name'] => array(
                                'full_name' => ucwords($user_array['Name']),
                                'pin' => NULL,
                                'isAbsent' => TRUE,
                                'datetime' => NULL,
                                'date' => NULL,
                                'verified' => NULL,
                                'status' => NULL,
                                'workCode' => NULL
                        )));
                    }
                endif;
            endforeach;
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'absent' => $pointage_absent,
                'notabsent' => $pointage_notabsent,
                'names' => $list_user_point,
                'names_absent' => $user_absent,
                'status' => 200,
                'times' => $times,
                'type' => 'success'
            ));
            die();
        }
    }

// table de paie
    public function showHoursCount() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//        $date = date();
            setlocale(LC_ALL, "fr_FR.utf8");
            $pointages = array();
            $joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            $m = date('m');
            $y = date('Y');
            if (!empty($data['Pointage']['mois'])) {
                $m = $data['Pointage']['mois'];
            }
            if (!empty($data['Pointage']['annee'])) {
                $y = $data['Pointage']['annee'];
            }
            $jour_travail = $this->getConfiguration()['Configuration']['jours_travail'];
            $daysAfter = json_decode($jour_travail, true);

            $list = array();
            $month = $m;
            $year = $y;
            for ($d = 1; $d <= 31; $d++) {
                $time = mktime(12, 0, 0, $month, $d, $year);
                if (date('m', $time) == $month)
                    $list[] = array(
                        'date' => date('Y-m-d', $time),
                        'day' => strftime("%A", $time)
                    );
            }
//        ////debug($list);
            $employees = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'fields' => array('User.id', 'User.full_name', 'User.salaire')
            ));
//            ////debug($employees);
            $this->Pointage->contain('SortiesPointage');
            foreach ($employees as $i => $employee):
//                $THFinal = 0;
                foreach ($list as $k => $day):
                    $TH = 0;
                    $emp = $this->Pointage->find('first', array(
                        'conditions' => array(
                            'Pointage.user_id' => $employee['User']['id'],
                            'Pointage.isAbsent' => FALSE,
                            'Pointage.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    // list pointage absent non autorisé
                    $empAbsentNotAuto = $this->Pointage->find('first', array(
                        'conditions' => array(
                            'Pointage.user_id' => $employee['User']['id'],
                            'Pointage.isAbsent' => TRUE,
                            'Pointage.isAutorise' => FALSE,
                            'Pointage.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    // list pointage absent autorisé
                    $empAbsentAuto = $this->Pointage->find('first', array(
                        'conditions' => array(
                            'Pointage.user_id' => $employee['User']['id'],
                            'Pointage.isAbsent' => TRUE,
                            'Pointage.isAutorise' => TRUE,
                            'Pointage.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    // list pointage absent congé
                    $empAbsentConge = $this->Pointage->find('first', array(
                        'conditions' => array(
                            'Pointage.user_id' => $employee['User']['id'],
                            'Pointage.isAbsent' => TRUE,
                            'Pointage.cause' => 'Congé',
                            'Pointage.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    // list pointage absent mission
                    $empAbsentMission = $this->Pointage->find('first', array(
                        'conditions' => array(
                            'Pointage.user_id' => $employee['User']['id'],
                            'Pointage.isAbsent' => TRUE,
                            'Pointage.cause' => 'Mission',
                            'Pointage.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    if (!empty($empAbsentAuto)) {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($empAbsentAuto['Pointage']['created'])));
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
//                        ////debug('total hour = ' . $total_hour . ', total minute = ' . $total_minute);
//                        $hoursMatinTravail = ($intervalMatin->days * 24) + $intervalMatin->h + ($intervalMatin->i / 60) + ($intervalMatin->s / 3600);
                        }
                        $TH = $total_hour . '.' . $total_minute;
                        if ($total_minute == 0) {
                            $TH = $total_hour;
                        }
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => null,
                            'SM' => null,
                            'ES' => null,
                            'SS' => null,
                            'isAbsent' => true,
                            'isAutorise' => true,
                            'cause' => 'Absent',
                            'TH' => 0
                        ));
//                    ////debug('total TH ' . $TH);
                    } else if (!empty($empAbsentConge)) {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($empAbsentConge['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
//                        ////debug($daysAfter[$jour_pointage]);
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
//                        ////debug('total hour = ' . $total_hour . ', total minute = ' . $total_minute);
//                        $hoursMatinTravail = ($intervalMatin->days * 24) + $intervalMatin->h + ($intervalMatin->i / 60) + ($intervalMatin->s / 3600);
                        }
                        $TH = $total_hour . '.' . $total_minute;
                        if ($total_minute == 0) {
                            $TH = $total_hour;
                        }
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => null,
                            'SM' => null,
                            'ES' => null,
                            'SS' => null,
                            'isAbsent' => true,
                            'isAutorise' => true,
                            'cause' => 'Congé',
                            'TH' => 0
                        ));
//                    ////debug('total TH ' . $TH);
                    } else if (!empty($empAbsentMission)) {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($empAbsentMission['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
//                        ////debug($daysAfter[$jour_pointage]);
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
//                        ////debug('total hour = ' . $total_hour . ', total minute = ' . $total_minute);
//                        $hoursMatinTravail = ($intervalMatin->days * 24) + $intervalMatin->h + ($intervalMatin->i / 60) + ($intervalMatin->s / 3600);
                        }
                        $TH = $total_hour . '.' . $total_minute;
                        if ($total_minute == 0) {
                            $TH = $total_hour;
                        }
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => null,
                            'SM' => null,
                            'ES' => null,
                            'SS' => null,
                            'isAbsent' => true,
                            'isAutorise' => true,
                            'cause' => 'Mission',
                            'TH' => 0
                        ));
//                    ////debug('total TH ' . $TH);
                    } else if (!empty($empAbsentNotAuto)) {
                        $jour_pointage = ucfirst(strftime("%A", strtotime($empAbsentNotAuto['Pointage']['created'])));
                        if (array_key_exists($jour_pointage, $daysAfter) == TRUE) {
//                        ////debug($daysAfter[$jour_pointage]);
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
//                        ////debug('total hour = ' . $total_hour . ', total minute = ' . $total_minute);
//                        $hoursMatinTravail = ($intervalMatin->days * 24) + $intervalMatin->h + ($intervalMatin->i / 60) + ($intervalMatin->s / 3600);
                        }
                        $TH = - $total_hour . '.' . $total_minute;
                        if ($total_minute == 0) {
                            $TH = - $total_hour;
                        }
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => null,
                            'SM' => null,
                            'ES' => null,
                            'SS' => null,
                            'isAbsent' => true,
                            'isAutorise' => false,
                            'cause' => null,
                            'TH' => 0
                        ));
                        ////debug('total TH ' . $TH);
                    } else if (!empty($emp)) {
//                    ////debug($emp);
                        $this->SortiesPointage->recursive = -1;
                        // total heure supp
                        $hs = $this->SortiesPointage->find('all', array(
                            'conditions' => array('SortiesPointage.pointage_id' => $emp['Pointage']['id'], 'SortiesPointage.type' => 'HS')
                        ));

                        $dteHourDiffHS = 0;
                        $dteMinuteDiffHS = 0;
                        if (!empty($hs)) {
                            foreach ($hs as $hour):
//                            ////debug($hour);
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
                            'conditions' => array('SortiesPointage.pointage_id' => $emp['Pointage']['id'], 'SortiesPointage.type' => 'Sortie')
                        ));
                        $dteHourDiffSortie = 0;
                        $dteMinuteDiffSortie = 0;
                        $dteHourDiffSortieNotAuto = 0;
                        $dteMinuteDiffSortieNotAuto = 0;
                        if (!empty($sorties)) {
                            foreach ($sorties as $sortie):
//                            ////debug($sortie);
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
                                } else {
                                    $strStart = $sortie['SortiesPointage']['date_sortie'];
                                    $strEnd = $sortie['SortiesPointage']['date_entree'];
                                    $dteStart = new DateTime($strStart);
                                    $dteEnd = new DateTime($strEnd);
                                    $dteDiff = $dteStart->diff($dteEnd);
                                    $dteHourDiff = $dteDiff->format("%H");
                                    $dteMinuteDiff = $dteDiff->format("%I");
                                    $dteHourDiffSortie += $dteHourDiff;
                                    $dteMinuteDiffSortie += $dteMinuteDiff;
                                }
                            endforeach;

                            ////debug('-------- total hour hs ' . $dteHourDiffHS);
                            ////debug('-------- total minute hs ' . $dteMinuteDiffHS);
                        }
                        $EM = ($emp['Pointage']['date_entree']) ? $emp['Pointage']['date_entree'] : 'Non Pointé';
                        $SM = ($emp['Pointage']['date_sortie']) ? $emp['Pointage']['date_sortie'] : 'Non Pointé';
                        $ES = ($emp['Pointage']['date_entree_midi']) ? $emp['Pointage']['date_entree_midi'] : 'Non Pointé';
                        $SS = ($emp['Pointage']['date_sortie_midi']) ? $emp['Pointage']['date_sortie_midi'] : 'Non Pointé';
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
                            ////debug('-------------- hour matin ---- ' . $dteHourDiffMatin);
                            ////debug('-------------- minute matin ---- ' . $dteMinuteDiffMatin);
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
//                        ////debug('-------------- hour matin ---- ' . $dteHourDiffMidi);
//                        ////debug('-------------- minute matin ---- ' . $dteMinuteDiffMidi);
                            // calcul total
                            $total_hour = $dteHourDiffMatin + $dteHourDiffMidi + $dteHourDiffHS - $dteHourDiffSortie - $dteHourDiffSortieNotAuto;
                            $total_minute = $dteMinuteDiffMatin + $dteMinuteDiffMidi + $dteMinuteDiffHS - $dteMinuteDiffSortie - $dteMinuteDiffSortieNotAuto;
                            // end calcul
                            if ($total_minute < 0) {
                                $total_minute = - $total_minute;
                                $total_hour = $total_hour - 1;
                            }
                            $TH = $total_hour . '.' . $total_minute;
                            if ($total_minute == 0) {
                                $TH = $total_hour;
                            }
                            ////debug('total TH ' . $TH);
                        }
                        if (in_array(ucfirst($day['day']), ['Samedi', 'Saturday', 'Dimanche', 'Sunday'])) {
                            $TH = "no-job";
                        }
                        if ($EM !== 'Non Pointé') {
                            $EM = substr($EM, 11, 5);
                        }
                        if ($SM !== 'Non Pointé') {
                            $SM = substr($SM, 11, 5);
                        }
                        if ($ES !== 'Non Pointé') {
                            $ES = substr($ES, 11, 5);
                        }
                        if ($SS !== 'Non Pointé') {
                            $SS = substr($SS, 11, 5);
                        }
//                        ////debug($employee); die();
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => $EM,
                            'SM' => $SM,
                            'ES' => $ES,
                            'SS' => $SS,
                            'hs' => $hs,
                            'sorties' => $sorties,
                            'isAbsent' => false,
                            'isAutorise' => false,
                            'cause' => null,
                            'TH' => $TH
                        ));
                    } else {
//                    //debug($day['day']);
                        if (in_array(ucfirst($day['day']), ['Samedi', 'Saturday', 'Dimanche', 'Sunday'])) {
                            $TH = "no-job";
                        }
                        array_push($pointages, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => 'Non Pointé',
                            'SM' => 'Non Pointé',
                            'ES' => 'Non Pointé',
                            'SS' => 'Non Pointé',
                            'isAbsent' => false,
                            'isAutorise' => false,
                            'cause' => null,
                            'TH' => $TH
                        ));
                    }
                endforeach;
//                ////debug($employee['User']['full_name']);
//                ////debug($THFinal);
            endforeach;
//            ////debug($pointages);
            http_response_code(200);
            $pointagesData = array();
            $pointages = $this->_group_by($pointages, 'full_name');
//        //debug($pointages);
//        die();
            foreach ($pointages as $k => $pointage):
                $THFinal = 0;
                $salaire = $pointage[0]['salaire'];
//                ////debug($salaire);
                $salaireH = $salaire / 168;
                foreach ($pointage as $p):
                    if ($p['TH'] !== 'no-job') {
                        $THFinal += $p['TH'];
                    }
                endforeach;
                $salaireSJT = $salaireH * $THFinal;
                array_push($pointagesData, array(
                    'full_name' => $k,
                    'THFinal' => $THFinal,
                    'salaire' => $salaire,
                    'salaireSJT' => $salaireSJT,
                    'salaireH' => $salaireH,
                    'pointage' => $pointage
                ));
            endforeach;
//            die();
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'data' => $pointagesData,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        die();
    }

    public function add_pointage() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            debug($data);
//            die();
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
            if (!empty($data['Pointage']['date'])) {
                $date = $data['Pointage']['date'];
            }
            $this->User->contain('Pointage.created LIKE "' . $date . ' %"');
            $pointages = $this->Pointage->find('first', array(
                'conditions' => array(
                    'Pointage.user_id' => $data['Pointage']['user_id'],
                    'Pointage.created LIKE "' . $date . ' %"',
                    'Pointage.type_pointage' => 'Manuel',
                )
            ));
//            ////debug($data);
//            ////debug($date);
//            ////debug($pointages);
//            die();
            $id = NULL;
            if (!empty($pointages)) {
                $data['Pointage']['id'] = $pointages['Pointage']['id'];
                $id = $pointages['Pointage']['id'];
            }
            if (!empty($data['Pointage']['date'])) {
                $data['Pointage']['created'] = $data['Pointage']['date'] . " 08:00:00";
            }

            $pres = array(
                'Pointage' => array(
                    'user_id' => $data['Pointage']['user_id'],
                    'date_entree' => $data['Pointage']['date_entree'],
                    'date_sortie' => $data['Pointage']['date_sortie'],
                    'date_entree_midi' => $data['Pointage']['date_entree_midi'],
                    'date_sortie_midi' => $data['Pointage']['date_sortie_midi'],
                    'id' => $id,
                    'created' => $date . " 08:00:00"
                )
            );
//            ////debug($pres);
//            die();
            if ($this->Pointage->save($pres)) {
                $last_id = $id;
                if ($id === NULL) {
                    $last_id = $this->Pointage->getLastInsertID();
                }
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('pointage ajouté avec succès'),
                    'last_id' => $last_id,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            } else {
                http_response_code(403);
                header("HTTP/1.1 403 OK");
                echo json_encode(array(
                    'text' => __('echec'),
                    'status' => 403,
                    'type' => 'error'
                ));
                die();
            }

            die();
        }
    }

    public function pointage_absent() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            ////debug($data);
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
            if ($data['date'] != 'null') {
                $date = $data['date'];
            }
//            ////debug($date);
//            die();
            $this->User->contain('Pointage.created LIKE "' . $date . ' %"');
            $pointages = $this->Pointage->find('first', array(
                'conditions' => array(
                    'Pointage.user_id' => $data['user_id'],
                    'Pointage.created LIKE "' . $date . ' %"',
                )
            ));
            $id = NULL;
            if (!empty($pointages)) {
                $data['id'] = $pointages['Pointage']['id'];
                $id = $pointages['Pointage']['id'];
            }
            if (!empty($data['date'])) {
                $data['created'] = $data['date'] . " 08:00:00";
            }
            $file = $this->params['form']['file'];
            if (!empty($file)) {
                $dir = IMAGES . "pointages";
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($data['descriptif'] . $data['user_id'])), "-")) . "." . $ext;
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
                    $pres = array(
                        'Pointage' => array(
                            'user_id' => $data['user_id'],
                            'isAbsent' => $data['isAbsent'],
                            'cause' => $data['cause'],
                            'isAutorise' => $data['isAutorise'],
                            'descriptif' => $data['descriptif'],
                            'id' => $id,
                            'url' => "sorties_pointage" . DS . $filename,
                            'created' => $date . " 08:00:00"
                        )
                    );
                }
            } else {
                $pres = array(
                    'Pointage' => array(
                        'user_id' => $data['user_id'],
                        'isAbsent' => $data['isAbsent'],
                        'cause' => $data['cause'],
                        'isAutorise' => $data['isAutorise'],
                        'descriptif' => $data['descriptif'],
                        'id' => $id,
                        'created' => $date . " 08:00:00"
                    )
                );
            }
//            ////debug($pres);
//            die();
            if ($this->Pointage->save($pres)) {
                $last_id = $id;
                if ($id === NULL) {
                    $last_id = $this->Pointage->getLastInsertID();
                }
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('pointage ajouté avec succès'),
                    'last_id' => $last_id,
                    'status' => 200,
                    'type' => 'success'
                ));
                die();
            } else {
                http_response_code(403);
                header("HTTP/1.1 403 OK");
                echo json_encode(array(
                    'text' => __('echec'),
                    'status' => 403,
                    'type' => 'error'
                ));
                die();
            }

            die();
        }
    }

    // add sortie pointage
    public function add_sortie() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//            ////debug($data); die();
            $file = $this->params['form']['file'];
            if (!empty($file)) {
                $dir = IMAGES . "sorties_pointage";
                if (!is_dir($dir)) {
                    mkdir($dir, 0777);
                }
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = strtolower(inflector::slug(str_replace("/", "-", trim($data['descriptif'] . $data['pointage_id'])), "-")) . "." . $ext;
                if (move_uploaded_file($file["tmp_name"], $dir . DS . $filename)) {
                    $this->request->data['url'] = "sorties_pointage" . DS . $filename;
                    $sortiesPointage['SortiesPointage'] = $this->request->data;
                    if (in_array($sortiesPointage['SortiesPointage']['date_entree'], array('null', 'NULL'))) {
                        unset($sortiesPointage['SortiesPointage']['date_entree']);
                    }
//                    ////debug($sortiesPointage);
//                    die();
                    if ($this->SortiesPointage->save($sortiesPointage)) {
//                        $last_id = $this->SortiesPointage->getLastInsertID();
                        http_response_code(200);
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'text' => __("Sortie pointage mettre à jour avec success"),
                            'status' => 200,
                            'type' => 'success'
                        ));
                    }
                }
            } else {
                $sortiesPointage['SortiesPointage'] = $this->request->data;
                if (in_array($sortiesPointage['SortiesPointage']['date_entree'], array('null', 'NULL'))) {
                    unset($sortiesPointage['SortiesPointage']['date_entree']);
                }
//                ////debug($sortiesPointage);
//                die();
                if ($this->SortiesPointage->save($sortiesPointage)) {
//                    $last_id = $this->SortiesPointage->getLastInsertID();
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'text' => __("Sortie pointage mettre à jour avec success"),
                        'status' => 200,
                        'type' => 'success'
                    ));
                }
            }
        }
        die();
    }

    public function edit_sortie() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            ////debug($data);
//            die();
            if ($this->SortiesPointage->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Sortie pointage mettre à jour avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    // add heure supplimentaire
    public function add_hs() {
        $this->autoRender = false;
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is(array('post'))) {
            $data = $this->request->data;
//            ////debug($data);
//            die();
            if ($this->SortiesPointage->save($data)) {
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'text' => __("Heure supplémentaire ajoutée avec success"),
                    'status' => 200,
                    'type' => 'success'
                ));
            }
            die();
        }
    }

    //list heure supplimentaire custom pointage
    public function list_HS() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $pointagesHS = $this->SortiesPointage->find('all', array(
                'conditions' => array(
                    'SortiesPointage.pointage_id' => $data['SortiesPointage']['pointage_id'],
                    'SortiesPointage.type' => 'HS'
                ),
                'order' => array('SortiesPointage.created ASC'),
            ));
            if (!empty($pointagesHS)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $pointagesHS,
                    'status' => 200,
                    'type' => 'success'
                ));
            } else {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => __('list vide'),
                    'status' => 304,
                    'type' => 'error'
                ));
            }
            die();
        }
    }

    // view pointage
    public function view() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
//            $this->Pointage->contain();
            $data = $this->request->data;
            $this->Pointage->id = $data['Pointage']['id'];
            $pointage = $this->Pointage->read();
            if (!empty($pointage)) {
                $this->response->statusCode(200);
                $this->response->body(json_encode(array(
                    'text' => $pointage,
                    'status' => 200,
                    'type' => 'success'
                )));
                $this->response->send();
                die();
            } else {
                $this->response->statusCode(404);
                $this->response->body(json_encode(array(
                    'text' => __("Pointage non trouvé"),
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

}

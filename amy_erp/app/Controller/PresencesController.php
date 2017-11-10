<?php

App::uses('AppController', 'Controller');

/**
 * Users Controller
 *
 * @property User $User
 * @property PaginatorComponent $Paginator
 */
class PresencesController extends AppController {

    public $uses = array('User', 'Ville', 'Presence', 'PaymentsUser');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('annee_pointage', 'showHoursCount', 'table_paie', 'count_heure', 'pointage_employe', 'index', 'presence_employee', 'presence_list', 'index_angular');
    }

    public function count_heure() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            debug($data);
            die();
            http_response_code(200);
            header("HTTP/1.1 200 OK");
            echo json_encode(array(
                'text' => __('pointage ajouté avec succès'),
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
//        die();
    }

    function _group_by($array, $key) {
        $return = array();
        foreach ($array as $val) {
            $return[$val[$key]][] = $val;
        }
        return $return;
    }

    public function annee_pointage() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $presences = $this->Presence->find('all', array(
                'fields' => array('YEAR(Presence.created)')
            ));
            $annees = array();
            foreach ($presences as $k => $presence):
                $anne = $presence[0]['YEAR(`Presence`.`created`)'];
                if (!in_array($anne, $annees)) {
                    array_push($annees, $anne);
                }
            endforeach;
            http_response_code(200);
            echo json_encode($annees);
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
            setlocale(LC_TIME, "fr_FR");
            $presences = array();
            $m = date('m');
            $y = date('Y');
            if (!empty($data['Presence']['mois'])) {
                $m = $data['Presence']['mois'];
            }
            if (!empty($data['Presence']['annee'])) {
                $y = $data['Presence']['annee'];
            }
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
            $employees = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'fields' => array('User.id', 'User.full_name', 'User.salaire')
            ));
            $this->Presence->recursive = -1;
            foreach ($employees as $i => $employee):
//                $THFinal = 0;
                foreach ($list as $k => $day):
                    $TH = 0;
                    $emp = $this->Presence->find('first', array(
                        'conditions' => array(
                            'Presence.user_id' => $employee['User']['id'],
                            'Presence.created LIKE' => $day['date'] . " %",
                        )
                    ));
                    if (!empty($emp)) {
                        $EM = ($emp['Presence']['date_entree']) ? $emp['Presence']['date_entree'] : 'Non Pointé';
                        $SM = ($emp['Presence']['date_sortie']) ? $emp['Presence']['date_sortie'] : 'Non Pointé';
                        $ES = ($emp['Presence']['date_entree_midi']) ? $emp['Presence']['date_entree_midi'] : 'Non Pointé';
                        $SS = ($emp['Presence']['date_sortie_midi']) ? $emp['Presence']['date_sortie_midi'] : 'Non Pointé';
                        if ($EM !== 'Non Pointé' && $SM !== 'Non Pointé' && $ES !== 'Non Pointé' && $SS !== 'Non Pointé') {
                            $dem = new DateTime($EM);
                            $dsm = new DateTime($SM);
                            $intervalMatin = $dem->diff($dsm);
                            $hoursMatin = ($intervalMatin->days * 24) + $intervalMatin->h + ($intervalMatin->i / 60) + ($intervalMatin->s / 3600);
                            $des = new DateTime($ES);
                            $dss = new DateTime($SS);
                            $intervalSoir = $des->diff($dss);
                            $hoursSoir = ($intervalSoir->days * 24) + $intervalSoir->h + ($intervalSoir->i / 60) + ($intervalSoir->s / 3600);
                            $TH = $hoursMatin + $hoursSoir;
//                            $THFinal += $TH;
                        }
                        if (in_array($day['day'], ['Samedi', 'Saturday', 'Dimanche', 'Sunday'])) {
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
//                        debug($employee); die();
                        array_push($presences, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => $EM,
                            'SM' => $SM,
                            'ES' => $ES,
                            'SS' => $SS,
                            'TH' => number_format($TH, 0)
                        ));
                    } else {
                        if (in_array($day['day'], ['Samedi', 'Saturday', 'Dimanche', 'Sunday'])) {
                            $TH = "no-job";
                        }
                        array_push($presences, array(
                            'id' => $employee['User']['id'],
                            'full_name' => ucwords($employee['User']['full_name']),
                            'salaire' => $employee['User']['salaire'],
                            'date' => $day['date'],
                            'EM' => 'Non Pointé',
                            'SM' => 'Non Pointé',
                            'ES' => 'Non Pointé',
                            'SS' => 'Non Pointé',
                            'TH' => $TH
                        ));
                    }
                endforeach;
//                debug($employee['User']['full_name']);
//                debug($THFinal);
            endforeach;
//            debug($presences);
//            die();
            http_response_code(200);
            $presencesData = array();
            $presences = $this->_group_by($presences, 'full_name');
            header("HTTP/1.1 200 OK");
            foreach ($presences as $k => $presence):
                $THFinal = 0;
                $salaire = $presence[0]['salaire'];
//                debug($salaire);
                $salaireH = $salaire / 168;
                foreach ($presence as $p):
                    if ($p['TH'] !== 'no-job') {
                        $THFinal += $p['TH'];
                    }
                endforeach;
                $salaireSJT = $salaireH * $THFinal;
                array_push($presencesData, array(
                    'full_name' => $k,
                    'THFinal' => $THFinal,
                    'salaire' => $salaire,
                    'salaireSJT' => $salaireSJT,
                    'salaireH' => $salaireH,
                    'presence' => $presence
                ));
            endforeach;
//            die();
            echo json_encode(array(
                'data' => $presencesData,
                'status' => 200,
                'type' => 'success'
            ));
            die();
        }
        die();
    }

    public function presence_employee() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
//          
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
//            debug($data);
//            die();
            if (!empty($data['Presence']['date'])) {
                $date = $data['Presence']['date'];
            }

//           $this->User->contain('Presence.created LIKE "' . $date . ' %"');
//            $this->User->contain('MONTH(Presence.created) = ' . date('m'));
            $this->User->contain('Presence.created LIKE "' . $date . ' %"');
            $presences = $this->Presence->find('first', array(
                'conditions' => array(
                    'Presence.user_id' => $data['Presence']['user_id'],
                    'Presence.created LIKE "' . $date . ' %"',
                )
            ));
//            debug($date);
//            debug($presences);
//            die();
            $id = NULL;
            if (!empty($presences)) {
                $data['Presence']['id'] = $presences['Presence']['id'];
                $id = $presences['Presence']['id'];
            }
            if (!empty($data['Presence']['date'])) {
                $data['Presence']['created'] = $data['Presence']['date'] . " 08:00:00";
            }

            $pres = array(
                'Presence' => array(
                    'user_id' => $data['Presence']['user_id'],
                    'date_entree' => $data['Presence']['date_entree'],
                    'date_sortie' => $data['Presence']['date_sortie'],
                    'date_entree_midi' => $data['Presence']['date_entree_midi'],
                    'date_sortie_midi' => $data['Presence']['date_sortie_midi'],
                    'id' => $id,
//                    'created' => $date . " 08:00:00"
                )
            );
//            debug($pres);
//            die();
            if ($this->Presence->save($pres)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'text' => __('pointage ajouté avec succès'),
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

    public function index() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $date1 = new DateTime();
            $date = $date1->format('Y-m-d');
            $data = $this->request->data;
            if (!empty($data['Presence']['date'])) {
                $date = $data['Presence']['date'];
            }
//            debug($date); 
//            die(); 
            $this->User->contain('Presence.created LIKE "' . $date . ' %"');
            $presences = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
            ));
            if (!empty($presences)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $presences,
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

    public function table_paie() {
        $this->autoRender = false;
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $month = date('m');
//            $this->User->contain('MONTH(Presence.created) LIKE "' . (string) intval($month).'"');
            $this->User->contain('Presence.created LIKE "%-' . $month . '-%"');
            $presences = $this->User->find('all', array(
                'conditions' => array('User.role_id' => $this->getRole('employee')),
                'order' => array('User.full_name ASC'),
            ));
            if (!empty($presences)) {
                http_response_code(200);
                header("HTTP/1.1 200 OK");
                echo json_encode(array(
                    'data' => $presences,
                    'contain' => 'MONTH(Presence.created) = ' . (string) intval($month),
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

    public function add_employe() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        if (!empty($this->request->data)) {
            $data = $this->request->data;
            if ($this->request->is('post')) {
                if ($this->Employee->save($this->request->data)) {
                    http_response_code(200);
                    header("HTTP/1.1 200 OK");
                    echo json_encode(array(
                        'text' => __('pointage ajouté avec succès'),
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
            }


            die();
        }
    }

    /**
     * edit method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
//    public function edit($id = null) {
//        if (!$this->User->exists($id)) {
//            throw new NotFoundException(__('Invalid user'));
//        }
//        if ($this->request->is(array('post', 'put'))) {
//            if ($this->User->save($this->request->data)) {
//                $this->Flash->success(__('The user has been saved.'));
//                return $this->redirect(array('action' => 'index'));
//            } else {
//                $this->Flash->error(__('The user could not be saved. Please, try again.'));
//            }
//        } else {
//            $options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
//            $this->request->data = $this->User->find('first', $options);
//        }
//    }

    /**
     * delete method
     *
     * @throws NotFoundException
     * @param string $id
     * @return void
     */
    public function delete($id = null) {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }
        $this->request->allowMethod('post', 'delete');
        if ($this->User->delete()) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }
        return $this->redirect(array('action' => 'index'));
    }

}

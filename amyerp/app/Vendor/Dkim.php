<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Dkim
 *
 * @author hedi
 */
class DkimEmail extends CakeEmail {

    protected function _getContentTransferEncoding() {
        return '7bit';
    }

}

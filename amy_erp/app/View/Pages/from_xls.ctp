<?php if(empty($dataExist) || empty($newData)): ?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="page-header">
                <h3>Extract From Excel One File</h3>
            </div>
            <div class="form-group" id="alert"></div>
            <?php
            echo $this->Form->create('Company', array(
                'inputDefaults' => array('label' => false, 'div' => false),
                'type' => 'file',
                'class' => 'form-horizontal'
            ));
            ?>
            <div class="form-group">
                <label class="control-label"><?php echo __("Fichier"); ?></label>
                <input type="file" name="data[Company][file]" class="form-control" />
            </div>
            <div class="form-group">
                <button class="btn btn-info btn-sm pull-right" id="sendScrapping"><?php echo __("Envoyer"); ?></button>
            </div>
            <?php echo $this->Form->end(); ?>
        </div>
    </div>
</div>
<?php else: ?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="page-header">
                <h3>Résultat Import</h3>
            </div>
            <p><?php echo __("Données Existantes : ").$dataExist; ?></p>
            <p><?php echo __("Nouvelles Données : ").$newData; ?></p>
        </div>
    </div>
</div>
<?php endif; ?>
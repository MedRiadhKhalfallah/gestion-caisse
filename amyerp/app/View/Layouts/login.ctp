
<!DOCTYPE html>
<head>
    <meta charset="utf-8"/>
    <title>AmyEvolution Plus | <?php echo $this->fetch('title'); ?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <?php echo $this->Html->css('bootstrap.min'); ?>
    <link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login">
    <div class="container">
        <!-- BEGIN LOGO -->
        <div class="logo">
            <a href="<?php echo $this->Html->url(array('controller' => 'pages', 'action' => 'home', 'admin' => true)); ?>" target="_blank">
                <?php echo $this->Html->image('conception-logo.png', array('alt' => 'AmyEvolution Plus')); ?>
            </a>
        </div>
        <!-- END LOGO -->
        <!-- BEGIN LOGIN -->
        <div class="content">
            <?php echo $this->Flash->render(); ?>
            <?php echo $this->fetch('content'); ?>
            <?php //echo $this->element('sql_dump'); ?>
        </div>
        <!-- END LOGIN -->
    </div>
    <!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
    <?php echo $this->Html->script('jquery.min'); ?>
    <?php echo $this->Html->script('bootstrap.min'); ?>
    <?php echo $this->fetch('script'); ?>
    <!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>


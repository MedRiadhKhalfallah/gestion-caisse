<?php echo $this->Html->docType('html5'); ?>
<!--[if IE 8 ]><html class="ie ie8" lang="fr"> <![endif]-->
<!--[if IE 9 ]><html class="ie ie9" lang="fr"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="fr"> <!--<![endif]-->
    <head>
        <?php echo $this->Html->charset('utf-8'); ?>
        <title>
            <?php echo "BackOffice | " . $this->fetch('title'); ?>
        </title>
        <meta name="robots" content="noindex,nofollow,nosnippet,noodp,noarchive,noimageindex," />
        <?php
        echo $this->Html->meta('favicon.ico', '/img/favicon.ico', array('type' => 'icon'));
        echo $this->Html->meta(array('name' => 'viewport', 'content' => 'width=device-width, initial-scale=1, maximum-scale=1'));
        echo $this->Html->css('bootstrap.min');
        // echo $this->Html->css('bootstrap-theme');
        echo $this->Html->css('bootswatch.min');
        echo $this->Html->css('font-awesome');
        echo $this->fetch('meta');
        echo $this->fetch('css');
        ?>
        <style>
            .errorInput {padding: 6px;position: relative;top: 11px;}
            .cb {clear:both;margin-top: 15px;}
            .alignLeft{float:left;margin-right:10px;}
            .alignRight{float:right;margin-left: 10px;}
            .alignCenter{display:block;margin:0 auto 0 550px;}
        </style>
    </style>
</head>
<?php if ($this->Session->read('Auth.User')): ?>
    <body>
    <?php else: ?>
    <body style="background: #CDBFDD;width: 100%;">
    <?php endif; ?>
    <div class="container-fluid">
        <?php if ($this->Session->read('Auth.User')): ?>
            <?php echo $this->element('admin_menu'); ?>
        <?php endif; ?>
        <div class="container-fluid">
            <?php echo $this->Flash->render(); ?>
            <?php echo $this->fetch('content'); ?>          
        </div>
    </div>
    <!-- JS -->
    <script>
        var root = document.location.host;
        function appUrl(root) {
            if (root === 'localhost' || root === '127.0.0.1') {
                return 'http://' + root + '/newinjaz/';
            } else {
                return 'http://' + root + '/';
            }
        }
    </script>
    <?php echo $this->Html->script('jquery.min'); ?>
    <?php echo $this->Html->script('datatables.min'); ?>
    <?php echo $this->fetch('script'); ?>
    <?php //echo $this->Html->script('bootswatch'); ?>
    <!-- End JS -->
    <?php //echo $this->element('sql_dump'); ?>
</body>
</html>

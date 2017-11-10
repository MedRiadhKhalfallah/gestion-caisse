<?php echo $this->Html->docType('html5'); ?>
<!--[if IE 8 ]><html class="ie ie8" lang="fr"> <![endif]-->
<!--[if IE 9 ]><html class="ie ie9" lang="fr"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="fr"> <!--<![endif]-->
    <head>
        <?php echo $this->Html->charset(); ?>
        <title>
            <?php echo $title_for_layout; ?>
        </title>
        <?php
        echo $this->Html->meta('favicon.ico', '/img/favicon.ico', array('type' => 'icon'));
        echo $this->Html->meta(array('name' => 'viewport', 'content' => 'width=device-width, initial-scale=1, maximum-scale=1'));
        echo $this->Html->css('bootstrap.min');
        echo $this->Html->css('bootstrap-theme.min');
        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');
        ?>
        <style>
            .alignLeft{float:left;margin-right:10px;}
            .alignRight{float:right;margin-left: 10px;}
            .alignCenter{display:block;margin:0 auto 0 550px;}
            ul.pagination .active,
            ul.pagination .disabled {
                float: left;
                padding: 3px 11px 4px 11px;
                text-decoration: none;
                border: 1px solid;
            }

            ul.pagination .active {
                background-color: #428bca;
                border-color: #428bca;
            }

            ul.pagination .disabled {
                color: #999;
                cursor: not-allowed;
                background-color: #fff;
                border-color: #ddd;
            }

            ul.pagination  > li:first-child {
                border-left-width: 1px;
                -webkit-border-bottom-left-radius: 4px;
                border-bottom-left-radius: 4px;
                -webkit-border-top-left-radius: 4px;
                border-top-left-radius: 4px;
                -moz-border-radius-bottomleft: 4px;
                -moz-border-radius-topleft: 4px;
            }

            ul.pagination > li:last-child  {
                -webkit-border-top-right-radius: 4px;
                border-top-right-radius: 4px;
                -webkit-border-bottom-right-radius: 4px;
                border-bottom-right-radius: 4px;
                -moz-border-radius-topright: 4px;
                -moz-border-radius-bottomright: 4px;
            }
        </style>

    </style>
</head>
<?php if ($this->Session->read('Auth.User')): ?>
    <body>
    <?php else: ?>
    <body style="background: #CDBFDD;width: 100%;">
    <?php endif; ?>
    <div class="container-fluid">
        <?php echo $this->fetch('content'); ?>
    </div>
    <!-- JS -->
    <?php echo $this->Html->script('jquery.min'); ?>
    <?php echo $this->Html->script('bootstrap.min'); ?>
    <?php echo $this->fetch('script'); ?>
    <!-- End JS -->

    <?php //echo $this->element('sql_dump'); ?>
</body>
</html>

<!DOCTYPE html>
<html lang="fr">
<head>
<title>AMY Evolution Plus | <?php echo $this->fetch('title'); ?></title>
<meta charset="UTF-8" />
<meta name="Description" content="AMY Evolution+ est une société spécialisée dans le domaine de l’installation des solutions de voix sur IP, alarme intrusion, vidéosurveillance, contrôle d'accès et développement web">
<meta name="google-site-verification" content="2ZUDhOYjIei85xcH0-0RpP7CtrtizEslkZ6K5RQ2sck" />
<meta name="Category" content="Développement web">
<meta name="Robots" content="all">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
<?php // echo $this->Html->meta('icon', 'favicon.ico', array('type' => 'icon')); ?>
<?php echo $this->fetch('meta'); ?>
<?php echo $this->Html->css('bootstrap.min'); ?>
<?php echo $this->Html->css('bootstrap-theme.min'); ?>
<?php echo $this->Html->css('font-awesome.min'); ?>
<?php echo $this->Html->css('reset.min'); ?>
<?php echo $this->Html->css('style.min'); ?>
<?php echo $this->Html->css('condiment.min'); ?>
<?php echo $this->Html->css('oxygen.min'); ?>
<?php echo $this->Html->css('public/main'); ?>
<?php // echo $this->Html->css('main'); ?>
<?php echo $this->fetch('css'); ?>
<?php if ($this->params['action'] === 'home' && $this->params['controller'] === 'pages'): ?>
<?php // echo $this->Html->css('slicebox.min'); ?>
<?php echo $this->Html->css('owl.carousel.min'); ?>
<?php echo $this->Html->css('owl.theme.default.min'); ?>
<?php echo $this->Html->css('custom.min'); ?>
<?php endif; ?>
</head>
<div class="container marketing">
<?php echo $this->element('header', array(), array('cache' => true)); ?>
</div>
<?php if ($this->params['action'] === 'home' && $this->params['controller'] === 'pages'): ?>
<div class="container-fluid">
<?php echo $this->element('slider', array(), array('cache' => true)); ?>
</div>
<?php endif; ?>
<div class="container marketing">
<?php echo $this->Flash->render(); ?>
<?php echo $this->fetch('content'); ?>
</div>
<div class="clear"></div>
<?php echo $this->element('footer', array(), array('cache' => true)); ?>
<?php // echo $this->Html->script('jquery.min'); ?>
<?php // echo $this->Html->script('bootstrap.min'); ?>
<?php // echo $this->Html->script('app.min'); ?>
<?php echo $this->Html->script('main'); ?>
<?php echo $this->Js->writeBuffer(); ?>
<?php if ($this->params['action'] === 'home' && $this->params['controller'] === 'pages'): ?>
<?php //echo $this->Html->script('owl.carousel.min'); ?>
<?php //echo $this->Html->script('home.min'); ?>
<?php echo $this->Html->script('slider.min'); ?>
<?php endif; ?>
<?php echo $this->fetch('script'); ?>
</body>
<?php //echo $this->element('sql_dump'); ?>
</html>

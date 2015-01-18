<?php require_once(dirname(dirname(dirname(__FILE__))) . '/locale/locale.php') ?>
<md-dialog aria-label="Global Settings">
    <md-content>
        <md-subheader><?= _('Global Settings') ?></md-subheader>
        <h3><?= _('Volume') ?></h3>
        <md-slider md-discrete ng-model=volume step=10 min=0 max=100 ng-change=setVolume() aria-label=volume></md-slider>
    </md-content>
</md-dialog>

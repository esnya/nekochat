<md-dialog aria-label=Setting style="width: 500px;">
    <md-content>
        <md-input-group class="md-default-theme">
            <label><?= _('Name') ?></label>
            <md-input ng-model="form.name" layout-fill></md-input>
        </md-input-group>
        <md-input-group class="md-default-theme">
            <label><?= _('URL') ?></label>
            <md-input ng-model="form.character_url" ng-change=setCharacterName(form) layout-fill></md-input>
        </md-input-group>
    </md-content>
    <div class="md-actions" layout=row>
        <span flex></span>
        <md-button ng-click=close()><?= _('Close'); ?></md-button>
    </div>
</md-dialog>

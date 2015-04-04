<?php require_once(dirname(dirname(dirname(__FILE__))) . '/locale/locale.php') ?>
<div ng-if="maxId < 0" layout-fill layout-align="center center" layout=column>
    <md-progress-circular md-mode="indeterminate"></md-progress-circular>
</div>
<div style="position: relative;" ng-controller=ChatWriting>
    <md-content class="md-padding" style="position: absolute; z-index: 1000; background: transparent; opacity: 0.5; padding-right: 16px;" layout-fill layout=row layout-align="end center">
        <div class=md-whiteframe-z2 style="background: white;" ng-repeat="writing in writings" layout=row>
            <div>
                <ng-md-icon icon="mode_edit" style="fill: #aaaaaa;"></ng-md-icon>
            </div>
            <div class=name>{{writing.name}}</div>
            <div class=user_id>{{writing.user_id}}</div>
        </div>
    </md-content>
</div>
<md-content flex md-scroll-y style="flex: 1 1 0;" ng-controller=ChatMessage>
    <div class="md-padding" style="max-width: 862px; margin: auto;">
        <md-list id=messages>
            <md-item class=message ng-class="{header: message.isHeader}" ng-repeat="message in messages | toArray | orderBy:'created'" on-finish-render="messageScroll()">
                <md-item-content style="border-color: {{message.color}}">
                    <div class="md-tile-left">
                        <div class="face-box" ng-if="message.isHeader">
                            <div class="line">&nbsp;&nbsp;</div>
                            <div class="face" style="background-image: url({{message.icon}})" ng-if="message.icon"></div>
                        </div>
                    </div>
                    <div class="md-tile-content">
                        <div class="header" ng-if=message.isHeader layout=row>
                            <div class="name" style="color: {{message.color}}">{{message.name}}</div>
                            <div class="user_id">{{message.user_id}}</div>
                            <md-button ng-if=message.character_url ng-href={{message.url}} target=_blank style="margin-top: -8px; margin-bottom: -8px;" aria-label="{{message.name}}">
                                <ng-md-icon icon=assignment_ind></mg-md-icon>
                            </md-button>
                        </div>
                        <div ng-bind-html="line | linky:'_blank'" ng-repeat="line in message.message.split('\n') track by $index">
                        </div>
                    </div>
                    <div class="md-tile-right" ng-if=message.isHeader>
                        {{message.created | date:'hh:mm'}}
                    </div>
                </md-item-content>
            </md-item>
        </md-list>
    </div>
</md-content>
<md-lsit class="md-whiteframe-z2" ng-controller=ChatForm>
    <md-item ng-repeat="form in forms | reverse" ng-if="!form.removed">
        <md-item-content>
            <div class="md-tile-content" layout=row layout-align="center end">
                <md-button ng-if="$last" ng-click="add()" aria-label="Add">
                    <ng-md-icon icon=add></ng-md-icon>
                </md-button>
                <md-button ng-if="!$last" ng-click="remove(form)" aria-label="Remove">
                    <ng-md-icon icon=remove></ng-md-icon>
                </md-button>
                <md-button ng-click="config(form)" aria-label="Config">
                    <ng-md-icon icon=settings></ng-md-icon>
                </md-button>
                <form ng-submit="submit(form)" layout=row layout-fill layout-align="center end" aria-label="Submit">
                    <input type=hidden class="name" ng-bind=form.name>
                    <input type=hidden class="character_url" ng-bind=form.character_url>
                    <md-input-container style="padding-bottom: 2px;" flex>
                        <label>{{form.name}}</label>
                        <textarea rows="1" style="flex: 1 1 auto;" ng-model=form.message ng-change="change(form)" ng-focus="focus(form)" ng-blur="blur(form)" ng-keydown="keydown($event, form)"></textarea>
                    </md-input-container>
                    <md-button class="md-raised md-primary" type=submit aria-label="Submit">
                        <ng-md-icon icon=send></ng-md-icon>
                    </md-button>
                </form>
            </div>
        </md-item-content>
    </md-item>
</md-list>

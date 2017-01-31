import * as angular from 'angular';
import debounce = require('lodash/debounce');
import { DrawStateService } from './reducers';
import { DrawToolsService } from './tools';
import { DrawController } from './editor';

export const DrawModule = angular.module('Draw', []);

DrawModule.factory('DrawToolsService', () => {
    let toolsService = new DrawToolsService();
    return toolsService;
});

DrawModule.factory('DrawStateService', [
    '$q',
    'DrawToolsService',
    ($q, toolsService: DrawToolsService) => {
        let service = new DrawStateService($q, toolsService);
        return service;
    }]
);

DrawModule.directive('draw', [
    'DrawStateService',
    'DrawToolsService',
    (state: DrawStateService, tools: DrawToolsService) => {
        return <angular.IDirective>{
            restrict: 'EA',
            bindToController: true,
            scope: {
                'save': '&onSave',
                'events': '&onEvents'
            },
            template: `
                <canvas class="draw__canvas"></canvas>
                <section class="draw__toolbox">
                    <artice class="draw__tool" 
                        ng-repeat="tool in Draw.tools track by $index"
                        ng-class="{'draw__tool--selected':tool.id===Draw.state.tool.id}"
                        ng-click="Draw.draw(tool)" 
                        id="{{tool.id}}" title="{{tool.name}}">

                        <i class="ms-Icon ms-Icon--{{tool.icon}}"></i>
                    </artice>
                </section>
                <section class="draw__properties" ng-if="!Draw.state.current">
                    <p>Draw or choose a shape to display its properties</p>
                </section>
                <section class="draw__properties" ng-if="Draw.state.current">
                    <section class="scroll-container">                               
                        <div class="ms-TextField" ng-repeat="(key, value) in (Draw.properties) track by $index">
                            <label class="ms-Label">{{key}}</label>
                            <input class="ms-TextField-field" type="text" ng-model="Draw.properties[key]" placeholder="{{key}}" >
                        </div>
                    </section>
                    <button class="ms-Button ms-Button--primary" ng-click="Draw.update()">
                        <span class="ms-Button-label">Save</span>
                    </button>  
                    <button class="ms-Button" ng-click="Draw.remove()">
                        <span class="ms-Button-label">Delete</span>
                    </button>  
                </section>
            `,
            controller: ['$scope', 'DrawToolsService', 'DrawStateService', DrawController],
            controllerAs: 'Draw',
            link: (scope: any, element, attrs) => {
                const resize = ((scope: any, element: JQuery) => {
                    let width = element.parent().width();
                    let height = element.parent().height();
                    (scope.Draw as DrawController).rescale(element, width, height);
                });

                element.addClass('draw__container');
                let canvas$ = element.children('.draw__canvas')[0] as HTMLCanvasElement;
                state.init(canvas$);
                resize(scope, element);
                (scope.Draw as DrawController).subscribeToEvents();
                let debounceResize = debounce(() => resize(scope, element), 250);
                window.addEventListener('resize', debounceResize);

                scope.$on('$destroy', () => window.removeEventListener('resize'));
            }
        };
    }
]);

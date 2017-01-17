import * as angular from 'angular';
import { DrawStateService } from './reducers';
import { DrawToolsService } from './tools';
import { DrawController } from './editor';

export const DrawModule = angular.module('Draw', []);

DrawModule.factory('DrawToolsService', () => {
    let toolsService = new DrawToolsService();
    return toolsService;
});

DrawModule.factory('DrawStateService', [
    'DrawToolsService',
    (toolsService: DrawToolsService) => {
        let service = new DrawStateService(toolsService);
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
                'width': '@width',
                'height': '@height',
                'save': '&onSave',
                'events': '&onEvents'
            },
            template: `
                <canvas class="draw__canvas"></canvas>
                <section class="draw__toolbox">
                    <artice class="draw__tool" 
                        ng-repeat="tool in Draw.tools track by $index"
                        ng-class="{'draw__tool--selected':tool.id===Draw.state.tool.id}"
                        ng-click="Draw.drawTool(tool)" 
                        id="{{tool.id}}" title="{{tool.name}}">

                        <i class="ms-Icon ms-Icon--{{tool.icon}}"></i>
                    </artice>
                </section>
                <section class="draw__properties" ng-if="Draw.state.currentObject">
                    <section class="scroll-container">                               
                        <div class="ms-TextField" ng-repeat="(key, value) in (Draw.state.currentObject) track by $index">
                            <label class="ms-Label">{{key}}</label>
                            <input class="ms-TextField-field" type="text" value="{{value}}" placeholder="{{key}}" >
                        </div>
                    </section>
                    <button class="ms-Button ms-Button--primary" ng-click="Draw.update()">
                        <span class="ms-Button-label">Save</span>
                    </button>  
                    <button class="ms-Button" ng-click="Draw.remove()">
                        <span class="ms-Button-label">Delete</span>
                    </button>  
                    <button class="ms-Button" ng-click="Draw.clear()">
                        <span class="ms-Button-label">Cancel</span>
                    </button>                      
                </section>
            `,
            controller: ['$scope', 'DrawToolsService', 'DrawStateService', DrawController],
            controllerAs: 'Draw',
            link: (scope: any, element, attrs) => {
                element.addClass('draw__container');
                let canvas$ = element.children('.draw__canvas')[0] as HTMLCanvasElement;
                state.init(canvas$);
                scope.Draw.rescale(element, scope.width, scope.height);
                scope.Draw.listenForChanges();
            }
        };
    }
]);

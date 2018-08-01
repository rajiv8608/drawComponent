declare var angular: any;
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
    'DrawToolsService', '$timeout',
    ($q, toolsService: DrawToolsService, $timeout) => {
        let service = new DrawStateService($q, toolsService, $timeout);
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
                <!-- section class="draw__toolbox">
                    <artice class="draw__tool"
                        ng-repeat="tool in Draw.tools track by $index"
                        ng-class="{'draw__tool--selected':tool.id===Draw.state.tool.id}"
                        ng-click="Draw.draw(tool,'false')"
                        id="{{tool.id}}" title="{{tool.name}}">

                        <i class="ms-Icon ms-Icon--{{tool.icon}}"></i>
                    </artice>
                </section-->
                <!-- section class="draw__properties" ng-if="!Draw.state.current">
                    <h3 class="ms-font-l">Project Actions</h3>
                    <section class="actions">
                        <button class="draw__tool" ng-click="Draw.state.save()">
                            <i class="ms-Icon ms-Icon--Save"></i>
                        </button>
                        <button class="draw__tool" ng-click="Draw.state.open()">
                            <i class="ms-Icon ms-Icon--OpenFile"></i>
                        </button>
                        <button class="draw__tool" ng-click="Draw.state.clear()">
                            <i class="ms-Icon ms-Icon--Delete"></i>
                        </button>
                    </section>
                    <p>Draw or choose a shape to display its properties</p>
                </section-->
                <section class="draw__properties">
                    <h3 class="ms-font-l">Tool Actions</h3>
                   <!-- section class="actions">
                        <button class="draw__tool" ng-click="Draw.state.update(Draw.properties)">
                            <i class="ms-Icon ms-Icon--Save"></i>
                        </button>
                        <button class="draw__tool" ng-click="Draw.state.remove()">
                            <i class="ms-Icon ms-Icon--Delete"></i>
                        </button>
                    </section-->
                   
                    <section class="scroll-container">
                        <uib-tabset active="active" class="gallery" ng-if="Draw.state.current && Draw.properties">
                            <uib-tab index="0" heading="General">
                                <div class="ms-TextField" ng-repeat="(key, value) in (Draw.properties) track by $index" 
                            ng-if="Draw.showList(key)" ng-hide="Draw.hideList(key)">
                                    <label ng-if="Draw.showList(key) && key !== 'text'" class="ms-Label">{{key}}</label>
                                    <input ng-if="Draw.showList(key) && key !== 'text'" class="ms-TextField-field" type="text" 
                                    ng-model="Draw.properties[key]" minicolors="{control: 'brightness',theme: 'bootstrap',position: 'bottom right'}" placeholder="{{key}}" ng-blur="Draw.state.update(Draw.properties)" ng-enter="Draw.state.update(Draw.properties)">
                                    <label ng-if="key === 'text' && Draw.properties['fontFamily'] === 'Segoe UI'">{{key}}</label>
                                    <input ng-if="key === 'text' && Draw.properties['fontFamily'] === 'Segoe UI'" class="ms-TextField-field" type="text" 
                                    ng-model="Draw.properties[key]" placeholder="{{key}}" ng-blur="Draw.state.update(Draw.properties)">
                            </div>
                            </uib-tab>
                            <uib-tab index="1" heading="Advanced">
                                 <div class="ms-TextField" ng-repeat="(key, value) in (Draw.properties) track by $index" 
                            ng-if="!Draw.showList(key)" ng-hide="Draw.hideList(key)">
                                <label class="ms-Label">{{key}}</label>
                                <input class="ms-TextField-field" type="text" ng-model="Draw.properties[key]" placeholder="{{key}}" ng-blur="Draw.state.update(Draw.properties)" ng-enter="Draw.state.update(Draw.properties)">
                            </div>
                            </uib-tab>
                           
                        </uib-tabset>   
                        <p ng-if="!Draw.state.current">Please select a DRAW control to see Tool options.</p>                      
                    </section>
                    
                </section>
            `,
            controller: ['$scope', 'DrawToolsService', 'DrawStateService', '$attrs', DrawController],
            controllerAs: 'Draw',
            link: (scope: any, element, attrs) => {
                const resize = ((scope: any, element: JQuery) => {
                    let width = element.parent().width();
                    let height = element.parent().height();         
                    (scope.Draw as DrawController).rescale(element, width, height);
                });
                state.uniqueId = attrs.id.replace(" ", ""); //set unique id initially
                element.addClass('draw__container');
                let canvas$ = element.children('.draw__canvas')[0] as HTMLCanvasElement;              
                state.init(canvas$);
                resize(scope, element);
                (scope.Draw as DrawController).subscribeToEvents();
                let debounceResize = debounce(() => resize(scope, element), 250);                       
                const onCtrlPaste = ((event) => {                  
                  /*   if($(event.target).closest("input, textarea").length) {
                        return;
                    } */
                    (scope.Draw as DrawController).onPaste();
                });                
                let onPaste = debounce((event) => onCtrlPaste(event), 100);                


                 /* const onCtrlCopy = ((event) => {
                    (scope.Draw as DrawController).onCopy();                      
                });  

                let onCopy = debounce((event: any) => onCtrlCopy(event), 100);  */
                
                const onKeyHandler = ((event: any) => {                   
                   /*  if($(event.target).closest("input, textarea").length) {
                        return;
                    } */
                    if(event.keyCode === 46) {
                        (scope.Draw as DrawController).onRemove();;
                    }   
                     if(event.ctrlKey && String.fromCharCode(event.which).toLowerCase() == 'c'){                       
                        (scope.Draw as DrawController).onCopy();
                    } 
                });
                let onKeyCallback = debounce((event) => onKeyHandler(event), 100);     
                

               //Handle key events      
                $('body').on("keydown", onKeyCallback);
                //document.addEventListener("paste", onPaste);
                $('body').on("paste", onPaste); 

                // $('body').on("copy", onCopy); 
                //document.addEventListener("copy", onCopy);  
                window.addEventListener('resize', debounceResize);  

                //remove event handlers on destroy
                scope.$on('$destroy', () => {
                    window.removeEventListener('resize', debounceResize);
                    $('body').off("paste", onPaste);
                    $('body').off("keydown", onKeyCallback);
                     //$('body').off("copy",onCopy); 
                    //document.removeEventListener('onPaste', onPaste);
                   // window.removeEventListener('onCopy', onCopy);
                });

            }
        };
    }
]);


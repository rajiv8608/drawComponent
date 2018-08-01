import * as angular from 'angular';

class AppController implements angular.IComponentController {
}


   
    angular
   .module('app', ['Draw','minicolors'])
    .controller('AppController', ['$scope','DrawStateService','DrawToolsService',function ($scope, DrawStateService,DrawToolsService) {
        var vm = this;     
        vm.DrawStateService = DrawStateService;
        vm.DrawToolsService = DrawToolsService;               
        // vm.DrawToolsService.defaultTools = _.without(vm.DrawToolsService.defaultTools, _.findWhere(vm.DrawToolsService.defaultTools, {
        //     id: "tool__svg"
        // }));
        vm.update = function(){
            vm.properties = vm.DrawStateService.getPropertiesCtrl();
            if(vm.properties != null)
            vm.DrawStateService.update(vm.properties);
            vm.DrawStateService.current = false;
        }
        vm.draw = function(tool) {
            if(tool.id === 'tool__svg') {
                vm.DrawStateService.draw(tool, { id: "tool__wheel", height: 250, width: 250 });
            }
            else
                vm.DrawStateService.draw(tool);
        }
        vm.saveData = function(){
         vm.DrawStateService.save();
        }
        vm.DrawStateService.clear();
}])
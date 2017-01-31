import * as angular from 'angular';

class AppController implements angular.IComponentController {
}

angular
    .module('app', ['Draw'])
    .controller('AppController', AppController);

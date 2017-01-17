import * as angular from 'angular';

class AppController implements angular.IComponentController {
    title: string;
    constructor() {
        this.title = 'Draw Demo';
    }
}

angular
    .module('app', ['Draw'])
    .controller('AppController', AppController);

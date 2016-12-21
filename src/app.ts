import * as angular from 'angular';
import * as $ from 'jquery';
import { Draw } from './draw';

class AppController implements angular.IComponentController {
    title: string;

    constructor() {
        this.title = 'Draw Demo';
        let canvas = new Draw($('#canvas'), {
            width: 600,
            height: 500
        });
    }
}

angular
    .module('draw', [])
    .controller('AppController', AppController);

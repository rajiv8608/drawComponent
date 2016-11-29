import * as angular from 'angular';
import * as $ from 'jquery';
import { Draw } from './draw';

class AppController implements ng.IComponentController {
    title: string;

    constructor() {
        this.title = 'Draw Demo';
        let canvas = new Draw($('#canvas'), {
            width: 600,
            height: 350
        });
    }
}

angular
    .module('draw', [])
    .controller('AppController', AppController);

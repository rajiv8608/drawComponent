import * as angular from 'angular';
import { Draw } from './draw';

class AppController implements ng.IComponentController {
    title: string;

    constructor() {
        this.title = 'draw Demo';
        let canvas = new Draw($('canvas'), {
            width: 300,
            height: 400
        });
    }
}

angular
    .module('draw', [])
    .controller('AppController', AppController);

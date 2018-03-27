import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { CanvasWhiteboardComponent, CanvasWhiteboardOptions } from 'ng2-canvas-whiteboard/dist/canvas-whiteboard.component';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ophthalmology-fundus-view-svg',
  templateUrl: './ophthalmology-fundus-view-svg.component.html',
  styleUrls: ['./ophthalmology-fundus-view-svg.component.scss'],
  // encapsulation: ViewEncapsulation.Native,
  viewProviders: [CanvasWhiteboardComponent],
})
export class OphthalmologyFundusViewSVGComponent implements OnInit {
  color: string = '#000'
  imageToDrawLink: string;
  whiteBoardRef: CanvasWhiteboardComponent;
  canvasOptions: CanvasWhiteboardOptions = {
    drawButtonEnabled: false,
    clearButtonEnabled: false,
    undoButtonEnabled: false,
    redoButtonEnabled: false,
    colorPickerEnabled: false,
    saveDataButtonEnabled: false,
    shouldDownloadDrawing: true,
    aspectRatio: 1
  };

  ngOnInit() {
    setTimeout(function() {
      $('.options-left').addClass('spread');
      $('.options-right').addClass('spread');
    }, 1000);
  }

  uploadFile(file, canvasWhiteboard) {
    this.imageToDrawLink = URL.createObjectURL(file);
    this.whiteBoardRef = canvasWhiteboard;
    this.whiteBoardRef.toggleShouldDraw();
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ophthalmology-fundus-view-svg',
  templateUrl: './ophthalmology-fundus-view-svg.component.html',
  styleUrls: ['./ophthalmology-fundus-view-svg.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class OphthalmologyFundusViewSVGComponent implements OnInit {
  ngOnInit() {
    setTimeout(function() {
      $('.options-left').addClass('spread');
      $('.options-right').addClass('spread');
    }, 1000);
  }
}

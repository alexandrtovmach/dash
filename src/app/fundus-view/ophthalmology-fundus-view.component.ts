import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ophthalmology-fundus-view',
  templateUrl: './ophthalmology-fundus-view.component.html',
  styleUrls: ['./ophthalmology-fundus-view.component.scss'],
})
export class OphthalmologyFundusViewComponent implements OnInit {

  ngOnInit() {
    setTimeout(function() {
      $('.options-left').addClass('spread');
      $('.options-right').addClass('spread');
    }, 1000);
  }
}

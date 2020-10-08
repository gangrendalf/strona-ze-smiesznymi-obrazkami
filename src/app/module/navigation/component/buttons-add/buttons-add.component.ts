import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'buttons-add',
  templateUrl: './buttons-add.component.html',
  styleUrls: ['./buttons-add.component.sass']
})
export class ButtonsAddComponent {
  private _addIcon: IconDefinition = faPlus;
}

import { Component } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'add-mem',
  templateUrl: './add-mem.component.html',
  styleUrls: ['./add-mem.component.sass']
})
export class ButtonsAddComponent {
  private _addIcon: IconDefinition = faPlus;
}

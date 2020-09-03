import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { disableScroll, enableScroll } from 'src/app/module/shared/functions'

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('menuContainerToggler', {static: true}) menuContainerToggler: ElementRef<HTMLButtonElement>;
  @ViewChild('menuContainer', {static: true}) menuContainer: ElementRef<HTMLDivElement>;

  private _barsIcon: IconDefinition = faBars;

  constructor() { }

  ngAfterViewInit(){
    this.menuContainerToggler.nativeElement.addEventListener('click', () => {
      this.menuContainer.nativeElement.classList.toggle('menu-container--shown');
      
      this.menuContainer.nativeElement.classList.contains('menu-container--shown') ? disableScroll() : enableScroll();
    });
  }
}

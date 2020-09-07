import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { disableScroll, enableScroll } from 'src/app/module/shared/functions'

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('menuContainerToggler', { static: true }) menuContainerTogglerRef: ElementRef<HTMLButtonElement>;
  @ViewChild('menuContainer', { static: true }) menuContainerRef: ElementRef;
  @ViewChild('navigationBar', { static: true }) navigationBarRef: ElementRef<HTMLDivElement>;
  @ViewChild('bottomOnMobile', { static: true }) bottomBarOnMobileRef: ElementRef<HTMLDivElement>;
  @ViewChild('bottomOnDesktop', { static: true }) bottomBarOnDesktopRef: ElementRef<HTMLDivElement>;


  private _barsIcon: IconDefinition = faBars;

  constructor() { 
    document.addEventListener('scroll', () => {
      if(window.scrollY > 10){
        this.bottomBarOnMobileRef.nativeElement.classList.add('bottom-bar--hidden');
        this.bottomBarOnDesktopRef.nativeElement.classList.add('bottom-bar--hidden');
        this.navigationBarRef.nativeElement.classList.add('bottom-bar--hidden');
      }
      else{
        this.bottomBarOnMobileRef.nativeElement.classList.remove('bottom-bar--hidden');
        this.bottomBarOnDesktopRef.nativeElement.classList.remove('bottom-bar--hidden');
        this.navigationBarRef.nativeElement.classList.remove('bottom-bar--hidden');
      }

    })
  }

  ngAfterViewInit(){
    this.menuContainerTogglerRef.nativeElement.addEventListener('click', () => {
      this.menuContainerRef.nativeElement.classList.toggle('menu-container--shown');
      
      this.menuContainerRef.nativeElement.classList.contains('menu-container--shown') ? disableScroll() : enableScroll();
    });
  }
}

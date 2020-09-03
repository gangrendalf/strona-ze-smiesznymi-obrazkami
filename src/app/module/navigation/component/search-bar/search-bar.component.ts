import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { faSearch, IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { disableScroll, enableScroll } from 'src/app/module/shared/functions'


@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements AfterViewInit {
  private _searchIcon: IconDefinition = faSearch;

  @ViewChild('searchContainerToggler', {static: true}) searchContainerToggler: ElementRef<HTMLButtonElement>;
  @ViewChild('searchContainer', {static: true}) searchContainer: ElementRef<HTMLDivElement>;


  constructor() { }

  ngAfterViewInit(){
    this.searchContainerToggler.nativeElement.addEventListener('click', () => {
      this.searchContainer.nativeElement.classList.toggle('search-container--shown');
      
      this.searchContainer.nativeElement.classList.contains('search-container--shown') ? disableScroll() : enableScroll();
      this.searchContainer.nativeElement.classList.contains('search-container--shown') ? this._searchIcon = faTimes : this._searchIcon = faSearch;
    });
  }
}

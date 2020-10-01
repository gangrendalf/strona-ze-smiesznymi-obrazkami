import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { disableScroll, enableScroll } from 'src/app/module/shared/functions';

@Component({
  selector: 'buttons-category',
  templateUrl: './buttons-category.component.html',
  styleUrls: ['./buttons-category.component.sass']
})
export class CategoryComponent implements AfterViewInit {
  @ViewChild('categoryContainerToggler', {static: true}) categoryContainerToggler: ElementRef<HTMLButtonElement>;
  @ViewChild('categoryContainer', {static: true}) categoryContainer: ElementRef<HTMLDivElement>;
  categoryName = 'humor';
  
  constructor() { }

  ngAfterViewInit(){
    this.categoryContainerToggler.nativeElement.addEventListener('click', () => {
      this.categoryContainer.nativeElement.classList.toggle('category-container--shown');
      
      this.categoryContainer.nativeElement.classList.contains('category-container--shown') ? disableScroll() : enableScroll();
    });
  }

}

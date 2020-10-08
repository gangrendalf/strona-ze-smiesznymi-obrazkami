import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/module/shared/model/category.interface';
import { disableScroll, enableScroll } from 'src/app/module/shared/functions';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

@Component({
  selector: 'buttons-category',
  templateUrl: './buttons-category.component.html',
  styleUrls: ['./buttons-category.component.sass']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryContainerToggler', {static: true}) categoryContainerToggler: ElementRef<HTMLButtonElement>;
  @ViewChild('categoryContainer', {static: true}) categoryContainer: ElementRef<HTMLDivElement>;

  private readonly _BREAKPOINT_MD = 768;
  private _allCategories: Category[] = [];
  private _someCategories: Category[] = [];
  private _visibleCategories: Category[] = [];
  
  constructor(private dbs: DatabaseService) { }
  
  async ngOnInit(){
    await this.getAllCategories();
    this.selectFourRandomCategoriesForDesktopView();
    this.selectVisibleCategories();
  }

  ngAfterViewInit(){
    this.addListeners();
  }

  private async getAllCategories(){
    this._allCategories = await this.dbs.category.getAll().pipe(take(1)).toPromise(); 
  }

  private selectFourRandomCategoriesForDesktopView(){
    do{
      const randomIndex = Math.round(Math.random() * (this._allCategories.length - 1));
      const randomCategory = this._allCategories[randomIndex];
      const categoryDuplicated = this._someCategories.find((category) => category == randomCategory); 
      
      if(!categoryDuplicated)
        this._someCategories.push(randomCategory);

    } while (this._someCategories.length < 4);

    this._visibleCategories = this._someCategories;
  }

  private selectVisibleCategories(){
    if(window.innerWidth > this._BREAKPOINT_MD)
      this._visibleCategories = this._someCategories;
    else
      this._visibleCategories = this._allCategories;
  }

  private addListeners(){
    this.toggleCategoryContainer()
    this.disableContentScrollWhenCategoryContainerShown();
    this.hideCategoryContainerOnResize()
    this.selectVisibleCategoriesOnResize();
  }

  private toggleCategoryContainer(){
    this.categoryContainerToggler.nativeElement.addEventListener('click', () => {
      this.categoryContainer.nativeElement.classList.toggle('category-container--shown');
    });
  }

  private disableContentScrollWhenCategoryContainerShown(){
    this.categoryContainerToggler.nativeElement.addEventListener('click', () => {
      this.categoryContainer.nativeElement.classList.contains('category-container--shown') 
        ? disableScroll() 
        : enableScroll();
    });
  }

  private hideCategoryContainerOnResize(){
    window.addEventListener('resize', (e) => {
      if(window.innerWidth > this._BREAKPOINT_MD){
        this.categoryContainer.nativeElement.classList.remove('category-container--shown');
        enableScroll();
      }
    })
  }

  private selectVisibleCategoriesOnResize(){
    window.addEventListener('resize', (e) => 
      this.selectVisibleCategories())
  }


}

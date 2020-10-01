import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ICategory } from 'src/app/model/category';
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
  private allCategories: ICategory[] = [];
  private someCategories: ICategory[] = [];
  private visibleCategories: ICategory[] = [];
  
  constructor(private dbs: DatabaseService) { }
  
  async ngOnInit(){
    await this.getCategories();
    this.selectFourRandomCategoriesForDisplay();
  }

  ngAfterViewInit(){
    this.toggleCategoriesContainer();
  };

  private async getCategories(){
    this.allCategories = await this.dbs.getCategory(); 
  }

  private selectFourRandomCategoriesForDisplay(){
    do{
      const randomIndex = Math.round(Math.random() * (this.allCategories.length - 1));
      const randomCategory = this.allCategories[randomIndex];
      const categoryNotUsed = !this.someCategories.find((category) => category == randomCategory); 
      
      if(categoryNotUsed)
        this.someCategories.push(randomCategory);

    } while (this.someCategories.length < 4);

    this.visibleCategories = this.someCategories;
  }

  private toggleCategoriesContainer(){
    this.categoryContainerToggler.nativeElement.addEventListener('click', () => {
      this.categoryContainer.nativeElement.classList.toggle('category-container--shown');
      
      this.categoryContainer.nativeElement.classList.contains('category-container--shown') 
        ? this.visibleCategories = this.allCategories 
        : this.visibleCategories = this.someCategories;

      this.categoryContainer.nativeElement.classList.contains('category-container--shown') 
        ? disableScroll() 
        : enableScroll();
    });
  }
}

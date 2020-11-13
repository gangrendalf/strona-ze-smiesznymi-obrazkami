import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { CategoryDatabaseModel } from './category.database-model';
import { Category } from './category.interface';

class AngularFirestoreMock {
  private collectionInstance = new CollectionMock();
  private documentInstance = new DocumentMock();

  set setCollectionValue(val: Category[]){
    this.collectionInstance.value$.next(val);
  }

  set setDocumentValue(val: Category){
    this.documentInstance.value$.next(val);
  }

  createId(){
    return 'testId';
  }

  collection (path, query) {
    return this.collectionInstance;
  };

  doc(path) {
    return this.documentInstance;
  };
};

class CollectionMock {
  public value$: ReplaySubject<Category[]> = new ReplaySubject(1);

  throwError() {
    this.value$.error('example error from collectionMock producer')
  }

  valueChanges(): Observable<Category[]>{
    return this.value$.asObservable();
  }
};

class DocumentMock {
  public value$: ReplaySubject<Category> = new ReplaySubject(1);

  valueChanges(): Observable<Category>{
    return this.value$.asObservable();
  };

  set(): Promise<void>{
    return Promise.resolve();
  }
}

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('CategoryDatabaseModel', () => {
  let database: CategoryDatabaseModel;
  let angularFirestore = new AngularFirestoreMock();

  beforeEach(() => {
    database = new CategoryDatabaseModel(angularFirestore as undefined as AngularFirestore);  
  });

  it('should create an instance', () => {
    expect(database).toBeTruthy();
  });

  // describe(`getSingle()`, () => {
  //   it(`should throw 'not implemented' error`, () => {
  //     try {
  //       database.getSingle('test', 'test').subscribe();
  //     } catch (error) {
  //       expect(error).toEqual(Error('Method not implemented.'));
  //     }
  //   });
  // });

  // describe(`getAll()`, () => {
  //   let exampleCategories: Category[];

  //   beforeEach(() => {
  //     exampleCategories = [];

  //     for(let i = 0; i < 20; i++){
  //       exampleCategories.push({
  //         id: `testId${i}`, 
  //         name: `testName${i}`
  //       } as Category)
  //     };

  //     angularFirestore.setCollectionValue = exampleCategories;
  //   });

  //   it(`should return all categories`, (done) => {
  //     database.getAll('examplePath').subscribe(categories => {
  //       expect(categories.length).toBe(20);
  //       done();
  //     });
      
      
  //   });
    
  //   it(`should call firestore function with specific path and query function`, () => {
  //     const path: string = 'category';
  //     const queryFn: QueryFn = query => query.orderBy('name'); //how to check if this sepcific query fn was called?
  //     const firebaseSpy = spyOn(angularFirestore, 'collection').and.callThrough();
      
  //     database.getAll('examplePath');

  //     expect(firebaseSpy).toHaveBeenCalledOnceWith(path, jasmine.any(Function))
  //   })
  // });

  // describe(`set()`, () => {
  //   it(`should set new category`, (done) => {
  //     const newCategory: Category = {
  //       id: 'newID',
  //       name: 'newCategory'
  //     };
  //     const firebaseSpy = spyOn(angularFirestore, 'doc').and.callThrough();

  //     database.set(newCategory)

  //     expect(firebaseSpy).toHaveBeenCalledOnceWith('category/testId');
  //   })
  // })

});

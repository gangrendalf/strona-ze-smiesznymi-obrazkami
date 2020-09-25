export class PaginatorLink {
    constructor(
        public pageNumber: number | null,
        //indicate if should it be displayed as regular page link or it is special string for special display
        public isSpecialString: boolean = false,
        //here store extra strings for display, i.e. '...' or 'plus 10 pages', or extra information, i.e. 'this is very last page'
        public specialString?: string 
        ) {
            //
        }

    public markAsLastPage(){
        this.specialString = 'last page';
    }
}

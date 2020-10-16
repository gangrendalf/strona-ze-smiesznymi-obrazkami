import { ImageMetadata } from '../model/image-metadata.interface';

interface ImageResolution{
    width: number,
    height: number
}

enum TypeOfImage{
    mem,
    profile,
    background,
    notSpecified
}

export class ImageProcesor {
    public static readonly typeOfImage = {
        mem: TypeOfImage.mem,
        profile: TypeOfImage.profile,
        background: TypeOfImage.background,
        notSpecified: TypeOfImage.notSpecified
    };
    
    private readonly _MAX_BACKGROUND_IMAGE_SIZE: number = 1048576;
    private readonly _MAX_BACKGROUND_IMAGE_RESOLUTION: ImageResolution = {
        width: 800, 
        height: 300 };
    private readonly _MAX_PROFILE_IMAGE_SIZE = 307200;
    private readonly _MAX_PROFILE_IMAGE_RESOLUTION: ImageResolution = {
        width: 300, 
        height: 300 };
    private readonly _MAX_MEM_IMAGE_SIZE = 1048576 * 2;
    private readonly _MAX_MEM_IMAGE_RESOLUTION: ImageResolution = {
        width: 1000, 
        height: 1000 };
    private readonly _SELECTED_TYPE;
    
    private _imageMetadata: ImageMetadata;
    private _imageFile: File;

    private _imageHTMLElement: HTMLImageElement;
    private _imageHostURL: string;
    private _imageBlobURL: string;

    constructor(typeOfImage: TypeOfImage = TypeOfImage.notSpecified){
        this._SELECTED_TYPE = typeOfImage;
    }

    async createImageFromFile(file: File, authorID: string){
        this._imageBlobURL = URL.createObjectURL(file);
        this._imageHostURL = null;
        
        this._imageMetadata = {
            URL: this._imageBlobURL,
            uid: authorID,
            id: ''
        }
        this._imageFile = file;

        try{
            await this.verifyImage();
        }
        catch(error){
            throw error
        }

        this._imageHTMLElement = document.createElement('img');
        this._imageHTMLElement.setAttribute('src', this._imageBlobURL);
    }

    createImageFromMetadata(metadata: ImageMetadata){
        this._imageBlobURL = null;
        this._imageHostURL = metadata.URL;

        this._imageMetadata = metadata;
        this._imageFile = null;

        this._imageHTMLElement = document.createElement('img');
        this._imageHTMLElement.setAttribute('src', this._imageHostURL);
    }

    getImageURL(): string{
        if(this._imageHostURL)
            return this._imageHostURL

        return this._imageBlobURL;
    }

    getImageHTMLElement(): HTMLImageElement{
        return this._imageHTMLElement;
    }

    getMetadata(){
        return this._imageMetadata
    }

    updateMetadata(newMetadata: ImageMetadata){
        this._imageMetadata = newMetadata;
    }

    private getImageResolution(): Promise<ImageResolution>{
        const fileURL: string = URL.createObjectURL(this._imageFile);
    
        return new Promise<ImageResolution>((resolve, reject) => {
          const reader: FileReader = new FileReader();
          const image: HTMLImageElement = document.createElement('img');
      
          reader.onload = function() {
            image.onload = function(){
                resolve({
                  width: (this as HTMLImageElement).width,
                  height: (this as HTMLImageElement).height
                });
            }
            image.setAttribute('src', fileURL);
          }
          reader.readAsDataURL(this._imageFile);
        })
    }

    private async verifyImage(){
        const resolution = await this.getImageResolution();
        const size = this._imageFile.size;

        let maxResolution: ImageResolution;
        let maxSize: number;

        if(this._SELECTED_TYPE == TypeOfImage.mem){
            maxResolution = this._MAX_MEM_IMAGE_RESOLUTION;
            maxSize = this._MAX_MEM_IMAGE_SIZE;
        }else if(this._SELECTED_TYPE == TypeOfImage.profile){
            maxResolution = this._MAX_PROFILE_IMAGE_RESOLUTION;
            maxSize = this._MAX_PROFILE_IMAGE_SIZE;
        }else if(this._SELECTED_TYPE == TypeOfImage.background){
            maxResolution = this._MAX_BACKGROUND_IMAGE_RESOLUTION;
            maxSize = this._MAX_BACKGROUND_IMAGE_SIZE;
        }else
            return true;
        
        if(size > maxSize)
            throw new Error('Image size too high');

        if(resolution.width > maxResolution.width ||
            resolution.height > maxResolution.height)
            throw new Error('Image resolution too high');
      }
}



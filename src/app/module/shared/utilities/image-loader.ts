import { resolve } from 'url';
import { ImageMetadata } from '../model/image-metadata.interface';

interface ImageResolution {
    width: number,
    height: number
}

enum TypeOfImage {
    mem,
    profile,
    background,
    notSpecified
}

export class ImageLoader {
    public static readonly typeOfImage = {
        mem: TypeOfImage.mem,
        profile: TypeOfImage.profile,
        background: TypeOfImage.background,
        notSpecified: TypeOfImage.notSpecified
    };

    private readonly _MiB = 1048576;

    private readonly _MAX_BACKGROUND_IMAGE_SIZE: number = 1 * this._MiB;
    private readonly _MAX_BACKGROUND_IMAGE_RESOLUTION: ImageResolution = {
        width: 800,
        height: 300
    };
    private readonly _MAX_PROFILE_IMAGE_SIZE = .33 * this._MiB;
    private readonly _MAX_PROFILE_IMAGE_RESOLUTION: ImageResolution = {
        width: 300,
        height: 300
    };
    private readonly _MAX_MEM_IMAGE_SIZE = 2 * this._MiB;
    private readonly _MAX_MEM_IMAGE_RESOLUTION: ImageResolution = {
        width: 1000,
        height: 1000
    };
    private readonly _SELECTED_TYPE;

    private _imageMetadata: ImageMetadata;
    private _imageFile: File;

    private _imageHTMLElement: HTMLImageElement;
    private _imageHostURL: string;
    private _imageBlobURL: string;

    constructor(typeOfImage: TypeOfImage = TypeOfImage.notSpecified) {
        this._SELECTED_TYPE = typeOfImage;
    }

    createImageFromFile(file: File, authorID: string): Promise<void> {
        this._imageFile = file;

        return this.verifyImage()
            .then(
                resolve => {
                    this._imageBlobURL = URL.createObjectURL(this._imageFile);
                    this._imageHostURL = null;
            
                    this._imageMetadata = {
                        URL: this._imageBlobURL,
                        uid: authorID,
                        id: ''
                    }
            
                    this._imageHTMLElement = document.createElement('img');
                    this._imageHTMLElement.setAttribute('src', this._imageBlobURL);

                    return;
                },
                error => {
                    this._imageFile = null;
                    return Promise.reject(error);
                }
            );
    }

    createImageFromMetadata(metadata: ImageMetadata) {
        this._imageBlobURL = null;
        this._imageHostURL = metadata.URL;

        this._imageMetadata = metadata;
        this._imageFile = null;

        this._imageHTMLElement = document.createElement('img');
        this._imageHTMLElement.setAttribute('src', this._imageHostURL);
    }

    getImageURL(): string {
        if (this._imageHostURL)
            return this._imageHostURL

        return this._imageBlobURL;
    }

    getImageHTMLElement(): HTMLImageElement {
        return this._imageHTMLElement;
    }

    getMetadata() {
        return this._imageMetadata
    }

    get typeOf() {
        return this._SELECTED_TYPE;
    }

    get maxSize() {
        let maxSize: number;

        if (this._SELECTED_TYPE == TypeOfImage.mem)
            maxSize = this._MAX_MEM_IMAGE_SIZE;
        else if (this._SELECTED_TYPE == TypeOfImage.profile)
            maxSize = this._MAX_PROFILE_IMAGE_SIZE;
        else if (this._SELECTED_TYPE == TypeOfImage.background)
            maxSize = this._MAX_BACKGROUND_IMAGE_SIZE;
        else
            return -1;

        return maxSize;
    }

    get maxResolution(): ImageResolution {
        let maxResolution: ImageResolution;

        if (this._SELECTED_TYPE == TypeOfImage.mem)
            maxResolution = this._MAX_MEM_IMAGE_RESOLUTION;
        else if (this._SELECTED_TYPE == TypeOfImage.profile)
            maxResolution = this._MAX_PROFILE_IMAGE_RESOLUTION;
        else if (this._SELECTED_TYPE == TypeOfImage.background)
            maxResolution = this._MAX_BACKGROUND_IMAGE_RESOLUTION;
        else
            return {
                width: -1,
                height: -1
            };

        return maxResolution;
    }

    updateMetadata(newMetadata: ImageMetadata) {
        this._imageMetadata = newMetadata;
    }

    private verifyImage(): Promise<void> {
        const size = this._imageFile.size;

        const maxResolution = this.maxResolution;
        const maxSize = this.maxSize;

        return this.getImageResolution()
            .then(
                (resolution) => {
                    if (size > maxSize)
                        return Promise.reject('ImageLoader: Image size too high!');

                    if (resolution.width > maxResolution.width || resolution.height > maxResolution.height)
                        return Promise.reject('ImageLoader: Image resolution too high!');

                    return;
                },
                (error) => Promise.reject(error)
            );
    }

    private getImageResolution(): Promise<ImageResolution> {
        const fileURL: string = URL.createObjectURL(this._imageFile);

        return new Promise<ImageResolution>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            const image: HTMLImageElement = document.createElement('img');

            image.onerror = function (e) {
                reject(`ImageLoader: Can't parse image file into HTML Element` + e);
            };

            reader.onerror = function (e) {
                reject(`ImageLoader: Can't read file`);
            };


            image.onload = function () {
                const loadedImage = (this as HTMLImageElement);

                if (typeof loadedImage.height != 'undefined' && typeof loadedImage.width != 'undefined')
                    resolve({
                        width: loadedImage.width,
                        height: loadedImage.height
                    });
                else
                    reject(`ImageLoader: Can't read width/height property of loaded image`)
            }

            reader.onload = function () {
                image.setAttribute('src', fileURL);
            }

            reader.readAsDataURL(this._imageFile);
        })
    }
}



import { ImageMetadata } from '../model/image-metadata.interface';
import { ImageLoader } from './image-loader';

function getTestFile(fileName: string){
  return fetch(`./test-assets/${fileName}.png`)
    .then(res => res.ok ? res.blob() : Promise.reject() )
    .then(blob => new File([blob], `${fileName}.png`, { type: 'image/png' }));
}

describe('ImageLoader', () => {
  const _MiB = 1048576;
  let imageLoader: ImageLoader;

  afterEach(() => {
    imageLoader = null;
  })

  it('should create an instance', () => {
    imageLoader = new ImageLoader();

    expect(imageLoader).toBeTruthy();
  });

  describe(`types of images and restrictions`, () => {
    it(`should create mem image with specific size (2MiB) and resolution (1000px/1000px) restrictions`, () => {
      const typeOfImage = ImageLoader.typeOfImage.mem;
      imageLoader = new ImageLoader(typeOfImage);

      expect(imageLoader.typeOf).toEqual(typeOfImage)
      expect(imageLoader.maxSize).toEqual(2 * _MiB);
      expect(imageLoader.maxResolution.width).toEqual(1000);
      expect(imageLoader.maxResolution.height).toEqual(1000);
    });

    it(`should create profile image with specific size (.33MiB) and resolution (300px/300px) restrictions`, () => {
      const typeOfImage = ImageLoader.typeOfImage.profile;
      imageLoader = new ImageLoader(typeOfImage);

      expect(imageLoader.typeOf).toEqual(typeOfImage)
      expect(imageLoader.maxSize).toEqual(.33 * _MiB);
      expect(imageLoader.maxResolution.width).toEqual(300);
      expect(imageLoader.maxResolution.height).toEqual(300);
    });
    
    it(`should create background image with specific size (1MiB) and resolution (800px/300px) restrictions`, () => {
      const typeOfImage = ImageLoader.typeOfImage.background;
      imageLoader = new ImageLoader(typeOfImage);

      expect(imageLoader.typeOf).toEqual(typeOfImage)
      expect(imageLoader.maxSize).toEqual(1 * _MiB);
      expect(imageLoader.maxResolution.width).toEqual(800);
      expect(imageLoader.maxResolution.height).toEqual(300);
    });
  });

  describe(`createImageFromFile() with profile picture (lowest requirements)`, () => {
    it(`should create profile image`, (done) => {
      getTestFile('profile-correct')
        .then(
          file => {
            imageLoader = new ImageLoader(ImageLoader. typeOfImage.profile);
            return imageLoader.createImageFromFile(file,   'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            const url = imageLoader.getImageURL();
            const expectedHTML = document.createElement('img');
            expectedHTML.setAttribute('src', url);

            expect(imageLoader.getMetadata().URL).toContain('blob:http://');
            expect(imageLoader.getMetadata().uid).toEqual('testAuthor');
            expect(imageLoader.getMetadata().id).toEqual('');
            expect(imageLoader.getImageHTMLElement()).toEqual(expectedHTML);

          },
          reject => {
            fail('Image loading failed - choose correct file')
          }
          ).finally( () => {
            done();
        });


    });

    it(`should reject with message 'ImageLoader: Image resolution too high!'`, (done) => {
      getTestFile('profile-incorrect-resolution')
        .then(
          file => {
            imageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
            return imageLoader.createImageFromFile(file, 'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            fail('Image loading succeed while should not')
          },
          reject => {
            expect(reject).toEqual('ImageLoader: Image resolution too high!');
          }
          ).finally( () => {
            done();
        });
    });

    it(`should reject with message 'ImageLoader: Image size too high!'`, (done) => {
      getTestFile('profile-incorrect-size-resolution')
        .then(
          file => {
            imageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
            return imageLoader.createImageFromFile(file, 'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            fail('Image loading succeed while should not')
          },
          reject => {
            expect(reject).toEqual('ImageLoader: Image size too high!');
          }
          ).finally( () => {
            done();
        });
    });
  });
  
  describe(`createImageFromMetadata() with profile picture (lowest requirements)`, () => {
    it(`should create profile image`, () => {
      const imageMetadata: ImageMetadata = {
        URL: `./test-assets/profile-correct.png`,
        uid: 'testAuthor',
        id: 'testID123'
      };
      const expectedHTML = document.createElement('img');
      expectedHTML.setAttribute('src', imageMetadata.URL);

      imageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);

      imageLoader.createImageFromMetadata(imageMetadata);

      expect(imageLoader.getMetadata()).toEqual(imageMetadata)
      expect(imageLoader.getImageURL()).toEqual(imageMetadata.URL);
      expect(imageLoader.getImageHTMLElement()).toEqual(expectedHTML);
    });
  });

  describe(`updateMetadata()`, () => {
    it(`should update metadata`, () => {
      const oldMeta: ImageMetadata = {
        URL: './test-assets/profile-correct.png',
        uid: 'testAuthor',
        id: 'testID123'
      };

      const newMeta: ImageMetadata = {
        URL: './test-assets/profile-incorrect-resolution.png',
        uid: 'otherAuthor',
        id: 'otherID123'
      };

      imageLoader = new ImageLoader(ImageLoader.typeOfImage.profile);
      imageLoader.createImageFromMetadata(oldMeta);
      
      expect(imageLoader.getMetadata()).toEqual(oldMeta);

      imageLoader.updateMetadata(newMeta);

      expect(imageLoader.getMetadata()).toEqual(newMeta);
    });
  });
});



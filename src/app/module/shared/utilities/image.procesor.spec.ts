import { ImageMetadata } from '../model/image-metadata.interface';
import { ImageProcesor } from './image.procesor';

function getTestFile(fileName: string){
  return fetch(`./test-assets/${fileName}.png`)
    .then(res => res.ok ? res.blob() : Promise.reject() )
    .then(blob => new File([blob], `${fileName}.png`, { type: 'image/png' }));
}

fdescribe('ImageProcessor', () => {
  const _MiB = 1048576;
  let imageProcessor: ImageProcesor;

  afterEach(() => {
    imageProcessor = null;
  })

  it('should create an instance', () => {
    imageProcessor = new ImageProcesor();

    expect(imageProcessor).toBeTruthy();
  });

  describe(`types of images and restrictions`, () => {
    it(`should create mem image with specific size (2MiB) and resolution (1000px/1000px) restrictions`, () => {
      const typeOfImage = ImageProcesor.typeOfImage.mem;
      imageProcessor = new ImageProcesor(typeOfImage);

      expect(imageProcessor.typeOf).toEqual(typeOfImage)
      expect(imageProcessor.maxSize).toEqual(2 * _MiB);
      expect(imageProcessor.maxResolution.width).toEqual(1000);
      expect(imageProcessor.maxResolution.height).toEqual(1000);
    });

    it(`should create profile image with specific size (.33MiB) and resolution (300px/300px) restrictions`, () => {
      const typeOfImage = ImageProcesor.typeOfImage.profile;
      imageProcessor = new ImageProcesor(typeOfImage);

      expect(imageProcessor.typeOf).toEqual(typeOfImage)
      expect(imageProcessor.maxSize).toEqual(.33 * _MiB);
      expect(imageProcessor.maxResolution.width).toEqual(300);
      expect(imageProcessor.maxResolution.height).toEqual(300);
    });
    
    it(`should create background image with specific size (1MiB) and resolution (800px/300px) restrictions`, () => {
      const typeOfImage = ImageProcesor.typeOfImage.background;
      imageProcessor = new ImageProcesor(typeOfImage);

      expect(imageProcessor.typeOf).toEqual(typeOfImage)
      expect(imageProcessor.maxSize).toEqual(1 * _MiB);
      expect(imageProcessor.maxResolution.width).toEqual(800);
      expect(imageProcessor.maxResolution.height).toEqual(300);
    });
  });

  describe(`createImageFromFile() with profile picture (lowest requirements)`, () => {
    it(`should create profile image`, (done) => {
      getTestFile('profile-correct')
        .then(
          file => {
            imageProcessor = new ImageProcesor(ImageProcesor. typeOfImage.profile);
            return imageProcessor.createImageFromFile(file,   'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            const url = imageProcessor.getImageURL();
            const expectedHTML = document.createElement('img');
            expectedHTML.setAttribute('src', url);

            expect(imageProcessor.getMetadata().URL).toContain('blob:http://');
            expect(imageProcessor.getMetadata().uid).toEqual('testAuthor');
            expect(imageProcessor.getMetadata().id).toEqual('');
            expect(imageProcessor.getImageHTMLElement()).toEqual(expectedHTML);

          },
          reject => {
            fail('Image loading failed - choose correct file')
          }
          ).finally( () => {
            done();
        });


    });

    it(`should reject with message 'ImageProcessor: Image resolution too high!'`, (done) => {
      getTestFile('profile-incorrect-resolution')
        .then(
          file => {
            imageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);
            return imageProcessor.createImageFromFile(file, 'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            fail('Image loading succeed while should not')
          },
          reject => {
            expect(reject).toEqual('ImageProcessor: Image resolution too high!');
          }
          ).finally( () => {
            done();
        });
    });

    it(`should reject with message 'ImageProcessor: Image size too high!'`, (done) => {
      getTestFile('profile-incorrect-size-resolution')
        .then(
          file => {
            imageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);
            return imageProcessor.createImageFromFile(file, 'testAuthor');
          },
          error => {
            fail('Image loading failed - check if correct image is chosen and available')
          })
        .then(
          success => { 
            fail('Image loading succeed while should not')
          },
          reject => {
            expect(reject).toEqual('ImageProcessor: Image size too high!');
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

      imageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);

      imageProcessor.createImageFromMetadata(imageMetadata);

      expect(imageProcessor.getMetadata()).toEqual(imageMetadata)
      expect(imageProcessor.getImageURL()).toEqual(imageMetadata.URL);
      expect(imageProcessor.getImageHTMLElement()).toEqual(expectedHTML);
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

      imageProcessor = new ImageProcesor(ImageProcesor.typeOfImage.profile);
      imageProcessor.createImageFromMetadata(oldMeta);
      
      expect(imageProcessor.getMetadata()).toEqual(oldMeta);

      imageProcessor.updateMetadata(newMeta);

      expect(imageProcessor.getMetadata()).toEqual(newMeta);
    });
  });
});



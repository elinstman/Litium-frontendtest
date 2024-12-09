'use client';
import clsx from 'clsx';
import { WebsiteContext } from 'contexts/websiteContext';
import { useBodyScroll } from 'hooks/useBodyScroll';
import { useTranslations } from 'hooks/useTranslations';
import { Image as ImageModel } from 'models/image';
import Image from 'next/image';
import { Fragment, useCallback, useContext, useState } from 'react';
import { getAbsoluteImageUrl } from 'services/imageService';
import SwiperCore from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { imageConfiguration } from 'utils/responsive';
import './ImageGallery.scss';
import Sidebar from './Sidebar';
import { Swiper, SwiperSlide } from './Swiper';
import { Text } from './elements/Text';
import Close from './icons/close';

interface ImageGalleryProps {
  /**
   * List of thumbnail images to be shown.
   */
  thumbnailImages: ImageModel[];
  /**
   * List of large images to be shown.
   */
  largeImages: ImageModel[];

  /**
   * Alternative text for images that are broken.
   */
  alternativeText: string;
}

/**
 * Render image gallery
 * @param props gallery's image
 */
const ImageGallery = (props: ImageGalleryProps) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blockBodyScroll, allowBodyScroll] = useBodyScroll();
  const t = useTranslations();

  const onClose = useCallback(() => {
    setModalVisibility(false);
    allowBodyScroll();
  }, [allowBodyScroll]);
  const onClickImage = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setModalVisibility(true);
      blockBodyScroll();
    },
    [blockBodyScroll]
  );
  const noImage =
    !props.thumbnailImages?.length ||
    !props.thumbnailImages[0] ||
    !props.largeImages?.length ||
    !props.largeImages[0];

  return noImage ? (
    <Fragment />
  ) : (
    <Fragment>
      <div className="flex flex-col-reverse flex-wrap gap-y-2 lg:flex-row">
        <div className="hidden lg:block">
          <ThumbsGallery
            {...props}
            selectedSlideIndex={currentIndex}
            onClick={onClickImage}
          ></ThumbsGallery>
        </div>
        <div className="mb-4 block w-full lg:hidden">
          <HorizontalGallery
            images={props.largeImages}
            alternativeText={props.alternativeText}
            selectedSlideIndex={currentIndex}
            onClick={onClickImage}
          ></HorizontalGallery>
        </div>
      </div>
      {modalVisibility && (
        <Sidebar visible={modalVisibility} fullscreen={true} className="!p-0">
          <div className="max-h-full">
            <div className="flex justify-center p-4">
              <Text className="w-full text-center text-sm">
                {t('productdetail.imagegallery.title')}
              </Text>
              <Close alt="close" onClick={onClose} />
            </div>
            <div className="h-full">
              <div className="hidden lg:block">
                <ThumbsGallery
                  {...props}
                  selectedSlideIndex={currentIndex}
                  fullscreen={true}
                ></ThumbsGallery>
              </div>
              <div className="mb-4 block lg:hidden">
                <HorizontalGallery
                  images={props.largeImages}
                  alternativeText={props.alternativeText}
                  selectedSlideIndex={currentIndex}
                  fullscreen={true}
                ></HorizontalGallery>
              </div>
            </div>
          </div>
        </Sidebar>
      )}
    </Fragment>
  );
};

/**
 * Render image gallery with thumbnail images.
 * @param image list of large images.
 * @param thumbnailImages list of thumbnail images.
 * @param alternativeText alternative text for images that are broken.
 * @param selectedSlideIndex current index number of selected slide to be shown when in fullscreen.
 * @param fullscreen flag to show image gallery in fullscreen, default is false.
 * @param onClick large image's onClick event.
 */
const ThumbsGallery = ({
  largeImages,
  thumbnailImages,
  alternativeText,
  selectedSlideIndex = 0,
  fullscreen = false,
  onClick,
}: {
  largeImages: ImageModel[];
  thumbnailImages: ImageModel[];
  alternativeText: string;
  selectedSlideIndex?: number;
  fullscreen?: boolean;
  onClick?: (index: number) => void;
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();
  const website = useContext(WebsiteContext);
  const thumbnailParams: any = {
    spaceBetween: 10,
    slidesPerView: 'auto',
    modules: [Thumbs],
    direction: 'vertical',
    mousewheel: true,
    scrollbar: {
      draggable: true,
    },
    on: {
      init: (swiper: SwiperCore) => {
        setThumbsSwiper(swiper);
      },
    },
    initialSlide: selectedSlideIndex,
    injectStyles: [
      `
      :host {
        max-height: 550px;
        margin-right: 15px;
      }

      :host(.lightbox) {
        max-height: 100%;
        margin: 0 30px;
        flex-shrink: 0;
      }

      :host::part(wrapper) {
        margin-right: 15px;
      }
      `,
    ],
  };

  const imageParams: any = {
    thumbs: { swiper: thumbsSwiper },
    initialSlide: selectedSlideIndex,
    loop: true,
    injectStyles: [
      `
      :host {
        max-width: 491px;
      }

      :host(.lightbox) {
        max-width: 75%;
      }
      
      :host::part(button-prev),
      :host::part(button-next) {
        height: 3.5rem;
        width: 3.5rem;
        padding: 10px;
        border-radius: 50%;
        border: 1px solid #efefef;
        background-color: #ffffff;
        box-shadow: 0px 3px 5px 0px #00000059;
        box-sizing: border-box;
      }

      svg path {
        fill: #000;
      }
      `,
    ],
  };
  if (fullscreen) {
    imageParams.modules = [Thumbs, Navigation];
    imageParams.navigation = true;
  }

  return (
    <div
      className={clsx(
        'flex flex-row',
        fullscreen && 'h-[calc(100dvh_-_50px)] pb-8'
      )}
    >
      {/* Thumbnail images */}
      <Swiper
        {...thumbnailParams}
        className={clsx(
          'thumbs-gallery__thumbnail-image',
          fullscreen && 'lightbox'
        )}
      >
        {thumbnailImages?.map((value, index) => (
          <SwiperSlide key={`thumbs-swiper-${index}`}>
            {value && (
              <Image
                src={getAbsoluteImageUrl(value, website.imageServerUrl)}
                alt={alternativeText}
                width={value?.dimension?.width}
                height={value?.dimension?.height}
                className="ml-0 h-32 w-24 rounded"
                sizes={imageConfiguration.lightboxImage.thumbnail.sizes}
                data-testid={'thumbs-gallery__thumbnail-image'}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Main images */}
      <Swiper
        {...imageParams}
        className={clsx('thumbs-gallery__main-image', fullscreen && 'lightbox')}
      >
        {largeImages?.map((value, index) => (
          <SwiperSlide key={`swiper-slide-${index}`}>
            {value && (
              <Image
                priority
                src={getAbsoluteImageUrl(value, website.imageServerUrl)}
                alt={alternativeText}
                width={value?.dimension?.width}
                height={value?.dimension?.height}
                className={clsx(
                  'mx-auto',
                  !fullscreen && 'max-w-sm',
                  fullscreen &&
                    'max-h-full max-w-full object-contain object-top !pt-0'
                )}
                sizes={imageConfiguration.lightboxImage.large.sizes}
                onClick={(event: any) => {
                  event.preventDefault();
                  onClick && onClick(index);
                }}
                data-testid={'thumbs-gallery__main-image'}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

/**
 * Render a horizontal image gallery
 * @param image list of large images.
 * @param alternativeText alternative text for images that are broken.
 * @param selectedSlideIndex current index number of selected slide to be shown when in fullscreen.
 * @param fullscreen flag to show image gallery in fullscreen, default is false.
 * @param onClick large image's onClick event.
 */
const HorizontalGallery = ({
  images,
  alternativeText,
  selectedSlideIndex = 0,
  fullscreen = false,
  onClick,
}: {
  images: ImageModel[];
  alternativeText: string;
  selectedSlideIndex?: number;
  fullscreen?: boolean;
  onClick?: (index: number) => void;
}) => {
  const website = useContext(WebsiteContext);
  const params = {
    scrollbar: true,
    initialSlide: selectedSlideIndex,
    loop: true,
    injectStyles: [
      `
      :host(:not(.lightbox)) {
        max-height: 480px !important;
      }

      :host(.lightbox) {
        height: calc(100dvh - 65px);
      }
      
      :host::part(wrapper) {
        padding-bottom: 20px;
      }
      `,
    ],
  };

  return (
    <Swiper
      {...params}
      className={clsx('horizontal-gallery', fullscreen && 'lightbox')}
    >
      {images.map(
        (image, index) =>
          image && (
            <SwiperSlide key={`image-compact-${index}`}>
              <Image
                priority
                src={getAbsoluteImageUrl(image, website.imageServerUrl)}
                alt={alternativeText}
                width={image?.dimension?.width}
                height={image?.dimension?.height}
                sizes={imageConfiguration.lightboxImage.large.sizes}
                className={clsx(
                  'mx-auto cursor-pointer',
                  !fullscreen && 'max-w-xs',
                  fullscreen && 'h-full object-contain object-top'
                )}
                onClick={(event: any) => {
                  event.preventDefault();
                  onClick && onClick(index);
                }}
                data-testid="horizontal-gallery__image"
              />
            </SwiperSlide>
          )
      )}
    </Swiper>
  );
};

export default ImageGallery;

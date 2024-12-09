'use client';
import { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';

/**
 * Represents a Swiper component which uses Swiper Element.
 * @param props input parameters for Swiper https://swiperjs.com/swiper-api#parameters
 * @example
 * <Swiper
      slidesPerView={3}
      breakpoints={{ 768: { slidesPerView: 4 } }}
      on={{
        slideChange: () => console.log('slide changed'),
        progress: (s, progress) => console.log(`progress is ${progress}`),
      }}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
    </Swiper>
 */
export function Swiper(props: any) {
  let swiperRef = useRef<any>(null);
  if (props.elementRef) {
    swiperRef = props.elementRef;
  }
  const { children, className, ...rest } = props;

  useEffect(() => {
    // Register Swiper web component
    register();

    // pass component props to parameters
    const params = {
      ...rest,
    };

    // Assign it to swiper element
    Object.assign(swiperRef.current, params);

    // initialize swiper
    swiperRef.current.initialize();
  }, [rest]);

  return (
    // @ts-ignore
    <swiper-container
      init="false"
      ref={swiperRef}
      data-testid="swiper-container"
      class={className}
    >
      {children}
      {/* @ts-ignore */}
    </swiper-container>
  );
}

/**
 * Represents a Swiper slide.
 * @param props
 * @returns
 * @example
 * <Swiper
      slidesPerView={3}
      breakpoints={{ 768: { slidesPerView: 4 } }}
      on={{
        slideChange: () => console.log('slide changed'),
        progress: (s, progress) => console.log(`progress is ${progress}`),
      }}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
    </Swiper>
 */
export function SwiperSlide(props: any) {
  const { children, ...rest } = props;

  return (
    // @ts-ignore
    <swiper-slide {...rest} data-testid="swiper-slide">
      {children}
      {/* @ts-ignore */}
    </swiper-slide>
  );
}

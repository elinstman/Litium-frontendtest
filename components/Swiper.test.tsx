import { describe } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Swiper, SwiperSlide } from './Swiper';

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
describe('Swiper component', () => {
  test('should render 5 slides items', () => {
    render(
      <Swiper>
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
      </Swiper>
    );
    const swiperContainer = screen.getByTestId('swiper-container');
    expect(swiperContainer).toBeInTheDocument();

    const swiperSlides = screen.getAllByTestId('swiper-slide');
    expect(swiperSlides).toHaveLength(5);
  });
  test('should render 1000 slides items', () => {
    render(
      <Swiper>
        {Array.from({ length: 1000 }).map((value, index) => (
          <SwiperSlide key={index}>Slide {value}</SwiperSlide>
        ))}
      </Swiper>
    );
    const swiperContainer = screen.getByTestId('swiper-container');
    expect(swiperContainer).toBeInTheDocument();

    const swiperSlides = screen.getAllByTestId('swiper-slide');
    expect(swiperSlides).toHaveLength(1000);
  });
  test('should not render any slide item', () => {
    render(<Swiper></Swiper>);
    const swiperContainer = screen.getByTestId('swiper-container');
    expect(swiperContainer).toBeInTheDocument();

    const swiperSlides = screen.queryAllByTestId('swiper-slide');
    expect(swiperSlides).toHaveLength(0);
  });
  test('should not render any slide item if it inputs invalid items', () => {
    render(
      <Swiper>
        <div>slide1</div>
        <div>slide2</div>
      </Swiper>
    );
    const swiperContainer = screen.getByTestId('swiper-container');
    expect(swiperContainer).toBeInTheDocument();

    const swiperSlides = screen.queryAllByTestId('swiper-slide');
    expect(swiperSlides).toHaveLength(0);
  });
  test('should called console.log on init event', () => {
    render(
      <Swiper
        on={{
          init: () => console.log('init'),
        }}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
      </Swiper>
    );
    const swiperContainer = screen.getByTestId('swiper-container');
    expect(swiperContainer).toBeInTheDocument();

    const swiperSlides = screen.getAllByTestId('swiper-slide');
    expect(swiperSlides).toHaveLength(5);
    expect(consoleLogMock).toHaveBeenCalledWith('init');
  });
  test('should assign props.elementRef to swiperRef when it exists', () => {
    const elementRef = React.createRef();
    render(<Swiper elementRef={elementRef} />);

    expect(elementRef.current).toBeDefined();
  });
});

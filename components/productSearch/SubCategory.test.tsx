import { cloneDeep } from '@apollo/client/utilities';
import { render, screen } from '@testing-library/react';
import { SwiperSlide } from 'components/Swiper';
import { CategoryItem } from 'models/category';
import React from 'react';
import SubCategory from './SubCategory';

window.getComputedStyle = jest.fn();

jest.mock('../Swiper', () => ({
  Swiper: jest.fn().mockImplementation((props: any) => {
    const { children } = props;
    return <SwiperSlide>{children}</SwiperSlide>;
  }),
  SwiperSlide: jest.fn().mockImplementation((props: any) => {
    const { children, ...rest } = props;
    return <div {...rest}>{children}</div>;
  }),
}));

describe('SubCategory', () => {
  let matchMediaTemp: (query: string) => MediaQueryList;

  beforeEach(() => {
    jest.spyOn(React, 'useRef').mockImplementation(() => {
      return {
        current: {
          swiper: {
            enable: jest.fn(),
          },
        },
      };
    });
    matchMediaTemp = cloneDeep(window.matchMedia);
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };
  });

  afterEach(() => {
    window.matchMedia = matchMediaTemp;
  });

  test('should not render sub category if not available', () => {
    const subCategories: CategoryItem[] = [];
    render(<SubCategory subCategories={subCategories}></SubCategory>);
    expect(screen.queryByTestId('sub-category')).not.toBeInTheDocument();
  });

  test('should not render sub category without url', () => {
    const subCategories: CategoryItem[] = [
      {
        __typename: 'category',
        name: 'Bottoms',
        url: '',
      },
    ];
    render(<SubCategory subCategories={subCategories}></SubCategory>);
    expect(screen.queryByTestId('sub-category')).not.toBeInTheDocument();
  });

  test('should not render sub category without name', () => {
    const subCategories: CategoryItem[] = [
      {
        __typename: 'category',
        name: '',
        url: '/woman/bottoms',
      },
    ];
    render(<SubCategory subCategories={subCategories}></SubCategory>);
    expect(screen.queryByTestId('sub-category')).not.toBeInTheDocument();
  });

  test('should render correct sub category data', () => {
    const subCategories: CategoryItem[] = [
      {
        __typename: 'category',
        name: 'Bottoms',
        url: '/woman/bottoms',
      },
    ];
    render(<SubCategory subCategories={subCategories}></SubCategory>);
    expect(screen.queryAllByTestId('sub-category').length).toBe(1);
    expect(screen.getByTestId('sub-category').textContent).toEqual('Bottoms');
    expect(screen.getByTestId('sub-category')).toHaveAttribute(
      'href',
      '/woman/bottoms'
    );
  });

  test('should render correct number of sub categories', () => {
    const subCategories: CategoryItem[] = [
      {
        __typename: 'category',
        name: 'Bottoms',
        url: '/woman/bottoms',
      },
      {
        __typename: 'category',
        name: 'Tops',
        url: '/woman/tops',
      },
    ];
    render(<SubCategory subCategories={subCategories}></SubCategory>);
    expect(screen.queryAllByTestId('sub-category').length).toBe(2);
  });
});

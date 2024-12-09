'use client';
import { CategoryItem } from 'models/category';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from '../Swiper';
import './SubCategory.scss';

/**
 * Renders a subcategory list.
 * @param subCategories a subcategory list of category.
 */
function SubCategory({ subCategories }: { subCategories: CategoryItem[] }) {
  const swiperRef = useRef<any>(null);
  const params = {
    slidesPerView: 'auto',
    spaceBetween: 10,
    scrollbar: true,
    injectStyles: [
      `
      :host .swiper-wrapper {
        width: fit-content;
        padding-bottom: 15px;
        @media only screen and (min-width: 1024px) {
          padding-bottom: 0;
          flex-wrap: wrap;
          transform: none;
        }
      }
      `,
    ],
  };

  useEffect(() => {
    const breakpointChecker = function () {
      let breakpoint = window?.matchMedia('(min-width: 1024px)');
      if (breakpoint.matches === true) {
        swiperRef.current.swiper.disable();
      } else {
        swiperRef.current.swiper.enable();
      }
    };

    window?.addEventListener('resize', breakpointChecker);
    breakpointChecker();
    return () => window?.removeEventListener('resize', breakpointChecker);
  }, []);
  return (
    <div className="-mx-5 mb-5">
      <div className="mb-3 px-5">
        {!!subCategories && (
          <Swiper {...params} elementRef={swiperRef}>
            {subCategories
              .filter(({ url, name }) => {
                return !!url && !!name;
              })
              .map((item, index) => (
                <SwiperSlide key={item?.url || index}>
                  <div className="mr-2 rounded bg-secondary-3 px-3 py-1 text-sm last:mr-0 lg:mb-2">
                    <Link href={item?.url} data-testid="sub-category">
                      {item.name}
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default SubCategory;

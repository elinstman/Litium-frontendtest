import clsx from 'clsx';
import { Heading2 } from 'components/elements/Heading';
import { ProductItem } from 'models/products';
import { Swiper, SwiperSlide } from '../Swiper';
import ProductCard from './ProductCard';

/**
 * Renders a swipeable product list.
 * @param items a list of product.
 * @param title a title
 */
function HorizontalProductList({
  items,
  title,
  className,
}: {
  items: ProductItem[];
  title?: string;
  className?: string;
}) {
  const params = {
    breakpoints: {
      320: {
        slidesPerView: 2.4,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3.6,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4.6,
        spaceBetween: 50,
      },
      1280: {
        slidesPerView: 4.6,
        spaceBetween: 70,
      },
    },
    slidesPerView: 4.6,
    scrollbar: {
      draggable: true,
    },
    virtual: true,
    injectStyles: [
      `
      :host .swiper-wrapper {
        padding-bottom: 15px;
        &:has(+slot+.swiper-scrollbar-lock) {
          padding-bottom: 0;
        }
      }
      `,
    ],
  };

  items = items.filter((item) => {
    return item.url !== undefined;
  });

  if (!items?.length) {
    return null;
  }

  return (
    <div
      className={clsx('my-5', className)}
      data-testid="horizontal-product-list__container"
    >
      {title && (
        <Heading2
          className="mb-4 text-h2"
          data-testid="horizontal-product-list__title"
        >
          {title}
        </Heading2>
      )}
      <Swiper {...params}>
        {items.map((item) => (
          <SwiperSlide key={item.articleNumber}>
            <ProductCard {...item} showBuyButton={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HorizontalProductList;

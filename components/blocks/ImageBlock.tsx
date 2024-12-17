import { PointerMediaImageItem } from 'models/pointers';

import { Block } from 'models/block';
import { ContentFieldType } from 'models/content';
import Image from 'next/image';
import { getAbsoluteImageUrl } from 'services/imageService';

export interface ImageBlockType extends ContentFieldType {
  blockImagePointer?: PointerMediaImageItem;
  text?: string;
  _name?: string;
}

// export interface ImageBlockField extends ContentFieldType {
//   blockImagePointer?: PointerMediaImageItem;
//   text?: string;
// }

export interface ImageBlockProps extends Block {
  fields: ImageBlockType;
}

export default function ImageBlock(props: ImageBlockProps) {
  console.log('props in image block', props);
  const { blockImagePointer } = props.fields || {};

  if (!blockImagePointer?.item?.url) {
    return <div data-testid="imageBlock_empty">ingen bild tillgänglig</div>;
  }

  return (
    <div className="relative" data-testid="imageblock">
      <Image
        src={getAbsoluteImageUrl(blockImagePointer.item)}
        alt="Bild"
        height={blockImagePointer.item.dimension.height}
        width={blockImagePointer.item.dimension.width}
        style={{
          width: '100%',
          objectFit: 'cover',
        }}
        priority={true}
        data-testid="imageblock__image"
      />
    </div>
  );
}

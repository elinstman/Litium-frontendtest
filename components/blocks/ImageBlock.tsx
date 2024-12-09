import { Block } from 'models/block';
import { ContentFieldType } from 'models/content';
import { PointerMediaImageItem } from 'models/pointers';
import Image from 'next/image';
import { getAbsoluteImageUrl } from 'services/imageService';

export interface ImageBlockType {
  blockImagePointer?: PointerMediaImageItem;
}

export interface ImageBlockField extends ContentFieldType {
  fields: ImageBlockType;
}

export interface ImageBlockProps extends Block {
  fields: ImageBlockField;
}

export default function ImageBlock(props: ImageBlockProps) {
  const { fields } = props.fields;
  const { blockImagePointer } = fields;
  console.log('props', blockImagePointer);
  if (!blockImagePointer?.item?.url) {
    return <div data-testId="imageBlock_empty">ingen bild tillgänglig</div>;
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

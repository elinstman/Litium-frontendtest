import { Block } from 'models/block';
import BlockContainer from './BlockContainer';

export default function TwoColumnsBlock({ children }: { children: Block[] }) {
  return (
    <div
      className="grid grid-cols-2 gap-4"
      style={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        margin: '0 auto', // Centrera blocken >
      }}
    >
      {children.map((block, index) => (
        <div
          key={index}
          className={`flex h-full w-full flex-col items-center justify-center ${
            index === 0 ? 'text-center text-black sm:text-center' : 'bg-white'
          }`}
        >
          <BlockContainer blocks={[block]} />
        </div>
      ))}
    </div>
  );
}

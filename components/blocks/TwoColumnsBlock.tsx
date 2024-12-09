import { Block } from 'models/block';
import BlockContainer from './BlockContainer';

export default function TwoColumnsBlock({ children }: { children: Block[] }) {
  return (
    <div className="grid grid-cols-2">
      <BlockContainer blocks={children}></BlockContainer>
    </div>
  );
}

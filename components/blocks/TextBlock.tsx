import { Block } from 'models/block';
import { ContentFieldType } from 'models/content';

export interface TextField extends ContentFieldType {
  text: string;
  title: string;
}

export interface TextBlockProps extends Block {
  fields: TextField;
}

export default function TextBlock(props: TextBlockProps) {
  console.log('props i textblock', props);
  const { text, title } = props.fields;
  return (
    <div>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

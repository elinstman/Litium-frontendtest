import { Block } from 'models/block';
import { ContentFieldType } from 'models/content';

export interface TextField extends ContentFieldType {
  text: string;
}

export interface TextBlockProps extends Block {
  fields: TextField;
}

export default function TextBlock(props: TextBlockProps) {
  const { text } = props.fields;
  console.log('text', text);
  return <span>{text}</span>;
}

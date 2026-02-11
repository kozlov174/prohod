import { Glyph } from '@/Assets/Icons';
import { Colors } from './types';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: Glyph;
  size?: number;
  glyphColor?: IconColor;
  hoverglyphcolor?: IconColor;
  containerStyle?: string;
  pointer?: boolean;
}

export type IconColor = keyof typeof Colors;

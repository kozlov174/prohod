import ArrowDown from './ArrowDown.svg';
import Eye from './Eye.svg';
import EyeClose from './EyeClose.svg';
import Search from './Search.svg';
import Delete from './Delete.svg';
import Close from './Close.svg';
import Sort from './Sort.svg';
import Settings from './Settings.svg';
import ArrowLeft from './ArrowLeft.svg';
import ArrowRight from './ArrowRight.svg';
import Add from './Add.svg';

export const icons = {
  arrowDown: ArrowDown,
  eye: Eye,
  eyeClose: EyeClose,
  search: Search,
  delete: Delete,
  close: Close,
  sort: Sort,
  settings: Settings,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  add: Add,
} as const;

export type Glyph = keyof typeof icons;

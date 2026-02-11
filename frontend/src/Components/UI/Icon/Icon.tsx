import styles from './Styles.module.scss';
import { forwardRef, useState } from 'react';
import { IconProps } from './IconProps';
import { Colors } from './types';
import { icons } from '@/Assets/Icons';

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    { glyph = 'arrowDown', size = 14, glyphColor = 'black', pointer = false, containerStyle, className, ...props },
    ref
  ) => {
    const [isHover, setIsHover] = useState(false);
    const iconUrl = icons[glyph];
    const iconStyle: React.CSSProperties = {
      WebkitMaskImage: `url("${iconUrl}")`,
      maskImage: `url("${iconUrl}")`,
      cursor: pointer ? 'pointer' : 'inherit',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: `${Colors[isHover && props.hoverglyphcolor ? props.hoverglyphcolor : glyphColor]}`,
    };

    if (containerStyle) {
      return (
        <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={containerStyle}>
          <i className={`${styles.icon} ${className}`} style={iconStyle} ref={ref} {...props} />
        </div>
      );
    }

    return (
      <i
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={`${styles.icon} ${className}`}
        style={iconStyle}
        ref={ref}
        {...props}
      />
    );
  }
);
Icon.displayName = 'Icon';

export { Icon };

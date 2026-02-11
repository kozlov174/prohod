import { JSX, memo, useEffect } from 'react';
import styles from './Styles.module.scss';

interface LoaderProps {
  size?: 'default' | 'fullBlock' | 'fullWindow';
}

function LoaderComponent({ size = 'default' }: LoaderProps): JSX.Element {
  useEffect(() => {
    if (size === 'fullWindow') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  });

  return (
    <div className={`${styles.container} ${styles[`container__${size}`]}`}>
      <div className={`${styles.content} ${styles[`content__${size}`]}`}>
        <div className={`${styles.loader} ${styles[`loader__${size}`]}`}>
          <svg className={`${styles.svg}`} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 20.2258C8.63333 20.2258 7.34167 19.9633 6.125 19.4383C4.90833 18.9133 3.84583 18.1967 2.9375 17.2883C2.02917 16.38 1.3125 15.3175 0.7875 14.1008C0.2625 12.8842 0 11.5925 0 10.2258C0 8.8425 0.2625 7.54666 0.7875 6.33833C1.3125 5.13 2.02917 4.07166 2.9375 3.16333C3.84583 2.255 4.90833 1.53833 6.125 1.01333C7.34167 0.48833 8.63333 0.22583 10 0.22583C10.2833 0.22583 10.5208 0.321663 10.7125 0.51333C10.9042 0.704997 11 0.942497 11 1.22583C11 1.50916 10.9042 1.74666 10.7125 1.93833C10.5208 2.13 10.2833 2.22583 10 2.22583C7.78333 2.22583 5.89583 3.005 4.3375 4.56333C2.77917 6.12166 2 8.00916 2 10.2258C2 12.4425 2.77917 14.33 4.3375 15.8883C5.89583 17.4467 7.78333 18.2258 10 18.2258C12.2167 18.2258 14.1042 17.4467 15.6625 15.8883C17.2208 14.33 18 12.4425 18 10.2258C18 9.9425 18.0958 9.705 18.2875 9.51333C18.4792 9.32166 18.7167 9.22583 19 9.22583C19.2833 9.22583 19.5208 9.32166 19.7125 9.51333C19.9042 9.705 20 9.9425 20 10.2258C20 11.5925 19.7375 12.8842 19.2125 14.1008C18.6875 15.3175 17.9708 16.38 17.0625 17.2883C16.1542 18.1967 15.0958 18.9133 13.8875 19.4383C12.6792 19.9633 11.3833 20.2258 10 20.2258Z"
              fill="#1E4391"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export const Loader = memo(LoaderComponent);

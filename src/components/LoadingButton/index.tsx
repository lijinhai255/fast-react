import { Button, ButtonProps } from 'antd';
import { useState } from 'react';

interface LoadingButtonType extends ButtonProps {
  onClick: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any>;
}

const LoadingButton: React.FC<LoadingButtonType> = ({ onClick, ...props }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick: React.MouseEventHandler<HTMLElement> = ev => {
    setLoading(true);
    onClick?.(ev)?.finally(() => {
      setLoading(false);
    });
  };

  return <Button loading={loading} onClick={handleClick} {...props} />;
};
export default LoadingButton;

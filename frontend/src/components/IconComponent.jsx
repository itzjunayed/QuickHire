import { Icon } from '@iconify/react';

export default function IconComponent({ icon, className = '', width = 20, height = 20, ...props }) {
  return (
    <Icon 
      icon={icon} 
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
}

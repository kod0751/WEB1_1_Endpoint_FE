interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'fill' | 'unfill';
  color?: 'blue' | 'gray' | 'red' | 'green' | 'orange';
  size?: 'small' | 'medium' | 'large' | 'long';
}

function Button({
  label,
  onClick,
  variant = 'fill',
  color = 'blue',
  size = 'medium',
}: ButtonProps) {
  const colorClasses = {
    blue: variant === 'fill' ? 'bg-blue-500 text-white' : 'text-gray-500 border-gray-500',
    gray: variant === 'fill' ? 'bg-black text-white' : 'text-gray-500 border-gray-500',
    red: variant === 'fill' ? 'bg-red-500 text-white' : 'text-gray-500 border-gray-500',
    green: variant === 'fill' ? 'bg-green-500 text-white' : 'text-gray-500 border-gray-500',
    orange: variant === 'fill' ? 'bg-orange-500 text-white' : 'text-gray-500 border-gray-500',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    long: 'w-full py-2 text-base',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg transition focus:outline-none border 
        ${colorClasses[color]} ${sizeClasses[size]}
        ${variant === 'fill' ? '' : 'border'} hover:opacity-80`}
    >
      {label}
    </button>
  );
}

export default Button;

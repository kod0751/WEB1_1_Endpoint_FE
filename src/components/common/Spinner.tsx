import { Loader2 } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
    </div>
  );
};

export default Spinner;

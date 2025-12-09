import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="py-64 flex justify-center items-center">
    <FaSpinner className="animate-spin text-primary-blue w-7 h-7" />
  </div>
);

export default LoadingSpinner;

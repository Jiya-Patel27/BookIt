import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string; // optional prop for custom text
}

export default function BackButton({ label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2 cursor-pointer w-fit bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}


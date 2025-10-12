import { Share2 } from "lucide-react"; // optional icon
import { Button } from "@/components/ui/button"; // if using shadcn; or use a normal button

const ShareButton = ({ url, title, text }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
};

export default ShareButton;

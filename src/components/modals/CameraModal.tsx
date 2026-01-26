import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { Camera, Image, X } from "lucide-react";

export const CameraModal = () => {
  const { showCamera, setShowCamera } = useUserStore();

  return (
    <Dialog open={showCamera} onOpenChange={setShowCamera}>
      <DialogContent className="max-w-sm mx-4 rounded-3xl p-0 overflow-hidden">
        <div className="relative aspect-[3/4] bg-muted flex items-center justify-center">
          {/* 相机预览区域占位 */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-foreground/10 flex items-center justify-center">
              <Camera className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              拍照识别食物
            </p>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={() => setShowCamera(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* 底部控制区 */}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-center">AI 食物识别</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-6 rounded-xl"
            >
              <Image className="h-5 w-5 mr-2" />
              相册
            </Button>
            <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
              <div className="w-12 h-12 rounded-full border-4 border-white" />
            </button>
            <div className="w-14" /> {/* 占位平衡 */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

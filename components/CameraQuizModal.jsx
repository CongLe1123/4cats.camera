"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, HelpCircle, Camera, ChevronRight } from "lucide-react";
import { getCameras } from "../lib/fetchCameras";

const QUIZ_QUESTIONS = [
  {
    id: "budget",
    title: "Ngân sách tối đa của bạn khoảng bao nhiêu?",
    subtitle: "Giúp 4cats giới hạn các dòng máy phù hợp túi tiền",
    options: [
      { label: "Dưới 12 triệu", value: 12000000, desc: "Tiết kiệm, khởi đầu đam mê" },
      { label: "12 – 16 triệu", value: 16000000, desc: "Phân khúc máy ngon, đa năng" },
      { label: "16 – 20 triệu", value: 20000000, desc: "Dòng máy hiện đại, chất lượng cao" },
      { label: "Trên 20 triệu", value: 50000000, desc: "Dư dả, muốn dòng hoài cổ cao cấp" }
    ]
  },
  {
    id: "mainUse",
    title: "Nhu cầu chụp ảnh chính của bạn là gì?",
    subtitle: "Mỗi dòng máy có thế mạnh riêng về màu da hoặc cảnh vật",
    options: [
      { label: "Chụp chân dung, selfie, sống ảo cafe", value: "portrait", matchTags: ["Selfie", "Chụp người", "Cafe/OOTD"] },
      { label: "Màu film vintage, chụp phố, retro hoài cổ", value: "film", matchTags: ["Film look", "Street"] },
      { label: "Quay Vlog, TikTok, video sáng tạo nội dung", value: "vlog", matchTags: ["Vlog", "Selfie"] },
      { label: "Du lịch, phong cảnh, gia đình hàng ngày", value: "travel", matchTags: ["Du lịch", "Người mới"] }
    ]
  },
  {
    id: "mediaType",
    title: "Bạn ưu tiên chụp ảnh hay quay video hơn?",
    subtitle: "Để chọn máy có tính năng quay chuyên biệt hoặc màu ảnh JPEG đẹp",
    options: [
      { label: "Chủ yếu chụp ảnh, ít khi quay", value: "photo" },
      { label: "Cả chụp và quay video ngang nhau", value: "both" },
      { label: "Quay video là chính (vlog, podcast, reel)", value: "video" }
    ]
  },
  {
    id: "portability",
    title: "Độ nhỏ gọn quan trọng với bạn đến mức nào?",
    subtitle: "Máy càng nhẹ thì càng dễ mang theo hàng ngày",
    options: [
      { label: "Càng nhẹ càng tốt (<350g, đút vừa túi xách)", value: "ultra-light" },
      { label: "Vừa phải (~380g - 400g), đeo cổ thoải mái", value: "medium" },
      { label: "Cầm đầm tay, chắc chắn là được", value: "heavy" }
    ]
  },
  {
    id: "priority",
    title: "Điều gì quan trọng nhất với bạn khi cầm máy?",
    subtitle: "Tiêu chí quyết định bạn sẽ yêu thích chiếc máy lâu dài",
    options: [
      { label: "Chụp da người trắng hồng, nịnh mắt ngay", value: "skin-tone" },
      { label: "Chất màu film nghệ thuật, không cần chỉnh sửa", value: "film-colors" },
      { label: "Lấy nét siêu nhanh, không bao giờ out nét", value: "fast-af" },
      { label: "Đã có sẵn ống kính liền, không phải mua thêm lens", value: "all-in-one" }
    ]
  }
];

export function CameraQuizModal({ allCameras = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [fetchedCameras, setFetchedCameras] = useState([]);

  useEffect(() => {
    if ((!allCameras || allCameras.length === 0) && isOpen) {
      getCameras().then((cams) => setFetchedCameras(cams || []));
    }
  }, [allCameras, isOpen]);

  const models = (allCameras && allCameras.length > 0) ? allCameras : fetchedCameras;

  const handleSelectOption = (questionId, value) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults(nextAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const scored = models.map((model) => {
      let score = 0;
      const reasons = [];

      // Budget match
      if (model.minPrice && finalAnswers.budget) {
        if (model.minPrice <= finalAnswers.budget) {
          score += 30;
          reasons.push(`Giá từ ${new Intl.NumberFormat("vi-VN").format(model.minPrice)}đ phù hợp ngân sách của bạn.`);
        } else {
          score -= 20;
        }
      }

      // Main use match
      if (finalAnswers.mainUse === "portrait") {
        if (model.slug === "canon-eos-r50") {
          score += 35;
          reasons.push("Tông màu da trắng hồng nịnh mắt trứ danh của Canon, chụp chân dung rất đẹp.");
        }
      } else if (finalAnswers.mainUse === "film") {
        if (model.slug === "fujifilm-x-t30-ii") {
          score += 40;
          reasons.push("18 giả lập màu film trứ danh độc quyền của Fujifilm, chuẩn gu hoài cổ.");
        }
      } else if (finalAnswers.mainUse === "vlog") {
        if (model.slug === "sony-zv-1-ii") {
          score += 40;
          reasons.push("Góc siêu rộng 18mm, mic 3 củ lọc ồn và chế độ quay Vlog chuyên dụng.");
        } else if (model.slug === "canon-eos-r50") {
          score += 25;
          reasons.push("Màn hình xoay lật 180° và quay 4K không crop rất tiện quay vlog.");
        }
      } else if (finalAnswers.mainUse === "travel") {
        if (model.characteristics?.includes("Nhỏ nhẹ")) {
          score += 25;
          reasons.push(`Trọng lượng ${model.weight} nhỏ gọn, tiện mang theo du lịch.`);
        }
      }

      // Portability
      if (finalAnswers.portability === "ultra-light" && model.slug === "sony-zv-1-ii") {
        score += 20;
        reasons.push("Chỉ nặng 292g, bỏ vừa túi xách mini mang theo hàng ngày.");
      }

      // Priority
      if (finalAnswers.priority === "skin-tone" && model.brand === "Canon") {
        score += 25;
        reasons.push("Màu JPEG ăn ngay nịnh da, không mất công chỉnh ảnh hậu kỳ.");
      } else if (finalAnswers.priority === "film-colors" && model.brand === "Fujifilm") {
        score += 25;
        reasons.push("Được mệnh danh là 'phù thủy màu sắc' với chất film hoài niệm.");
      } else if (finalAnswers.priority === "fast-af" && model.brand === "Sony") {
        score += 25;
        reasons.push("Hệ thống lấy nét Real-time Eye AF khóa mắt siêu tốc 0.02s.");
      } else if (finalAnswers.priority === "all-in-one" && model.camera_type === "Compact") {
        score += 25;
        reasons.push("Ống kính liền ZEISS cao cấp đi kèm sẵn, không cần tốn tiền mua thêm lens.");
      }

      // Determine label
      let matchLabel = "Có thể phù hợp";
      let badgeColor = "bg-gray-100 text-gray-800";
      if (score >= 70) {
        matchLabel = "Rất phù hợp ✨";
        badgeColor = "bg-green-100 text-green-800 border-green-300";
      } else if (score >= 40) {
        matchLabel = "Khá phù hợp";
        badgeColor = "bg-blue-100 text-blue-800 border-blue-300";
      }

      return {
        model,
        score,
        matchLabel,
        badgeColor,
        reasons
      };
    });

    // Sort by highest score and pick top 2
    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 2));
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs gap-2 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" /> Không biết chọn máy nào? (Test 30s)
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-4xl border-none shadow-2xl p-6 md:p-8">
        {!results ? (
          <div className="space-y-6">
            <DialogHeader className="space-y-1 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                <span>Câu hỏi {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
                <span className="text-primary font-black">
                  {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
              <DialogTitle className="text-xl md:text-2xl font-black text-foreground pt-3">
                {currentQ.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {currentQ.subtitle}
              </p>
            </DialogHeader>

            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, opt.value)}
                  className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors block">
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {opt.desc}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="pt-2 flex justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-muted-foreground font-bold"
                >
                  ← Quay lại câu trước
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <DialogTitle className="text-2xl font-black text-primary">
                Gợi Ý Chiếc Máy Hợp Với Bạn 📸
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Dựa trên ngân sách và thói quen chụp của bạn, đây là những dòng máy phù hợp nhất:
              </p>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {results.map(({ model, matchLabel, badgeColor, reasons }, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-3xl border border-primary/20 bg-white shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={model.main_image || model.image}
                      alt={model.name}
                      className="w-16 h-16 object-cover rounded-2xl bg-muted border shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {matchLabel}
                        </span>
                      </div>
                      <h4 className="font-black text-base text-foreground mt-0.5">
                        {model.brand} {model.model_name}
                      </h4>
                      <p className="text-xs font-black text-primary">
                        {model.minPrice ? `Từ ${new Intl.NumberFormat("vi-VN").format(model.minPrice)}đ` : "Liên hệ"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-secondary/15 rounded-2xl p-3 text-xs">
                    <span className="font-bold text-foreground block">Lý do phù hợp:</span>
                    {reasons.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5 text-muted-foreground">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full sticker h-10 font-bold text-xs uppercase" onClick={() => setIsOpen(false)}>
                    <Link href={`/may-anh/${model.slug}`}>
                      Xem chi tiết {model.brand} {model.model_name} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetQuiz}
                className="text-xs text-muted-foreground font-bold gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Làm lại bài test
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold rounded-xl"
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

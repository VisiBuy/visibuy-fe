import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  CheckCircle,
  Video,
  X,
  ChevronLeft,
} from "lucide-react";

import {
  createVerificationSchema,
  CreateVerificationFormData,
} from "@/schemas/createVerificationSchema";

import proofPlaceIllustration from "@/assets/proof-place.png";
import proofHoldIllustration from "@/assets/proof-hold.png";

interface Props {
  onSubmit: (
    data: CreateVerificationFormData
  ) => Promise<void>;
  isLoading: boolean;
}

const imageCaptureFlow = [
  {
    title: "Show the front side",
    helper: "",
  },
  {
    title: "Turn to the back side",
    helper: "",
  },
  {
    title: "Show important details",
    helper:
      "Tag, logo, serial number, texture, etc.",
  },
  {
    title: "Show the left side",
    helper: "",
  },
  {
    title: "Show the right side",
    helper: "",
  },
];

const proofSlides = [
  proofPlaceIllustration,
  proofHoldIllustration,
];

export const CreateVerificationForm: React.FC<
  Props
> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
    trigger,
  } = useForm<CreateVerificationFormData>({
    resolver: zodResolver(
      createVerificationSchema
    ),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      price: 0,
      enableEscrow: false,
      photos: [],
      video: undefined,
    },
  });

  const [step, setStep] = useState<
    | "prep"
    | "capture"
    | "video"
    | "details"
    | "review"
  >("prep");

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [captureIndex, setCaptureIndex] =
    useState(0);

  const [showPriceField, setShowPriceField] =
    useState(false);

  const [showSlowMessage, setShowSlowMessage] =
    useState(false);

  const [isRecordingVideo, setIsRecordingVideo] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const liveVideoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const recordedChunksRef =
    useRef<Blob[]>([]);

  const recordingIntervalRef =
    useRef<NodeJS.Timeout | null>(null);

  const photos = watch("photos");

  const video = watch("video");

  const title = watch("title");

  // AUTO ROTATE ILLUSTRATIONS
  useEffect(() => {
    if (step !== "prep") return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === proofSlides.length - 1
          ? 0
          : prev + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [step]);

  // LOADING FEEDBACK
  useEffect(() => {
    if (!isLoading) {
      setShowSlowMessage(false);

      return;
    }

    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (step === "capture") {
      startPhotoCamera();
    }

    if (step === "video") {
      startVideoCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step]);

  const readiness = useMemo(() => {
    return {
      photosReady: photos.length === 5,
      videoReady: Boolean(video),
      detailsReady: Boolean(title?.trim()),
    };
  }, [photos, video, title]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }

    if (recordingIntervalRef.current) {
      clearInterval(
        recordingIntervalRef.current
      );
    }
  };

  const attachStreamToVideo = async (
    stream: MediaStream
  ) => {
    const videoElement =
      liveVideoRef.current;

    if (!videoElement) return;

    videoElement.srcObject = stream;

    videoElement.playsInline = true;

    videoElement.muted = true;

    await videoElement.play();
  };

  const startPhotoCamera = async () => {
    try {
      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
              width: {
                ideal: 1080,
              },
              height: {
                ideal: 1920,
              },
            },
            audio: false,
          }
        );

      streamRef.current = stream;

      await attachStreamToVideo(stream);
    } catch (error) {
      console.error(error);
    }
  };

  const startVideoCamera = async () => {
    try {
      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
              width: {
                ideal: 1080,
              },
              height: {
                ideal: 1920,
              },
            },
            audio: true,
          }
        );

      streamRef.current = stream;

      await attachStreamToVideo(stream);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoCapture = async () => {
    if (
      !liveVideoRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const videoElement =
      liveVideoRef.current;

    const canvas = canvasRef.current;

    const width = videoElement.videoWidth;

    const height = videoElement.videoHeight;

    if (!width || !height) return;

    canvas.width = width;

    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      videoElement,
      0,
      0,
      width,
      height
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `capture-${captureIndex + 1}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        const updatedPhotos = [
          ...photos,
          file,
        ];

        setValue("photos", updatedPhotos, {
          shouldValidate: isSubmitted,
        });

        if (captureIndex < 4) {
          setTimeout(() => {
            setCaptureIndex(
              (prev) => prev + 1
            );
          }, 500);
        } else {
          stopCamera();

          setTimeout(() => {
            setStep("video");
          }, 700);
        }

        if (isSubmitted) {
          await trigger("photos");
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const handleVideoCapture = async () => {
    if (!streamRef.current) return;

    if (isRecordingVideo) {
      mediaRecorderRef.current?.stop();

      setIsRecordingVideo(false);

      if (recordingIntervalRef.current) {
        clearInterval(
          recordingIntervalRef.current
        );
      }

      return;
    }

    recordedChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(
      streamRef.current
    );

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (
      event
    ) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(
          event.data
        );
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(
        recordedChunksRef.current,
        {
          type: "video/webm",
        }
      );

      const file = new File(
        [blob],
        "proof-video.webm",
        {
          type: "video/webm",
        }
      );

      setValue("video", file, {
        shouldValidate: true,
      });

      stopCamera();

      setTimeout(() => {
        setStep("details");
      }, 700);
    };

    mediaRecorder.start(200);

    setIsRecordingVideo(true);

    setRecordingTime(0);

    recordingIntervalRef.current =
      setInterval(() => {
        setRecordingTime((prev) => {
           const nextTime = prev + 1;
          if (nextTime >= 30) {
            mediaRecorder.stop();

            setIsRecordingVideo(false);

            if (
              recordingIntervalRef.current
            ) {
              clearInterval(
                recordingIntervalRef.current
              );
            }

            return 30;
          }

          return nextTime;
        });
      }, 1000);
  };

  const handleDetailsContinue =
    async () => {
      setValue(
        "description",
        `Proof created for ${
          title || "item"
        }`
      );

      const valid = await trigger([
        "title",
        "description",
      ]);

      if (valid) {
        setStep("review");
      }
    };

  const onFormSubmit = async (
    data: CreateVerificationFormData
  ) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="min-h-screen bg-black overflow-hidden"
    >
      {/* ===================================================== */}
      {/* PREP */}
      {/* ===================================================== */}

      {step === "prep" && (
        <div className="fixed inset-0 bg-white overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={proofSlides[currentSlide]}
              alt="Proof preparation"
              className="
                w-full
                h-full
                object-contain
                transition-opacity
                duration-700
                ease-out
              "
            />
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              z-20
              px-space-24
              pb-[max(24px,env(safe-area-inset-bottom))]
            "
          >
            <button
              type="button"
              onClick={() => {
                setStep("capture");
              }}
              className="
                w-full
                h-[58px]
                rounded-[18px]
                bg-primary-blue
                text-white
                font-semibold
                text-body-medium
                shadow-elevation-2
                active:scale-[0.98]
                transition-transform
              "
            >
              Start Recording
            </button>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* IMAGE CAPTURE */}
      {/* ===================================================== */}

      {step === "capture" && (
        <div className="fixed inset-0 bg-black overflow-hidden">
          <video
            ref={liveVideoRef}
            autoPlay
            playsInline
            muted
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              z-0
            "
          />

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          <div className="absolute inset-0 bg-black/20 z-10" />

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              z-30
              flex
              items-center
              justify-between
              px-5
              pt-[max(90px,env(safe-area-inset-top))]
            "
          >
            <button
              type="button"
              onClick={() => {
                stopCamera();

                setStep("prep");

                setCaptureIndex(0);
              }}
              className="
                w-11
                h-11
                rounded-full
                bg-black/40
                backdrop-blur-md
                flex
                items-center
                justify-center
              "
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div
              className="
                px-4
                py-2
                rounded-full
                bg-black/40
                backdrop-blur-md
              "
            >
              <span className="text-white text-sm font-medium">
                {captureIndex + 1}/5
              </span>
            </div>
          </div>

          <div
            className="
              absolute
              inset-0
              z-20
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-8
              pointer-events-none
            "
          >
            <h2
              className="
                text-white
                text-[34px]
                leading-[1.1]
                font-semibold
                max-w-[320px]
              "
            >
              {imageCaptureFlow[captureIndex].title}
            </h2>

            {imageCaptureFlow[captureIndex]
              .helper && (
              <p
                className="
                  mt-4
                  text-white/80
                  text-base
                  leading-relaxed
                  max-w-[260px]
                "
              >
                {
                  imageCaptureFlow[
                    captureIndex
                  ].helper
                }
              </p>
            )}

            {photos[captureIndex] && (
              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-primary-green
                "
              >
                <CheckCircle className="w-5 h-5" />

                <span className="font-medium">
                  Captured
                </span>
              </div>
            )}
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              z-30
              pb-[max(30px,env(safe-area-inset-bottom))]
            "
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handlePhotoCapture}
                className="
                  relative
                  w-[92px]
                  h-[92px]
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  active:scale-95
                  transition-transform
                  cursor-pointer
                "
              >
                <div
                  className="
                    w-[74px]
                    h-[74px]
                    rounded-full
                    border-[6px]
                    border-black
                  "
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();

                  setStep("prep");

                  setCaptureIndex(0);
                }}
                className="
                  mt-6
                  text-white/75
                  text-sm
                  font-medium
                "
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* VIDEO */}
      {/* ===================================================== */}

      {step === "video" && (
        <div className="fixed inset-0 bg-black overflow-hidden">
          <video
            ref={liveVideoRef}
            autoPlay
            playsInline
            muted
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              z-0
            "
          />

          <div className="absolute inset-0 bg-black/20 z-10" />

          <div
            className="
              absolute
              top-0
              left-0
              right-0
              z-30
              flex
              items-center
              justify-between
              px-5
              pt-[max(90px,env(safe-area-inset-top))]
            "
          >
            <button
              type="button"
              onClick={() => {
                stopCamera();

                setStep("prep");

                setCaptureIndex(0);
              }}
              className="
                w-11
                h-11
                rounded-full
                bg-black/40
                backdrop-blur-md
                flex
                items-center
                justify-center
              "
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div
              className="
                px-4
                py-2
                rounded-full
                bg-black/40
                backdrop-blur-md
              "
            >
              <span className="text-white text-sm font-medium">
                {isRecordingVideo
                  ? `${recordingTime}s / 30s`
                  : "Video Proof"}
              </span>
            </div>
          </div>

          <div
            className="
              absolute
              inset-0
              z-20
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-8
              pointer-events-none
            "
          >
            <h2
              className="
                text-white
                text-[34px]
                leading-[1.1]
                font-semibold
                max-w-[320px]
              "
            >
              Record a short proof video
            </h2>

            <p
              className="
                mt-4
                text-white/80
                text-base
                leading-relaxed
                max-w-[260px]
              "
            >
              Slowly show the exact item clearly.
            </p>

            <p
              className="
                mt-2
                text-white/60
                text-sm
              "
            >
              Recommended: 10–30 seconds
            </p>

            {video && (
              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-primary-green
                "
              >
                <CheckCircle className="w-5 h-5" />

                <span className="font-medium">
                  Proof video recorded
                </span>
              </div>
            )}
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              z-30
              pb-[max(30px,env(safe-area-inset-bottom))]
            "
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleVideoCapture}
                className={`
                  relative
                  w-[92px]
                  h-[92px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  active:scale-95
                  transition-transform
                  cursor-pointer
                  ${
                    isRecordingVideo
                      ? "bg-red-500"
                      : "bg-white"
                  }
                `}
              >
                {isRecordingVideo ? (
                  <div
                    className="
                      w-[34px]
                      h-[34px]
                      rounded-[8px]
                      bg-white
                    "
                  />
                ) : (
                  <div
                    className="
                      w-[38px]
                      h-[38px]
                      rounded-full
                      bg-red-500
                    "
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* DETAILS */}
      {/* ===================================================== */}

      {step === "details" && (
        <div className="fixed inset-0 bg-white overflow-hidden">
          <div
            className="
              absolute
              top-0
              left-0
              right-0
              z-20
              flex
              items-center
              px-5
              pt-[max(90px,env(safe-area-inset-top))]
            "
          >
            <button
              type="button"
              onClick={() => setStep("video")}
              className="
                w-11
                h-11
                rounded-full
                bg-black/5
                flex
                items-center
                justify-center
              "
            >
              <ChevronLeft className="w-5 h-5 text-neutral-900" />
            </button>
          </div>

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              justify-center
              px-6
            "
          >
            <div className="w-full">
              <h2
                className="
                  text-[36px]
                  leading-[1.05]
                  font-semibold
                  text-neutral-900
                  max-w-[320px]
                "
              >
                Add item details
              </h2>

              <p
                className="
                  mt-4
                  text-neutral-600
                  text-base
                  leading-relaxed
                  max-w-[300px]
                "
              >
                Add the exact item shown in the proof.
              </p>

              <div className="mt-12">
                <input
                  {...register("title")}
                  placeholder="e.g. Adidas ZX 8000 Light Aqua (Size 10)"
                  className="
                    w-full
                    h-[60px]
                    px-5
                    rounded-[18px]
                    bg-neutral-100
                    border
                    border-neutral-200
                    text-neutral-900
                    placeholder:text-neutral-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-blue
                    text-base
                  "
                />

                {errors.title && (
                  <p className="mt-3 text-danger text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                {!showPriceField ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPriceField(true)
                    }
                    className="
                      text-primary-blue
                      text-sm
                      font-medium
                    "
                  >
                    + Add price (optional)
                  </button>
                ) : (
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      placeholder="Price (₦)"
                      className="
                        w-full
                        h-[60px]
                        px-5
                        rounded-[18px]
                        bg-neutral-100
                        border
                        border-neutral-200
                        text-neutral-900
                        placeholder:text-neutral-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary-blue
                        text-base
                      "
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              z-20
              px-6
              pb-[max(24px,env(safe-area-inset-bottom))]
            "
          >
            <button
              type="button"
              onClick={handleDetailsContinue}
              className="
                w-full
                h-[58px]
                rounded-[18px]
                bg-primary-blue
                text-white
                font-semibold
                text-base
                active:scale-[0.98]
                transition-transform
              "
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ===================================================== */}
{/* REVIEW */}
{/* ===================================================== */}

{step === "review" && (
  <div className="fixed inset-0 bg-white overflow-hidden">

    {/* TOP BAR */}
    <div
      className="
        absolute
        top-0
        left-0
        right-0
        z-20
        flex
        items-center
        px-5
        pt-[max(90px,env(safe-area-inset-top))]
      "
    >
      <button
        type="button"
        onClick={() => setStep("details")}
        className="
          w-11
          h-11
          rounded-full
          bg-black/5
          flex
          items-center
          justify-center
        "
      >
        <ChevronLeft className="w-5 h-5 text-neutral-900" />
      </button>
    </div>

    {/* CONTENT */}
    <div
      className="
        absolute
        inset-0
        overflow-y-auto
        px-6
        pt-[110px]
        pb-[170px]
      "
    >
      {/* HEADER */}
      <div>
        <h2
          className="
            text-[36px]
            leading-[1.05]
            font-semibold
            text-neutral-900
            max-w-[320px]
          "
        >
          Your proof is ready
        </h2>

        <p
          className="
            mt-4
            text-neutral-600
            text-base
            leading-relaxed
            max-w-[300px]
          "
        >
          Review your proof before generating the verification link.
        </p>
      </div>

      {/* PHOTOS */}
      <div className="grid grid-cols-2 gap-4 mt-10">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="
              aspect-square
              rounded-[24px]
              overflow-hidden
              bg-neutral-100
            "
          >
            <img
              src={URL.createObjectURL(photo)}
              alt={`Proof ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* VIDEO */}
      {video && (
        <div
          className="
            mt-6
            rounded-[24px]
            bg-neutral-100
            p-5
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-primary-blue/10
              flex
              items-center
              justify-center
            "
          >
            <Video className="w-5 h-5 text-primary-blue" />
          </div>

          <div className="min-w-0">
            <p className="font-medium text-neutral-900">
              Proof video ready
            </p>

            <p className="text-sm text-neutral-500 truncate">
              {video.name}
            </p>
          </div>
        </div>
      )}

      {/* STATUS */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 text-sm">
            Photos
          </span>

          <span className="text-primary-green text-sm font-medium">
            {photos.length}/5 ready
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-600 text-sm">
            Video
          </span>

          <span className="text-primary-green text-sm font-medium">
            Ready
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-600 text-sm">
            Item details
          </span>

          <span className="text-primary-green text-sm font-medium">
            Ready
          </span>
        </div>
      </div>
    </div>

    {/* CTA AREA */}
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        z-20
        px-6
        pb-[max(24px,env(safe-area-inset-bottom))]
        bg-white
      "
    >
      <div className="space-y-3">

        {/* RETAKE BUTTON */}
        <button
          type="button"
          onClick={() => {
            setCaptureIndex(0);
            setStep("capture");

            setTimeout(() => {
              startPhotoCamera();
            }, 300);
          }}
          className="
            w-full
            h-[56px]
            rounded-[18px]
            bg-neutral-100
            text-neutral-900
            font-semibold
            text-base
            active:scale-[0.98]
            transition-transform
          "
        >
          Retake Proof
        </button>

        {/* GENERATE BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full
            h-[58px]
            rounded-[18px]
            font-semibold
            text-base
            text-white
            active:scale-[0.98]
            transition-transform
            ${
              isLoading
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-primary-blue"
            }
          `}
        >
          {isLoading
            ? "Generating verification link..."
            : "Generate Verification Link"}
        </button>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div
          className="
            mt-4
            rounded-[20px]
            bg-neutral-100
            p-5
          "
        >
          <p className="text-sm text-neutral-700">
            We’re generating your verification link and processing your proof.
          </p>

          <p className="text-xs text-neutral-500 mt-2">
            This may take a few seconds depending on your media size.
          </p>

          {showSlowMessage && (
            <p className="text-xs text-neutral-500 mt-3">
              Still working — larger media can take a little longer.
            </p>
          )}
        </div>
      )}
    </div>
  </div>
)}
    </form>
  );
};
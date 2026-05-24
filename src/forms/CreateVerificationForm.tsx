import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { set, get, del } from "idb-keyval";
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
import cameraPermissionIllustration from "@/assets/camera-permission.png";
import cameraPermissionIllustrationContext from "@/assets/camera-permission-context.png";
import manualProofFallbackIllustration from "@/assets/manual-proof-fallback.png";
import manualProofGuideIllustration from "@/assets/manual-proof-guide.png";

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

const manualProofFlow = [
  {
    title: "Show the front side",
    button: "+ Select Front Photo",
  },
  {
    title: "Turn to the back side",
    button: "+ Select Back Photo",
  },
  {
    title: "Show important details",
    button: "+ Select Detail Photo",
  },
  {
    title: "Show the left side",
    button: "+ Select Left Side Photo",
  },
  {
    title: "Show the right side",
    button: "+ Select Right Side Photo",
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
  const navigate = useNavigate();
 const [step, setStep] = useState<
  | "prep"
  | "permission"
  | "fallback"
  | "manual-capture"
  | "manual-video"
  | "capture"
  | "video"
  | "details"
  | "review"
>("prep");

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [captureIndex, setCaptureIndex] =
    useState(0);

  const [isManualFlow, setIsManualFlow] =
    useState(false);

  const [hasHydrated, setHasHydrated] =
    useState(false);

  const [showPriceField, setShowPriceField] =
    useState(false);

  const [showSlowMessage, setShowSlowMessage] =
    useState(false);

  const [isRecordingVideo, setIsRecordingVideo] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);
  
  const [cameraError, setCameraError] =
    useState("");
  
  const liveVideoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const manualFileInputRef =
    useRef<HTMLInputElement>(null);
  const manualVideoInputRef =
    useRef<HTMLInputElement>(null);

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
  if (!hasHydrated) return;

  localStorage.setItem(
    "visibuy-proof-state",
    JSON.stringify({
      step,
      captureIndex,
      isManualFlow,
    })
  );
}, [
  step,
  captureIndex,
  isManualFlow,
  hasHydrated,
]);

useEffect(() => {
  const restoreState = async () => {
    const savedState =
      localStorage.getItem(
        "visibuy-proof-state"
      );

    if (!savedState) {
      setHasHydrated(true);
      return;
    }

    try {
      const parsed =
        JSON.parse(savedState);

      if (
        parsed.step === "manual-capture" ||
        parsed.step === "manual-video" ||
        parsed.step === "details" ||
        parsed.step === "review"
      ) {
        setStep(parsed.step);
      }

      if (
        typeof parsed.captureIndex ===
        "number"
      ) {
        setCaptureIndex(
          parsed.captureIndex
        );
      }

      if (
        typeof parsed.isManualFlow ===
        "boolean"
      ) {
        setIsManualFlow(
          parsed.isManualFlow
        );
      }

      const savedPhotos = await get(
        "visibuy-manual-photos"
      );

      const savedVideo = await get(
        "visibuy-manual-video"
      );

      if (savedPhotos) {
        setValue(
          "photos",
          savedPhotos
        );
      }

      if (savedVideo) {
        setValue(
          "video",
          savedVideo
        );
      }
    } catch (error) {
      console.error(error);
    }

    setHasHydrated(true);
  };

  restoreState();
}, []);



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

    videoElement.defaultMuted = true;
    videoElement.muted = true;

    await videoElement.play();
  };

  const startPhotoCamera = async () => {
    try {
      stopCamera();
      setCameraError("");
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
      localStorage.setItem(
        "visibuy-camera-context-seen",
        "true"
      );
    } catch (error) {
      console.error(error);
      stopCamera();

      setStep("fallback");
    }
  };

  const startVideoCamera = async () => {
    try {
      stopCamera();
      setCameraError("");
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
      localStorage.setItem(
        "visibuy-camera-context-seen",
        "true"
      );
    } catch (error) {
      console.error(error);
      stopCamera();

      setStep("fallback");
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
            setTimeout(async () => {
              await startVideoCamera();
            }, 100);
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

  const handleManualPhotoUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const currentPhotos =
    watch("photos") || [];

  const updatedPhotos = [
    ...currentPhotos.slice(-4),
    file,
  ];

  setValue("photos", updatedPhotos, {
    shouldValidate: isSubmitted,
  });

  await set(
    "visibuy-manual-photos",
    updatedPhotos
  );

  if (captureIndex < 4) {
    setCaptureIndex((prev) => prev + 1);
  } else {
    setStep("manual-video");
  }

  event.target.value = "";
};

  const handleManualVideoUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setValue("video", file, {
    shouldValidate: true,
  });

  await set(
    "visibuy-manual-video",
    file
  );

  setStep("details");
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

      await set(
        "visibuy-manual-video",
        file
      );

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
  
  if (!hasHydrated) {
    return null;
  }

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
              px-6
              pb-[max(24px,env(safe-area-inset-bottom))]
            "
          >
            <div
              className="
                mb-4
                rounded-[24px]
                bg-white/78
                backdrop-blur-[14px]
                border
                border-black/5
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                px-5
                py-4
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="
                      text-[13px]
                      font-medium
                      text-neutral-500
                    "
                  >
                    Verification Pricing
                  </p>

                  <p
                    className="
                      mt-1
                      text-[17px]
                      leading-tight
                      font-semibold
                      text-neutral-900
                    "
                  >
                    1 verification link = 3 credits
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-neutral-500
                    "
                  >
                    Packs start from ₦5,000
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/billings")}
                  className="
                    shrink-0
                    h-[38px]
                    px-4
                    rounded-full
                    bg-primary-blue/10
                    text-primary-blue
                    text-sm
                    font-medium
                  "
                >
                  See Pricing
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {

                const hasSeenPermissionContext =
                  localStorage.getItem(
                    "visibuy-camera-context-seen"
                  );

                if (!hasSeenPermissionContext) {
                  setStep("permission");
                } else {
                  setStep("capture");

                  setTimeout(async () => {
                    await startPhotoCamera();
                  }, 50);
}
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
              Start Proving
            </button>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* CAMERA PERMISSION CONTEXT */}
      {/* ===================================================== */}

      {step === "permission" && (
        <div className="fixed inset-0 bg-white overflow-hidden">

          {/* ILLUSTRATION */}
          {/* ILLUSTRATION */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={cameraPermissionIllustrationContext}
              alt="Camera permission context"
              className="
                w-full
                h-full
                object-contain
                pointer-events-none
                select-none
              "
            />
          </div>

          {/* CTA */}
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
              onClick={async () => {


                setStep("capture");

                setTimeout(async () => {
                  await startPhotoCamera();
                }, 50);
              }}
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
              Continue to Allow Camera
            </button>
          </div>
        </div>
      )}

      {/* ===================================================== */}
{/* MANUAL PROOF FALLBACK */}
{/* ===================================================== */}

{step === "fallback" && (
  <div className="fixed inset-0 bg-white overflow-hidden">

    {/* ILLUSTRATION */}
    <div className="absolute inset-0">
      <img
        src={manualProofFallbackIllustration}
        alt="Manual proof fallback"
        className="
          w-full
          h-full
          object-cover
          object-top
          pointer-events-none
          select-none
        "
      />
      <div
  className="
    absolute
    inset-x-0
    bottom-0
    h-[55%]
    bg-gradient-to-t
    from-white
    via-white/82
    to-transparent
  "
/>
    </div>

    {/* CONTENT */}
    <div
      className="
        absolute
        bottom-[84px]
        left-0
        right-0
        z-20
        px-6
      "
    >
      <div
        className="
          bg-white/52
          backdrop-blur-[6px]
          rounded-[32px]
          px-5
          py-6
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        "
      >
      <h2
        className="
          text-[34px]
          leading-[1.08]
          font-semibold
          text-neutral-900
          text-center
        "
      >
        Couldn’t connect to your camera
      </h2>

      <p
        className="
          mt-4
          text-neutral-600
          text-base
          leading-relaxed
          text-center
          max-w-[320px]
          mx-auto
        "
      >
        Use your phone camera app to capture the proof,
        then return here to complete verification.
      </p>

      <div
        className="
          mt-6
          flex
          gap-3
          overflow-x-auto
          scrollbar-hide
          pb-1
        "
      >
        {[
            {
              label: "Front side",
              active: true,
            },
            {
              label: "Back side",
              active: true,
            },
            {
              label: "Important details",
              active: true,
            },
            {
              label: "Left side",
              active: true,
            },
            {
              label: "Right side",
              active: true,
            },
            {
              label: "Short proof video",
              active: true,
            },
          ].map((item) => (
          <div
            key={item.label}
            className={`
                          h-[42px]
                          px-5
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-[13px]
                          font-medium
                          ${
                            item.active
                              ? "bg-primary-blue/10 text-primary-blue border border-primary-blue/20"
                              : "bg-neutral-100/95 text-neutral-700"
                          }
                        `}
          >
            {item.label}
          </div>
        ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        z-30
        px-6
        pb-[max(24px,env(safe-area-inset-bottom))]
      "
    >
      <button
        type="button"
        onClick={() => {
          setIsManualFlow(true);
          setStep("manual-capture");
        }}
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
        I’ve Captured the Proof
      </button>
    </div>
  </div>
)}

{/* ===================================================== */}
{/* MANUAL CAPTURE */}
{/* ===================================================== */}

{step === "manual-capture" && (
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
        justify-between
        px-5
        pt-[max(90px,env(safe-area-inset-top))]
      "
    >
      <button
        type="button"
        onClick={() => setStep("fallback")}
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

      <div
        className="
          px-4
          py-2
          rounded-full
          bg-neutral-100
        "
      >
        <span className="text-sm font-medium text-neutral-700">
          {captureIndex + 1}/5
        </span>
      </div>
    </div>

    {/* CONTENT */}
    <div
      className="
        absolute
        inset-0
        flex
        flex-col
        items-center
        justify-center
        px-6
        pt-[120px]
        pb-[150px]
      "
    >

      {/* GUIDE ILLUSTRATION */}
      <div
        className="
          relative
          w-full
          max-w-[320px]
          max-h-[46vh]
        "
      >
        <img
          src={manualProofGuideIllustration}
          alt="Manual proof guide"
          className="
            w-full
            h-full
            object-scale-down
            pointer-events-none
            select-none
          "
        />

        {/* SVG OVERLAYS WILL GO HERE */}
        <svg
  viewBox="0 0 300 500"
  className="
    absolute
    inset-0
    w-full
    h-full
    pointer-events-none
  "
>

  {/* FRONT */}
  {captureIndex === 0 && (
    <rect
      x="40"
      y="90"
      width="220"
      height="300"
      rx="32"
      fill="none"
      stroke="#007BFF"
      strokeWidth="4"
      strokeDasharray="10 10"
      opacity="0.9"
    />
  )}

  {/* BACK */}
  {captureIndex === 1 && (
    <>
      <rect
        x="40"
        y="90"
        width="220"
        height="300"
        rx="32"
        fill="none"
        stroke="#007BFF"
        strokeWidth="4"
        opacity="0.9"
      />

      <path
        d="M220 140 C255 170 255 260 220 300"
        fill="none"
        stroke="#007BFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <polygon
        points="210,300 230,300 220,320"
        fill="#007BFF"
      />
    </>
  )}

  {/* DETAILS */}
  {captureIndex === 2 && (
    <>
      <circle
        cx="120"
        cy="180"
        r="22"
        fill="none"
        stroke="#007BFF"
        strokeWidth="4"
      />

      <circle
        cx="190"
        cy="260"
        r="18"
        fill="none"
        stroke="#007BFF"
        strokeWidth="4"
      />

      <line
        x1="120"
        y1="202"
        x2="120"
        y2="240"
        stroke="#007BFF"
        strokeWidth="3"
      />

      <line
        x1="190"
        y1="278"
        x2="190"
        y2="320"
        stroke="#007BFF"
        strokeWidth="3"
      />
    </>
  )}

  {/* LEFT */}
  {captureIndex === 3 && (
    <path
      d="M220 250 H100"
      fill="none"
      stroke="#007BFF"
      strokeWidth="6"
      strokeLinecap="round"
    />
  )}

  {/* RIGHT */}
  {captureIndex === 4 && (
    <path
      d="M100 250 H220"
      fill="none"
      stroke="#007BFF"
      strokeWidth="6"
      strokeLinecap="round"
    />
  )}
</svg>
      </div>

      {/* TITLE */}
      <h2
        className="
          mt-5
          text-[clamp(26px,5vw,32px)]
          leading-[1.08]
          font-semibold
          text-neutral-900
          text-center
          max-w-[320px]
        "
      >
        {manualProofFlow[captureIndex].title}
      </h2>

    </div>

    {/* CTA */}
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
        onClick={() => {
          manualFileInputRef.current?.click();
        }}
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
        {manualProofFlow[captureIndex].button}
      </button>

      <input
        ref={manualFileInputRef}
        type="file"
        accept="image/*"
        // capture="environment"
        onChange={handleManualPhotoUpload}
        className="hidden"
      />
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
                disabled={!!cameraError}
                className={`
                  relative
                  w-[92px]
                  h-[92px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  ${
                    cameraError
                      ? "bg-white/40 opacity-40 pointer-events-none"
                      : "bg-white active:scale-95 cursor-pointer"
                  }
                `}
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
{/* MANUAL VIDEO */}
{/* ===================================================== */}

{step === "manual-video" && (
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
        justify-between
        px-5
        pt-[max(90px,env(safe-area-inset-top))]
      "
    >
      <button
        type="button"
        onClick={() =>
          setStep("manual-capture")
        }
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

      <div
        className="
          px-4
          py-2
          rounded-full
          bg-neutral-100
        "
      >
        <span className="text-sm font-medium text-neutral-700">
          Video Proof
        </span>
      </div>
    </div>

    {/* CONTENT */}
    <div
      className="
        absolute
        inset-0
        flex
        flex-col
        items-center
        justify-center
        px-6
      "
    >

      {/* GUIDE ILLUSTRATION */}
      <div
        className="
          relative
          w-full
          max-w-[320px]
          max-h-[46vh]
        "
      >
        <img
          src={manualProofGuideIllustration}
          alt="Manual video proof"
          className="
            w-full
            h-full
            object-scale-down
            pointer-events-none
            select-none
          "
        />
      </div>

      <h2
        className="
          mt-5
          text-[clamp(26px,5vw,32px)]
          leading-[1.08]
          font-semibold
          text-neutral-900
          text-center
          max-w-[320px]
        "
      >
        Record a short proof video
      </h2>

      <p
        className="
          mt-4
          text-neutral-600
          text-base
          leading-relaxed
          text-center
          max-w-[300px]
        "
      >
        Slowly show the exact item clearly using your phone camera app.
      </p>

    </div>

    {/* CTA */}
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
        onClick={() => {
          manualVideoInputRef.current?.click();
        }}
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
        Add Proof Video
      </button>

      <input
        ref={manualVideoInputRef}
        type="file"
        accept="video/*"
        // capture="environment"
        onChange={handleManualVideoUpload}
        className="hidden"
      />
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
                disabled={!!cameraError}
                className={`
                  relative
                  w-[92px]
                  h-[92px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  ${
                    cameraError
                      ? "bg-white/20 opacity-40 pointer-events-none"
                      : isRecordingVideo
                      ? "bg-red-500 active:scale-95 cursor-pointer"
                      : "bg-white active:scale-95 cursor-pointer"
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
              onClick={() => {
                if (isManualFlow) {
                  setStep("manual-video");
                } else {
                  setStep("video");
                }
              }}
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
          onClick={async () => {
            await del(
                        "visibuy-manual-photos"
                      );

                      await del(
                        "visibuy-manual-video"
                      );

                      setValue("photos", []);
                      setValue("video", undefined);
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

        <div
          className="
            rounded-[22px]
            bg-neutral-100
            border
            border-black/[0.04]
            px-5
            py-4
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="
                  text-[13px]
                  font-medium
                  text-neutral-500
                "
              >
                Verification Link
              </p>

              <p
                className="
                  mt-1
                  text-[16px]
                  leading-tight
                  font-semibold
                  text-neutral-900
                "
              >
                This proof uses 3 credits
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Credit packs start from ₦5,000
              </p>
            </div>
          </div>
        </div>

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
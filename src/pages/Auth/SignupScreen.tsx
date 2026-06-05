import React, {
  useState,
  useEffect,
} from "react";

import {
  Form,
  Input,
  Button,
  Spin,
  notification,
  Checkbox,
  Carousel,
} from "antd";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  MessageCircle,
} from "lucide-react";

import { isValidPhoneNumber } from "react-phone-number-input";

import Logo from "../../public/images/VisiBuy - Colored 1.png";

import PhoneVerification from "../../public/images/PhoneVerification.png";
import SneakerVerification from "../../public/images/SneakerVerification.png";
import HerbVerification from "../../public/images/HerbVerification.png";

import { useRegisterMutation } from "@/features/auth/authApi";

import { SignupFormValues } from "@/types/types";

import { PhoneInputField } from "@/shared/components/ui/PhoneInputField";

const SignupScreen = () => {

  const [register, { isLoading }] =
    useRegisterMutation();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [api, contextHolder] =
    notification.useNotification();

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [paymentSuccessful, setPaymentSuccessful] =
    useState(false);

  const [showBankDetails, setShowBankDetails] =
    useState(false);

  const [price, setPrice] = useState(1500);

  const checkoutRef =
    React.useRef<HTMLDivElement | null>(null);

  const bankDetailsRef =
    React.useRef<HTMLDivElement | null>(null);

  const proofIntent =
    localStorage.getItem(
      "visibuy-proof-intent"
    );

  const hasRecentProofIntent =
    proofIntent &&
    Date.now() -
      Number(proofIntent) <
        1000 * 60 * 60;

  useEffect(() => {

    if (hasRecentProofIntent) {
      navigate("/verifications/create");
    }

  }, [hasRecentProofIntent, navigate]);

  useEffect(() => {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const urlPrice = params.get("price");

  if (urlPrice) {
    setPrice(Number(urlPrice));
  }

  const paid =
    params.get("paid");

  if (paid === "true") {

    setPaymentSuccessful(true);

    window.fbq?.(
      "track",
      "Purchase",
      {
        value: Number(urlPrice || 1500),
        currency: "NGN",
      }
    );

  }

}, []);

const formattedPrice = `₦${price.toLocaleString()}`;

  const showSuccessNotification = (
    name: string
  ) => {
    api.success({
      message: (
        <span className="font-semibold text-green-900">
          Welcome aboard!
        </span>
      ),
      description: `Welcome ${name}! Redirecting...`,
      placement: "topRight",
      icon: (
        <CheckCircleOutlined className="text-green-500" />
      ),
      duration: 3,
    });
  };

  const showErrorNotification = (
    errorMessage: string
  ) => {
    api.error({
      message: (
        <span className="font-semibold text-red-900">
          Registration Failed
        </span>
      ),
      description: errorMessage,
      placement: "topRight",
      icon: (
        <CloseCircleOutlined className="text-red-500" />
      ),
      duration: 4,
    });
  };

  const showCopiedNotification = (
    label: string
  ) => {

    api.success({
      message: "Copied",
      description: `${label} copied successfully.`,
      placement: "topRight",
      duration: 2,
    });

  };

  const onFinish = async (
    values: SignupFormValues
  ) => {

    try {

      await register({
        name: "Visibuy Seller",
        email: values.email,
        phone: values.phone,
        password: values.password,
      }).unwrap();

      localStorage.setItem(
        "visibuy-proof-intent",
        Date.now().toString()
      );

      showSuccessNotification(
        "Visibuy Seller"
      );

      setTimeout(() => {
        navigate("/verifications/create");
      }, 2000);

    } catch (err: any) {

      let errorMsg =
        "Registration failed.";

      if (err?.data?.message) {
        errorMsg = err.data.message;
      }

      showErrorNotification(errorMsg);

    }

  };

  const loadingIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#28A745",
      }}
      spin
    />
  );

  return (

    <div className="min-h-screen bg-white">

      {contextHolder}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4">

            <Spin
              indicator={loadingIcon}
              size="large"
            />

            <p className="text-gray-700 font-semibold">
              Creating your account...
            </p>

          </div>

        </div>
      )}

      {/* HERO SECTION */}

      <section className="w-full px-6 md:px-10 pt-10 pb-14">

        <div className="max-w-[1200px] mx-auto">

          {/* LOGO */}

          <div className="flex justify-center mb-10">

            <img
              src={Logo}
              loading="lazy"
              alt="logo"
              className="h-5 md:h-6"
            />

          </div>

          {/* HOOK */}

          <div className="text-center max-w-[900px] mx-auto">

           <h1
              className="
                text-[44px]
                leading-[1]
                md:text-[82px]
                font-bold
                tracking-[-4px]
                text-center
              "
            >
              <span className="text-black">
                Turn "How Much?"
              </span>

              <br />

              <span className="text-[#007BFF]">
                Into Sales
              </span>
            </h1>

            <p
              className="
                mt-6
                text-[20px]
                md:text-[30px]
                leading-tight
                font-medium
                text-gray-700
              "
            >
              Buyers ask questions.
              <br />
              Then disappear before payment.
            </p>


          </div>

          {/* HERO IMAGE */}

          <div className="mt-14 max-w-[700px] lg:max-w-[800px] mx-auto">

            <Carousel
              autoplay
              dots
              className="mt-14"
            >
              <div>
                <img
                  src={PhoneVerification}
                  alt="Phone Verification"
                  className="
                    w-full
                    max-w-[1050px]
                    mx-auto
                    rounded-[40px]
                  "
                />
              </div>

              <div>
                <img
                  src={SneakerVerification}
                  alt="Sneaker Verification"
                  className="
                    w-full
                    max-w-[1050px]
                    mx-auto
                    rounded-[40px]
                  "
                />
              </div>

              <div>
                <img
                  src={HerbVerification}
                  alt="Herb Verification"
                  className="
                    w-full
                    max-w-[1050px]
                    mx-auto
                    rounded-[40px]
                  "
                />
              </div>
            </Carousel>

          </div>

          {/* OFFER CARD */}

          <div
            className="
              mt-14
              max-w-[760px]
              mx-auto
              bg-white
              border
              border-gray-200
              rounded-[32px]
              p-8
              shadow-[0_10px_50px_rgba(0,0,0,0.06)]
            "
          >

            <div className="text-center">

              <h3
                className="
                  text-4xl
                  md:text-5xl
                  font-bold
                  tracking-[-2px]
                  text-black
                "
              >
                Close Your Next Sale
                <br />
                Get Started For {formattedPrice}
              </h3>

              <p
                className="
                  mt-4
                  text-xl
                  text-gray-700
                  font-medium
                "
              >
                Prove the exact item before asking for payment.
              </p>

            </div>

            {/* CTA */}

            <Button
              type="primary"
              onClick={() => {

                setShowCheckout(true);

                setTimeout(() => {

                  checkoutRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });

                }, 100);

              }}
              className="
                mt-8
                h-[64px]
                rounded-2xl
                w-full
                bg-[#007BFF]
                border-[#007BFF]
                hover:!bg-blue-600
                hover:!border-blue-600
                text-[22px]
                font-semibold
                shadow-lg
              "
            >
              Close Your Next Sale
            </Button>

            <p
              className="
                mt-4
                text-center
                text-sm
                text-gray-500
              "
            >
              Prove the exact item before payment.
            </p>

          </div>

          {/* TRUST STACK */}

          <div
            className="
              mt-10
              flex
              flex-col
              md:flex-row
              items-center
              justify-center
              gap-6
              text-sm
              text-gray-600
            "
          >

            <div>
              ✓ Turn buyer interest into payment
            </div>

            <div>
              ✓ Share proof of the exact item
            </div>

            <div>
              ✓ Stop repeating photos and videos
            </div>

          </div>

          {/* CHECKOUT */}

          {showCheckout && !paymentSuccessful && (

            <div
              ref={checkoutRef}
              className="
                mt-16
                max-w-[560px]
                mx-auto
                bg-white
                border
                border-gray-200
                rounded-[28px]
                p-8
                shadow-[0_10px_50px_rgba(0,0,0,0.08)]
                animate-fade-in
              "
            >

              <div className="text-center">

                <h3
                  className="
                    text-4xl
                    font-bold
                    tracking-[-2px]
                    text-black
                  "
                >
                  Stop Losing Buyers Before Payment
                </h3>

                <p
                  className="
                    mt-4
                    text-lg
                    text-gray-600
                    leading-relaxed
                  "
                >
                  Prove the exact item before asking for payment.
                </p>
                <div
                  className="
                    mt-8
                    bg-[#F8FAFF]
                    border
                    border-[#DCE8FF]
                    rounded-[24px]
                    p-6
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xl
                          font-bold
                          text-black
                        "
                      >
                        Close Your Next Sale
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-gray-500
                        "
                      >
                        Help buyers feel confident enough to pay.
                      </p>

                    </div>

                    <div
                      className="
                        text-3xl
                        font-bold
                        tracking-[-1px]
                        text-[#007BFF]
                      "
                    >
                      {formattedPrice}
                    </div>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    text-gray-500
                  "
                >

                  <LockOutlined />

                  <span>
                    Secure payment powered by Flutterwave
                  </span>

                </div>
                <div
  className="
    mt-6
    bg-gray-50
    border
    border-gray-200
    rounded-2xl
    p-5
  "
>
  <h4 className="font-semibold text-black mb-3">
    What happens after payment?
  </h4>

  <div className="space-y-2 text-sm text-gray-700">
    <div>✓ Create your Visibuy account</div>
    <div>✓ Get 3 product verification credits instantly</div>
    <div>✓ Create your first product verification</div>
    <div>✓ Start sending verification links to buyers</div>
  </div>

  <p className="mt-4 text-xs text-gray-500">
    No subscription. One-time payment.
  </p>
</div>

              </div>

              <Button
                type="primary"
                onClick={() => {

                  window.fbq?.(
                    "track",
                    "InitiateCheckout",
                    {
                      currency: "NGN",
                      value: price,
                    }
                  );


                  setShowBankDetails(true);
                  setTimeout(() => {

                    bankDetailsRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });

                  }, 100);

                }}
                className="
                  mt-8
                  h-[58px]
                  rounded-xl
                  w-full
                  bg-[#28A745]
                  border-[#28A745]
                  hover:!bg-green-600
                  hover:!border-green-600
                  text-lg
                  font-semibold
                "
              >
                Continue to Secure Payment
              </Button>
              {showBankDetails && (

                <div
                  ref={bankDetailsRef}
                  className="
                    mt-6
                    bg-[#F8FAFF]
                    border
                    border-[#DCE8FF]
                    rounded-[24px]
                    p-6
                  "
                >

                  <h4
                    className="
                      text-lg
                      font-semibold
                      text-black
                    "
                  >
                    Bank Transfer powered by Flutterwave
                  </h4>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-600
                    "
                  >
                    Complete your payment using the
                    Flutterwave account details below.
                  </p>

                  <div className="mt-6 space-y-4">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        border
                        rounded-xl
                        p-4
                      "
                    >
                      <div>
                        <p className="text-xs text-gray-500">
                          BANK_NAME
                        </p>

                        <p className="font-semibold">
                          Wema Bank PLC
                        </p>
                      </div>

                      <Button
                        size="small"
                        onClick={() => {

                          navigator.clipboard.writeText(
                            "Wema Bank PLC"
                          );

                          showCopiedNotification(
                            "Wema Bank PLC"
                          );

                        }}
                      >
                        Copy
                      </Button>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        border
                        rounded-xl
                        p-4
                      "
                    >
                      <div>
                        <p className="text-xs text-gray-500">
                          ACCOUNT_NAME
                        </p>

                        <p className="font-semibold">
                          Flutterwave/Visibuy Technology Limited
                        </p>
                      </div>

                      <Button
                        size="small"
                        onClick={() => {

                        navigator.clipboard.writeText(
                          "Flutterwave/Visibuy Technology Limited"
                        );

                        showCopiedNotification(
                          "Flutterwave/Visibuy Technology Limited"
                        );

                      }}
                      >
                        Copy
                      </Button>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        border
                        rounded-xl
                        p-4
                      "
                    >
                      <div>
                        <p className="text-xs text-gray-500">
                          ACCOUNT_NUMBER
                        </p>

                        <p className="font-semibold text-lg">
                          9462006308
                        </p>
                      </div>

                      <Button
                        size="small"
                        onClick={() => {

                          navigator.clipboard.writeText(
                            "9462006308"
                          );

                          showCopiedNotification(
                            "9462006308"
                          );

                        }}
                      >
                        Copy
                      </Button>
                    </div>

                </div>
                <Button
                  type="primary"
                  className="
                    mt-5
                    w-full
                    h-[56px]
                    rounded-xl
                    bg-[#25D366]
                    border-[#25D366]
                    hover:!bg-[#20ba5a]
                    hover:!border-[#20ba5a]
                    text-base
                    font-semibold
                  "
                  onClick={() => {

                    window.fbq?.(
                      "trackCustom",
                      "TransferIntent"
                    );

                    const message =
                      encodeURIComponent(
                `Hi Visibuy,

                I have completed payment of ${formattedPrice}.

                Please verify my payment and activate my credits.`
                      );

                    window.open(
                      `https://wa.me/2348061924490?text=${message}`,
                      "_blank"
                    );

                  }}
                >
                  I've Completed My Transfer
                </Button>

                </div>

              )}
              <p
                className="
                  mt-4
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                Instant access after payment.
              </p>
            </div>

          )}

          {/* SIGNUP FORM */}

          {paymentSuccessful && (

            <div
              className="
                mt-16
                max-w-[560px]
                mx-auto
                animate-fade-in
              "
            >

              <div className="text-center mb-8">

                <h2
                  className="
                    text-4xl
                    font-bold
                    tracking-[-2px]
                    text-black
                  "
                >
                  Create your account
                </h2>

                <p
                  className="
                    mt-3
                    text-gray-600
                  "
                >
                  Start sending product verifications buyers feel safer paying after seeing.
                </p>

              </div>

              <Form
                form={form}
                name="signup"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                className="
                  border
                  border-gray-200
                  rounded-[28px]
                  p-8
                  shadow-sm
                  bg-white
                "
              >

                {/* EMAIL */}

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please input your email!",
                    },
                    {
                      type: "email",
                      message:
                        "Please enter a valid email!",
                    },
                  ]}
                >

                  <Input
                    suffix={
                      <MailOutlined />
                    }
                    placeholder="Enter your email"
                    className="h-[56px] rounded-xl"
                  />

                </Form.Item>

                {/* PHONE */}

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please input your phone number!",
                    },
                    {
                      validator(_, value) {

                        if (!value)
                          return Promise.resolve();

                        if (
                          isValidPhoneNumber(value)
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "Invalid phone number."
                          )
                        );

                      },
                    },
                  ]}
                >

                  <PhoneInputField
                    defaultCountry="NG"
                    placeholder="e.g. 801 234 5678"
                    className="w-full"
                  />

                </Form.Item>

                {/* PASSWORD */}

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please input your password!",
                    },
                    {
                      min: 8,
                      message:
                        "Password must be at least 8 characters!",
                    },
                  ]}
                >

                  <Input.Password
                    prefix={
                      <LockOutlined />
                    }
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    iconRender={(visible) =>
                      visible ? (
                        <EyeTwoTone />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                    className="h-[56px] rounded-xl"
                  />

                </Form.Item>

                {/* TERMS */}

                <Form.Item
                  name="consent"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      type: "boolean",
                      message:
                        "You must agree to continue.",
                    },
                  ]}
                >

                  <Checkbox>

                    I agree to the{" "}

                    <Link
                      to="https://visibuy.com.ng/terms"
                      className="text-[#007AFF]"
                    >
                      Terms
                    </Link>

                    {" "}and{" "}

                    <Link
                      to="https://visibuy.com.ng/privacy"
                      className="text-[#007AFF]"
                    >
                      Privacy Policy
                    </Link>

                  </Checkbox>

                </Form.Item>

                {/* SUBMIT */}

                <Form.Item className="mb-0">

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                    className="
                      h-[58px]
                      rounded-xl
                      bg-[#007BFF]
                      border-[#007BFF]
                      hover:!bg-blue-600
                      hover:!border-blue-600
                      text-lg
                      font-semibold
                    "
                  >
                    Access My Verification Links
                  </Button>

                </Form.Item>

              </Form>

              {/* LOGIN */}

              <div className="mt-8 text-center">

                <span className="text-gray-600">
                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="
                      text-[#007BFF]
                      font-medium
                    "
                  >
                    Sign in
                  </Link>

                </span>

              </div>

            </div>

          )}

        </div>

      </section>
      <a
        href="https://wa.me/2348061924490?text=Hi%20Visibuy,%20I%20need%20help%20with%20verification%20links."
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          items-center
          gap-3
          bg-[#25D366]
          hover:bg-[#20ba5a]
          text-white
          px-5
          py-4
          rounded-full
          shadow-2xl
          transition-all
          duration-300
          hover:scale-[1.03]
        "
      >

        <MessageCircle
          className="w-5 h-5"
        />

        <span
          className="
            text-sm
            font-semibold
            hidden
            md:block
          "
        >
          Need help?
        </span>

      </a>
    </div>

  );

};

export default SignupScreen;
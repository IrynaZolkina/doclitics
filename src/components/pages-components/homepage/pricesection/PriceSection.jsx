"use client";
import Image from "next/image";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import CheckIcon from "@/components-svg/CheckIcon";

const priceArray = [
  {
    planName: "Free",
    planNik: "Free",

    planPrice: "0",
    planTitle: "Perfect for trying out Doclitic",
    planList: [
      "3 documents per month",
      "Basic document types",
      "Email support",
    ],
  },
  {
    planName: "Basic",
    planNik: "Basic",
    planPrice: "5",
    planTitle: "Great for individuals and students",
    planList: [
      "15 documents per month",
      "All document types",
      "Advanced output options",
      "Summary delivered in ~30 seconds",
      "Priority email support",
    ],
  },
  {
    planName: "Professional",
    planNik: "Pro",
    planPrice: "15",
    planTitle: "Perfect for professionals and teams",
    planList: [
      "Everything in Starter",
      "75 documents per month",
      "Latest AI models",
      "Custom templates",
      "Highest quality insights",
      "Lightning fast processing",
    ],
  },
  {
    planName: "Max",
    planNik: "Premium",
    planPrice: "40",
    planTitle: "For those who need the power for large scale analysis",
    planList: [
      "Everything in Professional",
      "350 per month",
      "Custom Presets",
      "Priority Summarization",
      "No watermark",
    ],
  },
];

const PriceSection = () => {
  // const router = useRouter();
  const checkout = async (plan, type) => {
    const res = await apiFetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, type }),
    });

    // apiFetch can return undefined
    if (!res) {
      toastSuperFunctionJS("apiFetch failed", "error");
      return;
    }

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      toastSuperFunctionJS(error?.error?.message || "Checkout failed", "error");
      return; // ⛔ STOP
    }

    const json = await res.json();
    const url = json?.data?.url;

    if (!url) {
      toastSuperFunctionJS("No checkout URL returned", "error");
      console.log("Checkout response json:", json);
      return;
    }
    window.location.href = url;
  };

  return (
    <>
      <div className="container">
        <h1>
          Simple, <span>Transparent </span>Pricing
        </h1>
        <p>
          Choose the perfect plan for your needs. Start free, upgrade anytime.
        </p>
        <div className="flexWrapper">
          {priceArray.map((el, ind) => (
            <div key={ind} className="flexAndButton">
              <div className="flexContainer">
                <h4>{el.planName}</h4>
                <p>
                  <span>${el.planPrice}</span> /month
                </p>
                <p>{el.planTitle}</p>

                <ul>
                  {el.planList.map((element, ind) => (
                    <li key={ind}>
                      <CheckIcon />
                      &#160;&#160;&#160; <span> {element}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <button className={styles.button}>Get Started</button> */}
              {/* <Link href="../pages/create-subscription"> */}
              <div className="twoButtons">
                {/* <FlexibleButton
                  variant="tertiary"
                  border
                  padding="11px 44px"
                  fontSize="14px"
                  // onClick={() => router.push("/pages/checkout")}
                  onClick={() => checkout(el.planNik, "one_time")}
                >
                  One-Time Payment
                </FlexibleButton> */}
                <FlexibleButton
                  variant="tertiary"
                  border
                  padding="11px 68px"
                  fontSize="14px"
                  // onClick={() => router.push("/pages/checkout")}
                  onClick={() => checkout(el.planNik, "subscription")}
                >
                  Subscription
                </FlexibleButton>
              </div>
              {/* </Link> */}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--gradient-hero);
          color: var(--text-color-white);
        }
        .container h1 {
          margin-top: 60px;
          font-family: var(--font-inter);
          font-weight: 700;
          font-style: Bold;
          font-size: 47.06px;
          line-height: 48px;
          margin-bottom: 40px;
        }
        .container h1 span {
          color: var(--text-color-blue);
        }
        .container p {
          font-size: 22.13px;
          line-height: 28px;
        }
        .flexWrapper {
          margin-top: 40px;
          gap: 30px;
          display: flex;
        }
        .flexAndButton {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          /* align-items: center; */
          margin-top: 40px;
          margin-bottom: 40px;
          background: rgba(23, 32, 54, 0.8);
          width: 296px;
          height: 550px;
          padding: 20px 15px;
        }
        .flexContainer {
          border-radius: 16px;
          padding: 23px;
          position: relative;
        }
        .flexContainer h4 {
          font-size: 19.38px;
          text-align: center;
          margin-bottom: 30px;
        }
        .flexContainer p {
          font-size: 14.63px;
          line-height: 22px;
          text-align: center;
          margin-bottom: 10px;
        }
        .flexContainer > p > span {
          font-weight: 700;
          font-size: 30px;
          color: var(--text-color-blue);
        }
        .flexContainer ul {
          list-style: none;
          margin-top: 40px;
          margin-bottom: 50px;
        }
        .flexContainer ul li {
          margin-bottom: 20px;
          display: flex;
        }
        .twoButtons {
          display: flex;
          flex-direction: column;
          /* gap: 15px; */
          align-items: center;
        }
      `}</style>{" "}
    </>
  );
};

export default PriceSection;

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "OpenClaw DFW — Your AI Employee, Placed & Managed";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Load the mascot image (PNG with transparent background)
  const mascotData = await fetch(
    new URL("../../public/mascot.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  // Load the Dallas skyline background — smaller size + lower quality to keep filesize down
  const skylineUrl =
    "https://images.unsplash.com/photo-1545194445-dddb8f4487c6?w=1200&q=50";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background: Dallas skyline with dark overlay */}
        <img
          src={skylineUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Lighter overlay to let skyline show through */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "50px 70px 50px 150px",
            position: "relative",
          }}
        >
          {/* Left: Mascot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "280px",
              flexShrink: 0,
            }}
          >
            <img
              src={`data:image/png;base64,${Buffer.from(mascotData).toString("base64")}`}
              alt="OpenClaw mascot"
              style={{
                width: "240px",
                height: "260px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Right: Text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              paddingLeft: "40px",
            }}
          >
            {/* Logo / Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: "20px",
                background: "rgba(0,0,0,0.85)",
                padding: "8px 16px",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                Open
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ef4444",
                  letterSpacing: "-0.02em",
                }}
              >
                Claw
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  marginLeft: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                DFW
              </span>
            </div>

            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  background: "rgba(0,0,0,0.9)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                }}
              >
                Your AI Employee.
              </span>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  color: "#ef4444",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  background: "rgba(0,0,0,0.9)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                }}
              >
                Placed & Managed.
              </span>
            </div>

            {/* Subtitle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "4px",
                marginTop: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#e5e7eb",
                  background: "rgba(0,0,0,0.85)",
                  padding: "6px 14px",
                  borderRadius: "4px",
                }}
              >
                White-glove AI assistant deployment
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#e5e7eb",
                  background: "rgba(0,0,0,0.85)",
                  padding: "6px 14px",
                  borderRadius: "4px",
                }}
              >
                for Dallas/Fort Worth business owners.
              </span>
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                marginTop: "20px",
                background: "#ef4444",
                padding: "12px 28px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                Book Your Free AI Audit →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: "#ef4444",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}

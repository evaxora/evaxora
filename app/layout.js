import "./globals.css";
import Web3Providers from "@/components/Web3Providers";

export const metadata = {
  title: "Evaxora — Evaluator Registry for ERC-8183",
  description: "Discover, track, and register evaluators powering trustless AI agent commerce on ERC-8183. The infrastructure layer for agentic evaluation.",
  keywords: "ERC-8183, evaluator, AI agents, agentic commerce, Web3, Base, trustless",
  openGraph: {
    title: "Evaxora — Evaluator Registry for ERC-8183",
    description: "Discover, track, and register evaluators powering trustless AI agent commerce on ERC-8183.",
    url: "https://evaxora.xyz",
    siteName: "Evaxora",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Evaxora — Evaluator Registry for ERC-8183",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@evaxora_xyz",
    creator: "@evaxora_xyz",
    title: "Evaxora — Evaluator Registry for ERC-8183",
    description: "The evaluation layer for agent commerce. Built on Base.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Providers>
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}

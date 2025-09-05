import { Newsletter } from "@/components/newsletter/news-letter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter - Hunde's Blog",
  description:
    "Subscribe to get the latest posts and coding insights delivered to your inbox",
};
const NewsletterPage = () => {
  return <Newsletter />;
};

export default NewsletterPage;

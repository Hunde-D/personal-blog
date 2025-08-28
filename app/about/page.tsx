import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";

export const metadata = {
  title: "About - Hunde's Blog",
  description:
    "Learn more about Hunde Desalegn, a software engineer passionate about Flutter, React, and building scalable apps.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center lg:items-start">
      <div className="flex-shrink-0">
        <Image
          src="/profile-hunde.png"
          alt="Hunde's profile"
          width={200}
          height={200}
          className="rounded-full w-32 h-32 sm:w-48 sm:h-48 lg:w-52 lg:h-52"
        />
      </div>

      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-balance">
          About Me
        </h1>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
          <p>
            Hi there! I'm <span className="font-semibold">Hunde Desalegn</span>,
            a software engineer passionate about building apps with{" "}
            <strong>Flutter, React, and Next.js</strong>. I enjoy experimenting
            with different architectures, especially{" "}
            <strong>Clean Architecture</strong>, and applying them to both
            mobile and web projects.
          </p>

          <p>
            On the backend side, I’ve worked with{" "}
            <strong>Express, Node.js, and Firestore</strong> to power my apps. I
            like designing APIs that are simple but flexible, and connecting
            them with clean, testable frontends.
          </p>

          <p>
            This blog is my space to share lessons I’ve learned while building
            projects like a <strong>habit tracker app</strong>, a{" "}
            <strong>shoe store with Firestore backend</strong>, and
            experimenting with <strong>Vue</strong> and other frontend
            frameworks.
          </p>

          <p>
            Outside of coding, I’m passionate about productivity and
            self-improvement. I believe small daily habits compound into big
            wins — in life and in code.
          </p>

          <p>
            I started this blog to document my journey, share what I learn, and
            connect with other developers. If you're into Flutter, React, or
            just building cool things on the web, I’d love to connect with you!
          </p>
        </div>
      </div>
    </div>
  );
}

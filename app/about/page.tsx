import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "About - Hunde's Blog",
  description:
    "Learn more about Hunde Desalegn, a software engineer passionate about learning, building, and sharing.",
};

const content = `
# About Me 🙋‍♂️

Hi there! I'm **Hunde Desalegn**, a curious mind who loves turning ideas into reality ✨.  
For me, software engineering is more than code — it’s about solving problems, telling stories through design, and building things that make life just a little bit easier.

---

## 🌱 My Journey  
I’m constantly learning, experimenting, and reflecting along the way.  
What excites me most is:  
- 💡 Breaking down complex problems into simple solutions  
- 🔨 Building projects that challenge me to grow  
- ✍️ Sharing lessons learned to help others on their journey  

---

## 💡 Beyond Work  
> "Small daily habits compound into big wins — in life and in code."  

Outside of my projects, I enjoy activities that help me recharge and spark creativity — whether that’s gaming 🎮, long evening walks 🚶‍♂️, or diving into self-improvement 📖.  

These small routines keep me grounded and inspired.

---

## 🌍 Why This Blog?  
This blog is my space to **document my journey**, stay accountable, and connect with others walking their own path.  

If you’re someone who loves learning, creating, or just exploring new ideas — welcome aboard ☕🚀.
`;

export default function AboutPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center lg:items-start">
      <div className="flex-shrink-0 size-56">
        <Avatar className="size-40 rounded-full">
          <AvatarImage src="/profile.png" />
          <AvatarFallback className="text-lg">HD</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 text-center lg:text-left">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

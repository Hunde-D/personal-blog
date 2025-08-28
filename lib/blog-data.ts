export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "flutter-clean-architecture",
    title: "Why I Chose Clean Architecture for My Flutter Habit Tracker",
    date: "February 20, 2025",
    excerpt:
      "A breakdown of how clean architecture keeps my Flutter projects organized, scalable, and testable.",
    content: `When I first started building my habit tracking app in Flutter, I quickly realized how messy things could get without a proper structure. That's when I decided to embrace **Clean Architecture**.

## Separation of Concerns
Breaking my app into layers (domain, data, presentation) keeps logic isolated and easier to maintain. For example, my Firestore integration lives in the data layer, while Cubits handle state management in the presentation layer.

## Benefits
- Easier unit testing (CartCubit, ThemeCubit, LanguageCubit)
- Flexibility to swap data sources later
- Clear mental model for where code belongs

## Challenges
At first, it felt like "too much" boilerplate. But once features grew, I appreciated how organized everything stayed.

Clean Architecture has been a game-changer in building something that I won’t regret scaling later.

— Hunde`,
  },
  {
    slug: "debugging-flutter-tests",
    title: "Lessons from Writing My First Flutter Tests",
    date: "February 15, 2025",
    excerpt:
      "Testing in Flutter felt intimidating at first, but writing Cubit tests taught me more than I expected.",
    content: `Writing my first set of Flutter tests for **CartCubit** was eye-opening. At first, I wasn't sure if I was testing correctly, but the process taught me a lot.

## The First Roadblock
Missing \`.g.dart\` files gave me headaches until I learned that running build_runner in the right package (not just the root) fixes it.

## Language & Theme Switching Tests
I also wrote tests to ensure the app correctly changes **themes** and **languages**. These were fun because they showed me how small state changes impact the whole UI.

## Key Takeaways
- Start small (one Cubit at a time)
- Don't ignore testing errors—they often reveal broken setup
- Mock only when necessary

Now, testing feels less scary and more like a safety net.

— Hunde`,
  },
  {
    slug: "productivity-tools-for-devs",
    title: "My Favorite Productivity Tools as a Developer",
    date: "February 10, 2025",
    excerpt: "Tools I use daily that make me a faster and happier developer.",
    content: `Over time, I’ve found a stack of tools that I rely on every day as a developer.

## Editor & Extensions
- **VS Code** with Prettier, GitLens, and Error Lens
- **Flutter Intl** for localization handling

## Browser Tools
- **Chrome DevTools** for debugging layouts
- **Lighthouse** for performance checks

## Design & Planning
- **Figma** for UI handoff
- **Notion** for organizing coding notes & debugging tips

Every developer has their own workflow, but these tools have saved me countless hours and reduced frustration.

— Hunde`,
  },
  {
    slug: "slidable-habit-cards",
    title: "Customizing Slidable Habit Cards in Flutter",
    date: "February 6, 2025",
    excerpt:
      "How I implemented slidable habit cards with actions like 'View | Done' and 'Fail | Skip'.",
    content: `One of the fun UI challenges in my habit tracker app was implementing **slidable habit cards** using the \`flutter_slidable\` package.

## Actions That Make Sense
Instead of generic swipe actions, I added:
- Start side: **View | Done**
- End side: **Fail | Skip**

## Styling Challenges
I wanted the actions to look polished, not default. Custom colors, rounded corners, and spacing made the difference.

In the end, this little detail elevated the whole experience.

— Hunde`,
  },
  {
    slug: "firestore-backend",
    title: "Building My Firestore Backend for a Flutter App",
    date: "February 1, 2025",
    excerpt:
      "How I set up Firestore to power my app and an admin panel for adding new data.",
    content: `For my shoe store side project, I decided to use **Firestore** as the backend. It was lightweight, fast, and flexible.

## Setup
- Created collections for shoes
- Built queries for filtering by size, brand, and availability
- Used security rules to keep data safe

## Admin Side
Instead of hardcoding data, I built a simple admin page to add shoes directly to Firestore.

## Lessons Learned
Firestore is great, but structure matters. Planning your collections and indexes early will save a lot of refactoring later.

— Hunde`,
  },
  {
    slug: "react-vs-vue",
    title: "React vs Vue: My Experience with Two Frontend Giants",
    date: "January 25, 2025",
    excerpt:
      "After building projects in both React and Vue, here’s my take on their strengths and weaknesses.",
    content: `I've had the chance to work with both **React** and **Vue** for frontend projects. Each has its own style and philosophy.

## React
- **Strengths:** Huge ecosystem, great community, flexible architecture
- **Weaknesses:** Steeper learning curve, sometimes too many ways to do the same thing

## Vue
- **Strengths:** Simplicity, approachable syntax, great documentation
- **Weaknesses:** Smaller ecosystem, fewer enterprise-scale examples

For me, Vue feels like a "get started fast" framework, while React feels like the safe long-term bet. I still enjoy switching between the two depending on project needs.

— Hunde`,
  },
  {
    slug: "nextjs-ssr",
    title: "Getting Comfortable with Next.js and Server-Side Rendering",
    date: "January 20, 2025",
    excerpt:
      "How I learned to deal with SSR challenges like localStorage and data fetching in Next.js apps.",
    content: `When I first tried **Next.js**, I ran into a common issue: using **localStorage** on the server. It doesn’t exist there!

## Lessons Learned
- Always check whether code runs on the client or server
- Use hooks like \`useEffect\` for anything that depends on browser APIs
- API routes in Next.js are surprisingly powerful for small backend logic

Next.js gave me the best of both worlds: React’s flexibility with built-in SSR and routing. Once I understood the server/client split, it became a go-to choice.

— Hunde`,
  },
  {
    slug: "node-express-api",
    title: "Building a REST API with Node.js and Express",
    date: "January 15, 2025",
    excerpt: "My go-to stack for quick APIs: Node.js with Express.",
    content: `Whenever I need a quick backend, I usually go for **Node.js + Express**.

## Why Express?
- Minimal setup
- Middleware makes it easy to extend
- Large ecosystem of packages

## A Small Gotcha
When I worked with Firebase Admin SDK, I ran into missing typings like \`sendToTopic\`. TypeScript required some extra type definitions.

Even with those bumps, Express remains my favorite tool for spinning up an API fast.

— Hunde`,
  },
  {
    slug: "honeymoon-with-hono",
    title: "Trying Out Hono: A Fast Web Framework for Node",
    date: "January 12, 2025",
    excerpt:
      "I recently experimented with Hono.js and was impressed by its speed and simplicity.",
    content: `I came across **Hono**, a small but fast web framework for Node.js (and Bun/Cloudflare Workers). It reminded me of Express, but lighter.

## Why I Liked It
- Tiny footprint
- Works great with edge runtimes
- Familiar API if you’ve used Express

## Use Case
I wouldn’t replace Express for every project, but for edge-deployed apps or APIs where speed matters, Hono feels like a great fit.

— Hunde`,
  },
];

import { PrismaClient } from "@prisma/client";
import slug from "slug";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  const me = await prisma.user.findUnique({
    where: { email: "hunde.ddh@gmail.com" },
  });

  if (!me) {
    throw new Error("❌ User not found in DB");
  }

  // 2. Blog posts
  const posts = [
    {
      title: "About Me - Hunde’s Developer Journey",
      excerpt:
        "Discover my path as a full-stack developer, diving into React, Next.js, Flutter, and beyond while embracing clean architecture and innovative tech.",
      content: `
# Hi, I'm Hunde!

I'm a full-stack developer with a deep passion for creating seamless, user-friendly applications. My toolkit includes **React** and **Next.js** for dynamic frontends, **Vue.js** for lightweight interfaces, **Express.js** for robust backends, and **Flutter** for cross-platform mobile apps.

## My Journey
It all started with simple HTML pages back in college, but I quickly fell in love with JavaScript ecosystems. Over the years, I've built everything from habit-tracking apps to e-commerce platforms, always focusing on scalability and maintainability.

## What I Love
- Exploring clean architecture to keep code organized and testable.
- Experimenting with new tools like Prisma for database management and Supabase for real-time features.
- Sharing insights through blogging to help fellow developers avoid common pitfalls.

Outside of coding, you'll find me hiking, reading sci-fi, or tinkering with AI projects. Let's connect and build something amazing!
      `,
    },
    {
      title: "Frontend vs Backend: Finding the Balance",
      excerpt:
        "A personal take on juggling frontend magic with React, Vue, and Next.js alongside backend stability using Express and Prisma.",
      content: `
# Frontend vs Backend: My Perspective

As a full-stack dev, I often navigate the divide between frontend and backend worlds. It's like being a chef who handles both the presentation and the ingredients—each side is crucial for a great meal.

## The Frontend Thrill
Frontend development is all about crafting intuitive user experiences. With **React**, I build reusable components that make apps feel alive. **Next.js** takes it further with server-side rendering for blazing-fast performance, and **Vue.js** shines in simpler, reactive UIs.

- Pros: Immediate visual feedback, creative freedom in design.
- Cons: Browser compatibility issues and state management headaches.

## The Backend Backbone
On the flip side, backend work ensures everything runs smoothly behind the scenes. Using **Express.js**, I create APIs that handle data efficiently, paired with **Prisma** for ORM magic and **Supabase** for authentication.

- Pros: Focus on logic, security, and scalability.
- Cons: Debugging can be tricky without direct user interaction.

## Bringing It Together
The real magic happens in full-stack integration. In my recent projects, I've used clean architecture to decouple layers, making maintenance a breeze. If you're starting out, experiment with both—it's rewarding!

What’s your favorite stack? Share in the comments!
      `,
    },
    {
      title: "Mastering Clean Architecture in Flutter",
      excerpt:
        "Structuring Flutter apps for long-term success: separating concerns for better testing and scalability.",
      content: `
# Clean Architecture in Flutter: My Go-To Approach

Flutter has revolutionized mobile development, but without proper structure, apps can become messy. That's where clean architecture comes in—it's saved me countless hours on my habit-tracking app.

## Why Clean Architecture?
It divides your app into layers: 
- **Entities**: Core business models (e.g., Habit, Mood).
- **Use Cases**: Business logic (e.g., track streak).
- **Repositories**: Data sources (local DB or API).
- **Presentation**: UI and state (using Provider or Riverpod).

This separation makes your code independent of frameworks, easier to test, and adaptable.

## In Practice
In my app, I implemented features like custom habits and clubs using this setup:

\`\`\`dart
// Example Repository Interface
abstract class HabitRepository {
  Future<List<Habit>> getHabits();
}

// Implementation
class HabitRepositoryImpl implements HabitRepository {
  @override
  Future<List<Habit>> getHabits() async {
    // Fetch from SQLite or API
  }
}
\`\`\`

## Benefits I've Seen
- Unit testing is straightforward—mock repositories effortlessly.
- Scaling features (e.g., adding mood tracking) doesn't break existing code.
- Collaboration improves with clear boundaries.

If you're building in Flutter, start small with this pattern. It's a game-changer!
      `,
    },
    {
      title: "Debugging Like a Pro: Tips for JavaScript Developers",
      excerpt:
        "Essential debugging strategies for tackling bugs in React, Vue, and Node.js environments.",
      content: `
# Debugging Like a Pro: My Essential Tips

Bugs are inevitable, but debugging doesn't have to be a nightmare. Over years of working with JS stacks, I've honed techniques that save time and sanity.

## Start with the Basics
- **Console Logs**: Don't underestimate \`console.log()\`. Use it strategically with JSON.stringify for objects.
- **Browser DevTools**: In React or Vue apps, inspect elements, check network tabs, and set breakpoints in sources.

## Advanced Tools
For deeper issues:
- **React DevTools**: Profile components to spot re-renders.
- **Vue DevTools**: Monitor state changes and events.
- **Node Inspector**: Use \`node --inspect\` for backend debugging in Express.

## Common Pitfalls and Fixes
1. **Async Issues**: Wrap awaits in try-catch or use .catch() on promises.
2. **State Mutations**: In React, always use setState; in Vue, avoid direct prop mutations.
3. **Memory Leaks**: Watch for unclosed event listeners—use tools like Chrome's Performance tab.

\`\`\`javascript
// Example: Debugging an async function
async function fetchData() {
  try {
    const response = await fetch('/api');
    console.log('Data:', await response.json());
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
\`\`\`

Remember, debugging is a skill—practice by intentionally breaking code. What's your toughest bug story?
      `,
    },
    {
      title: "Building Dynamic UIs with React and Next.js",
      excerpt:
        "From components to SSR: How I leverage React and Next.js for performant web apps.",
      content: `
# Building Dynamic UIs with React and Next.js

React is my frontend powerhouse, and pairing it with Next.js elevates it to full-stack glory. Let's dive into how I build responsive, SEO-friendly apps.

## Core React Concepts
- **Components**: Functional over class-based for hooks like useState and useEffect.
- **State Management**: Redux for complex apps, but Context API suffices for simpler ones.

## Next.js Superpowers
Next.js adds:
- **SSR/SSG**: Pre-render pages for speed and SEO.
- **API Routes**: Build backends without separate servers.

In a recent e-commerce project:

\`\`\`jsx
// Example Page Component
import { useState } from 'react';

export default function ProductPage({ product }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={() => setQuantity(q => q + 1)}>Add</button>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch data
  return { props: { product: {} } };
}
\`\`\`

## Tips for Success
- Optimize images with Next/Image.
- Handle routing with Link for client-side navigation.
- Test with Jest and React Testing Library.

If you're new to React, start with hooks—they're transformative!
      `,
    },
    {
      title: "Getting Started with Vue.js: A Beginner's Guide",
      excerpt:
        "Why Vue.js is perfect for reactive apps, with practical examples and comparisons to React.",
      content: `
# Getting Started with Vue.js: My Beginner's Guide

Vue.js is lightweight, flexible, and fun—ideal for devs transitioning from vanilla JS or other frameworks like React.

## Vue Basics
- **Declarative Rendering**: Bind data to DOM with mustache syntax.
- **Reactivity**: Changes in data auto-update the view.

Setup a simple app:

\`\`\`html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">
  {{ message }}
</div>
<script>
  const { createApp } = Vue;
  createApp({
    data() {
      return { message: 'Hello Vue!' };
    }
  }).mount('#app');
</script>
\`\`\`

## Compared to React
Vue's single-file components (.vue) mix HTML, JS, and CSS neatly, unlike React's JSX. It's less boilerplate-heavy for small projects.

## Advanced Features
- **Composition API**: Hooks-like for better organization.
- **Vue Router**: For SPA navigation.
- **Pinia**: State management that's intuitive.

I've used Vue for dashboards—its ecosystem is growing fast. Give it a try if React feels overwhelming!
      `,
    },
    {
      title: "Crafting Robust APIs with Express.js",
      excerpt:
        "Best practices for building secure, scalable APIs using Express, Prisma, and middleware.",
      content: `
# Crafting Robust APIs with Express.js

Express.js is my backend staple—simple yet powerful for Node.js APIs. Here's how I structure them for real-world use.

## Setting Up
Start with:

\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000);
\`\`\`

## Key Features
- **Routing**: Group routes with routers for modularity.
- **Middleware**: Use for auth (e.g., JWT), logging, and error handling.

Integrate with Prisma:

\`\`\`javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
\`\`\`

## Best Practices
- Validate inputs with Joi or express-validator.
- Secure with helmet and cors.
- Handle errors globally to avoid crashes.

In my projects, Express powers everything from user auth to data syncing. It's reliable—pair it with Supabase for even more firepower!
      `,
    },
    {
      title: "Optimizing Flutter Performance for Large Apps",
      excerpt:
        "Tips and tricks to boost Flutter app performance, from widget optimization to efficient state management.",
      content: `
# Optimizing Flutter Performance for Large Apps

Building large-scale Flutter apps, like my habit-tracking app, taught me the importance of performance optimization. Slow renders or laggy UI can ruin user experience, so here’s how I keep things smooth.

## Widget Optimization
- **Use const Constructors**: For stateless widgets to prevent unnecessary rebuilds.
- **Avoid Large Widget Trees**: Break complex UIs into smaller, reusable widgets.

Example:

\`\`\`dart
const MyWidget = Text('Static Content', style: TextStyle(fontSize: 16));
\`\`\`

## State Management
For apps with dynamic data:
- **Provider or Riverpod**: Lightweight and efficient for scoped state changes.
- **Avoid setState Overuse**: Rebuilds entire widget trees unnecessarily.

## Lazy Loading
Load data or widgets only when needed, like paginating lists:

\`\`\`dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(title: Text(items[index])),
);
\`\`\`

## Pro Tips
- Use Flutter DevTools to profile performance.
- Optimize images with packages like flutter_image_compress.
- Cache API responses with dio and hive.

Performance tweaks make a huge difference in large apps. Start small, profile often, and keep users happy!
      `,
    },
    {
      title: "State Management in React: Choosing the Right Tool",
      excerpt:
        "Comparing useState, Context API, Redux, and Zustand for managing state in React apps.",
      content: `
# State Management in React: My Approach

State management in React can be overwhelming with so many options. Here’s how I choose between them based on project needs.

## The Basics
- **useState**: Perfect for simple, component-level state.
- **useReducer**: Great for complex component logic.

Example with useState:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## Scaling Up
For app-wide state:
- **Context API**: Good for small to medium apps (e.g., theme toggling).
- **Redux**: Ideal for large apps with predictable state flow.
- **Zustand**: Lightweight, modern alternative to Redux.

In my e-commerce app, I used Zustand for cart management:

\`\`\`jsx
import create from 'zustand';

const useStore = create(set => ({
  cart: [],
  addToCart: item => set(state => ({ cart: [...state.cart, item] })),
}));
\`\`\`

## My Advice
- Start with useState and Context.
- Move to Zustand for simpler global state.
- Reserve Redux for complex apps with many contributors.

Choose based on complexity—don’t overengineer!
      `,
    },
    {
      title: "Vue 3 Composition API: A Game Changer",
      excerpt:
        "How Vue 3’s Composition API simplifies logic reuse and improves code organization.",
      content: `
# Vue 3 Composition API: Why I Love It

Vue 3’s Composition API transformed how I write Vue apps, offering flexibility over the Options API. Here’s why it’s a game-changer.

## Why Composition API?
- **Reusability**: Group logic into composables (like hooks in React).
- **Cleaner Code**: No more sprawling Options API objects.

Example composable:

\`\`\`javascript
// useCounter.js
import { ref } from 'vue';

export function useCounter() {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
}
\`\`\`

Use it:

\`\`\`vue
<script>
import { useCounter } from './useCounter';

export default {
  setup() {
    const { count, increment } = useCounter();
    return { count, increment };
  }
};
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
\`\`\`

## Benefits
- **TypeScript Support**: Better type inference.
- **Logic Sharing**: Reuse composables across components.
- **Smaller Bundle Size**: Tree-shaking works better.

For dashboards or forms, Composition API keeps my code modular. If you’re on Vue 2, upgrade for this alone!
      `,
    },
    {
      title: "Securing Express APIs with Authentication",
      excerpt:
        "Implementing JWT-based authentication in Express for secure, scalable APIs.",
      content: `
# Securing Express APIs with JWT

Building secure APIs is critical, and JSON Web Tokens (JWT) are my go-to for authentication in Express apps. Here’s my approach.

## Setting Up JWT
Install dependencies:

\`\`\`bash
npm install jsonwebtoken bcrypt
\`\`\`

Create a login route:

\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
\`\`\`

## Protecting Routes
Use middleware:

\`\`\`javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
\`\`\`

## Best Practices
- Store secrets in environment variables.
- Use refresh tokens for long-lived sessions.
- Hash passwords with bcrypt.

JWT keeps my APIs secure and scalable. Pair it with Prisma for user management!
      `,
    },
    {
      title: "Testing Flutter Apps: From Unit to Widget Tests",
      excerpt:
        "How to write effective tests in Flutter to ensure app reliability and catch bugs early.",
      content: `
# Testing Flutter Apps: My Strategy

Testing is a lifesaver for Flutter apps, especially for complex ones like my habit-tracker. Here’s how I approach unit and widget testing.

## Unit Tests
Test business logic in isolation:

\`\`\`dart
import 'package:test/test.dart';
import 'package:my_app/habit_service.dart';

void main() {
  test('Habit streak increments correctly', () {
    final service = HabitService();
    expect(service.incrementStreak(1), 2);
  });
}
\`\`\`

## Widget Tests
Test UI components:

\`\`\`dart
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart';

void main() {
  testWidgets('Counter increments', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.text('0'), findsOneWidget);
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();
    expect(find.text('1'), findsOneWidget);
  });
}
\`\`\`

## Tips for Success
- Mock dependencies with mockito.
- Use flutter_test for widget testing.
- Integrate with CI/CD pipelines for automation.

Testing caught a streak calculation bug in my app before release. Start testing early—it pays off!
      `,
    },
  ];

  // 3. Seed posts (skip duplicates if already exist)
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: slug(post.title) },
      update: {},
      create: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        slug: slug(post.title),
        readTimeMin: Math.ceil(post.content.split(/\s+/).length / 200), // auto-calc read time
        author: { connect: { id: me.id } }, // ✅ fixed: use me.id
      },
    });
  }

  console.log("✅ Database seeded successfully with your real data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// "use client";

// import { useState } from "react";

// import { api } from "@/trpc/react";

// export function LatestPost() {
//   const [latestPost] = api.post.getLatest.useSuspenseQuery();
//   const [newsLetters] = api.post.getNewsLatter.useSuspenseQuery();

//   const utils = api.useUtils();
//   const [name, setName] = useState("");
//   const [latter, setLatter] = useState("");
//   const createPost = api.post.create.useMutation({
//     onSuccess: async () => {
//       await utils.post.invalidate();
//       setName("");
//     },
//   });

//   const createNewsLatter = api.post.createNewsLatter.useMutation({
//     onSuccess: async () => {
//       await utils.post.invalidate();
//       setLatter("");
//     },
//     onError: (error) => {
//       console.error("Error creating newsletter => 78", error);
//       alert(`Failed to create newsletter: ${error.message}`);
//     },
//   });

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}
//       {newsLetters.length > 0 ? (
//         <p className="truncate">
//           Your most recent newsletter: {newsLetters[0].email}
//         </p>
//       ) : (
//         <p>You have no newsletters yet.</p>
//       )}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           try {
//             createPost.mutate({ name });
//           } catch (error) {
//             console.error("Error creating post =>7:", error);
//             alert("Failed to create post. Please try again.");
//           }
//         }}
//         className="flex flex-col gap-2"
//       >
//         <input
//           type="text"
//           placeholder="Title"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full rounded-ful px-4 py-2"
//         />
//         <button
//           type="submit"
//           className="rounded-full px-10 py-3 font-semibold transition"
//           disabled={createPost.isPending}
//         >
//           {createPost.isPending ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           createNewsLatter.mutate({ email: latter });
//         }}
//         className="flex flex-col gap-2"
//       >
//         <input
//           type="text"
//           placeholder="Email"
//           value={latter}
//           onChange={(e) => setLatter(e.target.value)}
//           className="w-full rounded-full px-4 py-2"
//         />
//         <button
//           type="submit"
//           className="rounded-full px-10 py-3 font-semibold transition"
//           disabled={createNewsLatter.isPending}
//         >
//           {createNewsLatter.isPending ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// }

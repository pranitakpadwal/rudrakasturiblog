import Link from "next/link";
import { getAllPosts, gradientForSlug } from "@/lib/content";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Rudra Kasturi</h1>
      <p className="mb-10 text-neutral-600">
        Search. Strategy. AI. Growth. Coach. Revenue.
      </p>
      <ul className="flex flex-col gap-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`} className="group block">
              <div
                className={`mb-3 h-28 w-full rounded-xl bg-gradient-to-br ${gradientForSlug(
                  post.slug
                )}`}
              />
              <h2 className="text-xl font-semibold group-hover:text-indigo-600">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.categories.length > 0 && ` · ${post.categories.join(", ")}`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

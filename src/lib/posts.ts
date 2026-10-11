import { getCollection, type CollectionEntry } from "astro:content";
import type { CodeTopic, LifeCategory } from "./categories";

export { categoryLabels, codeTopicLabels, codeTopics, lifeCategories } from "./categories";
export type { CodeTopic, LifeCategory } from "./categories";
export type Post = CollectionEntry<"posts">;
export const POSTS_PER_PAGE = 10;

export async function getPublishedPosts(): Promise<readonly Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft && data.pubDate <= new Date());
  return posts.toSorted((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}

export async function getLifePosts(): Promise<readonly Post[]> {
  return (await getPublishedPosts()).filter((post) => post.data.category !== "code");
}

export async function getCodePosts(topic?: CodeTopic): Promise<readonly Post[]> {
  return (await getPublishedPosts()).filter((post) =>
    post.data.category === "code" && (!topic || post.data.codeTopic === topic),
  );
}

export function postPath(post: Post): string {
  return `/posts/${post.data.slug}/`;
}

export function categoryPath(category: LifeCategory): string {
  return `/life/${category}/`;
}

export function codeTopicPath(topic: CodeTopic): string {
  return `/code/${topic}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(date);
}

export function formatYear(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", timeZone: "Asia/Shanghai" }).format(date);
}

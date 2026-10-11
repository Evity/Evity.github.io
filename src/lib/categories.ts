export const lifeCategories = ["food", "coffee", "music", "travel", "daily"] as const;
export const codeTopics = ["learning", "projects", "retrospectives"] as const;
export const postCategories = [...lifeCategories, "code"] as const;

export type LifeCategory = (typeof lifeCategories)[number];
export type CodeTopic = (typeof codeTopics)[number];

export const categoryLabels = {
  food: "吃的记录",
  coffee: "咖啡手记",
  music: "音乐随记",
  travel: "旅行途中",
  daily: "日常片段",
  code: "代码笔记",
} as const;

export const codeTopicLabels: Record<CodeTopic, string> = {
  learning: "学习笔记",
  projects: "实践项目",
  retrospectives: "问题复盘",
};

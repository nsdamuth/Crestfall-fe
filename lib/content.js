import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

function validateEntry(entry, filePath) {
  if (!entry.title) {
    throw new Error(`Missing title in ${filePath}`);
  }

  if (!entry.slug) {
    throw new Error(`Missing slug in ${filePath}`);
  }

  if (!entry.cardText) {
    throw new Error(`Missing cardText in ${filePath}`);
  }

  if (!entry.assetBase) {
    throw new Error(`Missing assetBase in ${filePath}`);
  }

  if (!entry.content || !Array.isArray(entry.content)) {
    throw new Error(`Missing or invalid content array in ${filePath}`);
  }

  return entry;
}

function parseMarkdownFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  return validateEntry(
    {
      ...data,
      markdown: content,
    },
    filePath
  );
}

export function getMarkdownEntry(collection, slug) {
  const filePath = path.join(contentRoot, collection, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMarkdownFile(filePath);
}

export function getMarkdownEntryByPath(collection, slugPath) {
  const filePath = path.join(contentRoot, collection, `${slugPath}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMarkdownFile(filePath);
}

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = [...files, ...walkMarkdownFiles(fullPath)];
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export function getAllMarkdownEntries(collection) {
  const collectionPath = path.join(contentRoot, collection);

  if (!fs.existsSync(collectionPath)) {
    return [];
  }

  const files = walkMarkdownFiles(collectionPath);

  return files.map(parseMarkdownFile);
}
import { getCollection, type CollectionEntry } from "astro:content";

type Paper = CollectionEntry<"publications">["data"]["publications"][number];

// Each member has one details file and one file containing all their papers.
export async function getMemberPublications() {
  const people = new Map((await getCollection("people")).map((person) => [person.slug, person]));
  const seen = new Set<string>();
  return (await getCollection("publications")).filter((entry) => {
    const member = entry.data.member;
    if (!people.has(member)) throw new Error(`Unknown member ${member} in publications/${entry.slug}.md`);
    if (seen.has(member)) throw new Error(`Multiple publications files for ${member}; keep all papers in one file.`);
    seen.add(member);
    return !people.get(member)!.data.isDraft;
  });
}

// Shared paper IDs produce one archive/home/stream item.
export async function getPublications() {
  const entries = await getMemberPublications();
  const streams = new Set((await getCollection("projects")).map((project) => project.slug));
  const papers = new Map<string, { data: Paper }>();
  for (const person of entries) {
    const ownIds = new Set<string>();
    for (const paper of person.data.publications) {
      if (ownIds.has(paper.id)) throw new Error(`Duplicate paper ${paper.id} in ${person.slug}`);
      ownIds.add(paper.id);
      for (const stream of paper.researchStreams) {
        if (!streams.has(stream)) throw new Error(`Unknown research stream ${stream} in ${person.slug}/${paper.id}`);
      }
      const existing = papers.get(paper.id);
      if (!existing) {
        papers.set(paper.id, { data: { ...paper, researchStreams: [...paper.researchStreams] } });
        continue;
      }
      // Fail clearly instead of silently choosing conflicting bibliographic details.
      for (const key of ["title", "authors", "year", "venue", "type", "award", "source", "links"] as const) {
        if (JSON.stringify(existing.data[key]) !== JSON.stringify(paper[key])) {
          throw new Error(`Conflicting ${key} for shared paper ${paper.id} in ${person.slug}. Use matching metadata for the same ID.`);
        }
      }
      existing.data.showInLabPublications ||= paper.showInLabPublications;
      existing.data.selected ||= paper.selected;
      existing.data.researchStreams = [...new Set([...existing.data.researchStreams, ...paper.researchStreams])];
    }
  }
  return [...papers.values()];
}

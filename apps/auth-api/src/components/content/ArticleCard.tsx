import { Link } from "@tanstack/solid-router";
import type { CollectionArticle, ContentCollection } from "../../lib/content-collection";
import { ArticleByline } from "./ArticleByline";
import { ArticleGradient } from "./ArticleGradient";

export interface ArticleCardProps {
  collection: ContentCollection;
  article: CollectionArticle;
  /** Position in the grid, used only to stagger the reveal. */
  index: number;
}

export function ArticleCard(props: ArticleCardProps) {
  let root: HTMLAnchorElement | undefined;

  return (
    <Link
      ref={root}
      class="post-card"
      to={props.collection.articleRoute}
      params={{ slug: props.article.slug }}
      style={{ "--post-card-index": props.index }}
    >
      <div class="post-card-art">
        <ArticleGradient
          title={props.article.title}
          art={{ collection: props.collection, slug: props.article.slug, shape: "card" }}
          mode="hover"
          hoverTarget={() => root}
        />
      </div>
      <ArticleByline article={props.article} class="post-card-byline" />
      <h3 class="post-card-title">{props.article.title}</h3>
    </Link>
  );
}

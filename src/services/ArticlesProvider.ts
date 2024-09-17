import { mediumRSSParser, devRSSParser, hashNodeRSSParser } from './FeedParser';

class Article {
    title: string;
    description: string;
    datePublished: Date;
    link: string;
    image: string;

    constructor(title: string, description: string, datePublished: Date, link: string, image: string) {
        this.title = title;
        this.description = description;
        this.datePublished = datePublished;
        this.link = link;
        this.image = image;
    }
}

export default class ArticlesProvider {
    link: string;

    constructor(link: string) {
        this.link = link;
    }

    fetchArticles = async (): Promise<Article[]> => {
        let articles: {
            title?: string;
            description?: string;
            datePublished?: string;
            link?: string;
            image: string | null;
        }[] = [];

        if (this.link && this.link.startsWith("https://medium.com")) {
            articles = await mediumRSSParser(this.link);
        } else if (this.link && this.link.startsWith("https://dev.to")) {
            articles = await devRSSParser(this.link);
        } else if (this.link && this.link.startsWith("https://hashnode.com")) {
            articles = await hashNodeRSSParser(this.link);
        }

        // Map and ensure all required fields are present with default values if necessary
        return articles.map(article => new Article(
            article.title || "Untitled",
            article.description || "",  // Ensure description is a string
            article.datePublished ? new Date(article.datePublished) : new Date(),
            article.link || "#",
            article.image || ""
        ));
    }
}

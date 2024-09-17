import Parser from "rss-parser"

const parser = new Parser();

export const mediumRSSParser = async (link: any) => {
    const feedResponse = await parser.parseURL(link);
      
    const articles = feedResponse.items.map(item => ({
        title: item.title,
        description: item['content:encodedSnippet'],
        datePublished: item.pubDate,
        link: item.link,
        image: extractImageFromContent(item['content:encoded'] || item.content)
    }));
    return articles;
}

export const devRSSParser = async (link: any) => {
    const feedResponse = await parser.parseURL(link);
      
    const articles = feedResponse.items.map(item => ({
        title: item.title,
        description: item.contentSnippet,
        datePublished: item.pubDate,
        link: item.link,
        image: item.thumbnail || extractImageFromContent(item.content)
    }));
    return articles;
}

export const hashNodeRSSParser = async (link: any) => {
    const feedResponse = await parser.parseURL(link);
      
    const articles = feedResponse.items.map(item => ({
        title: item.title,
        description: item.description,
        datePublished: item.pubDate,
        link: item.link,
        image: item.thumbnail || extractImageFromContent(item.content)
    }));
    return articles;
}

const extractImageFromContent = (content: any) => {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const matches = imageRegex.exec(content);
    return matches && matches.length > 1 ? matches[1] : null;
}
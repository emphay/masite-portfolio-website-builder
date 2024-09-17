import ArticlesProvider from '../../services/ArticlesProvider'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { feedLink } = req.body;
  console.log('Request Body', req.body)
  let provider = new ArticlesProvider(feedLink);
  const articles= await provider.fetchArticles();
  res.status(200).json(articles);
}
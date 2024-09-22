import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';
import * as he from 'he'; // HTML 엔티티 디코딩을 위해 he 모듈을 사용

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
  }>;
}

@Injectable()
export class NewsService {
  private readonly apiKey = '2b50df21b72a48f7a696f11a25947657'; // 여기에 실제 API 키를 입력하세요.

  async getNewsByTopic(topic: string): Promise<Article[]> {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=ko&apiKey=${this.apiKey}`;
    console.log(url)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as NewsApiResponse;

      return data.articles.map((article) => {
        let cleanedContent = article.content ? he.decode(article.content) : 'No content available';
        
        // HTML 태그 제거
        cleanedContent = cleanedContent.replace(/<\/?[^>]+(>|$)/g, "");

        cleanedContent = cleanedContent
          .split('[')[0] // '['로 시작하는 부분을 잘라냅니다.
          .replace(/[\r\n]/g, ' ') // 줄바꿈을 공백으로 대체
          .replace(/ +/g, ' ') // 여러 공백을 단일 공백으로
          .trim();

        return {
          id: article.url,
          title: he.decode(article.title), // HTML 엔티티를 디코딩
          summary: he.decode(article.description || 'No summary available'), // HTML 엔티티를 디코딩
          content: cleanedContent,
        };
      });
    } catch (error) {
      console.error('Error fetching news from NewsAPI:', error);
      throw new HttpException('Failed to fetch news', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

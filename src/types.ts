// types.ts
export interface KeywordTag {
    keyword: string;
    priority: number;
    color: string;
  }
  
  export interface Paper {
    id: number;
    title: string;
    keywordDistribution: Record<string, number>;
    word_frequency_dict: Record<string, number>;
  }
  
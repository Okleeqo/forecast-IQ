export interface Report {
  title: string;
  date: string;
  summary: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}
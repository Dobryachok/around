export interface Post {
  title: string;
  excerpt: string;
  url: string;
  image?: string;
  author?: string;
  date?: string;
}

export interface CategoryData {
  title: string;
  categoryUrl: string;
  featured: Post;
  posts: Post[];
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  location: string;
  cardTitle: string;
  date: string;
  image: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}

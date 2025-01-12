export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export interface Category {
  id: number;
  MetaTagDescription?: string;
  name: string;
  Title?: string;
  children?: Category[];
}

export interface CategoryResponse {
  data?: Category[];
}

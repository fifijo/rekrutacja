import { Category, CategoryListElement, CategoryResponse } from './types';

const extractDisplayOrderFromTitle = (
  title: string | undefined,
  id: number,
  hasChildren: boolean
): number => {
  if (!title) {
    return id;
  }

  const orderStr = title.includes('#') ? title.split('#')[0] : title;
  const parsedOrder = parseInt(orderStr);

  return isNaN(parsedOrder) ? (hasChildren ? id : id) : parsedOrder;
};

const hasHomePageMarker = (title: string | undefined): boolean =>
  Boolean(title?.includes('#'));

const convertToDisplayCategory = (category: Category): CategoryListElement => {
  const { id, MetaTagDescription: image = '', name, Title } = category;
  const hasChildren = category.children?.length > 0;

  return {
    id,
    image,
    name,
    order: extractDisplayOrderFromTitle(Title, id, hasChildren),
    children: [],
    showOnHome: false,
  };
};

const buildCategoryHierarchy = (category: Category): CategoryListElement => {
  const node = convertToDisplayCategory(category);

  if (category.children?.length) {
    node.children = category.children
      .map(buildCategoryHierarchy)
      .sort((a, b) => a.order - b.order);
  }
  return node;
};

const shouldShowCategory = (
  category: Category,
  categories: Category[],
  markedIds: number[]
): boolean => {
  if (categories.length <= 5) {
    return true;
  }

  if (markedIds.length > 0) {
    return markedIds.includes(category.id);
  }

  return categories.indexOf(category) < 3;
};

const determineHomePageVisibility = (
  categories: CategoryListElement[],
  markedIds: number[]
): CategoryListElement[] =>
  categories.map((category) => ({
    ...category,
    showOnHome: shouldShowCategory(category, categories, markedIds),
  }));

export const categoryTree = (
  response: CategoryResponse
): CategoryListElement[] => {
  const { data } = response;

  if (!data) {
    return [];
  }

  const homePageMarkedIds = data
    .filter(({ Title }) => hasHomePageMarker(Title))
    .map(({ id }) => id);

  const processedCategories = data
    .map(buildCategoryHierarchy)
    .sort((a, b) => a.order - b.order);

  return determineHomePageVisibility(processedCategories, homePageMarkedIds);
};

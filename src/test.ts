import test from 'ava';
import type { ExecutionContext } from 'ava';

import { CORRECT } from './correctResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';
import { CategoryListElement } from './types';

const compareStructures = (
  t: ExecutionContext,
  actual: CategoryListElement[],
  expected: CategoryListElement[]
): void => {
  t.is(actual.length, expected.length);

  actual.forEach((category, index) => {
    const expectedCategory = expected[index];

    t.is(category.id, expectedCategory.id);
    t.is(category.name, expectedCategory.name);
    t.is(category.image, expectedCategory.image);
    t.is(category.order, expectedCategory.order);
    t.is(category.showOnHome, expectedCategory.showOnHome);

    if (expectedCategory.children.length > 0) {
      compareStructures(t, category.children, expectedCategory.children);
    } else {
      t.deepEqual(category.children, []);
    }
  });
};

test('categoryTree returns correct structure', async (t) => {
  const dataFromApi = await getCategories();
  const result = categoryTree(dataFromApi);

  compareStructures(t, result, CORRECT);
});

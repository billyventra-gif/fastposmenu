import { newId, type Item, type Menu, type ModifierGroup } from "./schema";

/** Pure edit helpers for the review UI. Each returns a new Menu. */

export function updateItem(menu: Menu, id: string, patch: Partial<Item>): Menu {
  return { ...menu, items: menu.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) };
}

export function deleteItem(menu: Menu, id: string): Menu {
  return { ...menu, items: menu.items.filter((i) => i.id !== id) };
}

export function addItem(menu: Menu, categoryId: string): Menu {
  const item: Item = {
    id: newId("item"),
    name: "New item",
    categoryId,
    variations: [{ id: newId("var"), name: "Regular", priceCents: 0 }],
    modifierGroupIds: [],
    taxHint: "prepared_food",
    taxIds: menu.taxes.map((t) => t.id),
    dietary: [],
    confidence: "high",
  };
  return { ...menu, items: [...menu.items, item] };
}

export function addCategory(menu: Menu, name = "New category"): Menu {
  const sortOrder = menu.categories.length;
  return { ...menu, categories: [...menu.categories, { id: newId("cat"), name, sortOrder }] };
}

export function renameCategory(menu: Menu, id: string, name: string): Menu {
  return { ...menu, categories: menu.categories.map((c) => (c.id === id ? { ...c, name } : c)) };
}

/** Delete a category and its items. */
export function deleteCategory(menu: Menu, id: string): Menu {
  return {
    ...menu,
    categories: menu.categories.filter((c) => c.id !== id).map((c, i) => ({ ...c, sortOrder: i })),
    items: menu.items.filter((i) => i.categoryId !== id),
  };
}

export function moveCategory(menu: Menu, id: string, dir: -1 | 1): Menu {
  const cats = [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const i = cats.findIndex((c) => c.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= cats.length) return menu;
  [cats[i], cats[j]] = [cats[j], cats[i]];
  return { ...menu, categories: cats.map((c, k) => ({ ...c, sortOrder: k })) };
}

export function updateGroup(menu: Menu, id: string, patch: Partial<ModifierGroup>): Menu {
  return { ...menu, modifierGroups: menu.modifierGroups.map((g) => (g.id === id ? { ...g, ...patch } : g)) };
}

export function addGroup(menu: Menu): Menu {
  const g: ModifierGroup = {
    id: newId("mg"),
    name: "New modifier group",
    minSelect: 0,
    maxSelect: 1,
    options: [{ id: newId("opt"), name: "Option", priceCents: 0, isDefault: false }],
  };
  return { ...menu, modifierGroups: [...menu.modifierGroups, g] };
}

export function deleteGroup(menu: Menu, id: string): Menu {
  return {
    ...menu,
    modifierGroups: menu.modifierGroups.filter((g) => g.id !== id),
    items: menu.items.map((i) => ({ ...i, modifierGroupIds: i.modifierGroupIds.filter((g) => g !== id) })),
  };
}

export function toggleGroupOnItem(menu: Menu, itemId: string, groupId: string): Menu {
  return {
    ...menu,
    items: menu.items.map((i) =>
      i.id !== itemId
        ? i
        : {
            ...i,
            modifierGroupIds: i.modifierGroupIds.includes(groupId)
              ? i.modifierGroupIds.filter((g) => g !== groupId)
              : [...i.modifierGroupIds, groupId],
          },
    ),
  };
}

export function setTaxes(menu: Menu, taxes: Menu["taxes"]): Menu {
  const ids = taxes.map((t) => t.id);
  return {
    ...menu,
    taxes,
    items: menu.items.map((i) => ({ ...i, taxIds: i.taxHint === "non_taxable" ? [] : ids })),
  };
}

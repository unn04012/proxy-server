type Category = {
  id: number;
  name: string;
};

const categoryList: Category[] = [];

type Product = {
  name: string;
  category: Category;
};

function matchingProductWithCategory({ id, name }: Category) {
  const product = '';
  const category = categoryList.find((e) => e.id === id && e.name === name);
  if (!category)
    throw new Error(`not found category, id: ${id}, name: ${name}`);
}

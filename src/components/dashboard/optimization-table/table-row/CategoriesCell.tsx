interface CategoriesCellProps {
  categories: string[];
}

export function CategoriesCell({ categories }: CategoriesCellProps) {
  return (
    <td className="p-4 w-48">
      <div className="flex flex-wrap gap-1">
        {categories.map((category, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {category}
          </span>
        ))}
      </div>
    </td>
  );
}
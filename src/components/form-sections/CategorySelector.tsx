import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export function CategorySelector({ 
  categories, 
  selectedCategories, 
  onToggleCategory 
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Optimization Categories</Label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-pill border-white ${
              selectedCategories.includes(category) ? "selected" : ""
            }`}
            onClick={() => onToggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: Array<{ id: string; label: string; color: string }>
  selectedCategory: string
  onSelectCategory: (category: string) => void
  emailCounts: Record<string, number>
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  emailCounts,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`gap-2 ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
          {category.label}
          <span className="ml-1 text-xs opacity-70">({emailCounts[category.id] || 0})</span>
        </Button>
      ))}
    </div>
  )
}

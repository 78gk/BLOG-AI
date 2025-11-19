'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Grid, List, TrendingUp, Clock, Heart } from 'lucide-react'

interface BlogFiltersProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
  onTagFilter: (tag: string) => void
  categories: Array<{ id: string; name: string; slug: string }>
  popularTags: Array<{ name: string; slug: string; count: number }>
  selectedCategory: string
  selectedSort: string
  searchQuery: string
}

export function BlogFilters({
  onSearch,
  onCategoryChange,
  onSortChange,
  onTagFilter,
  categories,
  popularTags,
  selectedCategory,
  selectedSort,
  searchQuery
}: BlogFiltersProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-4">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Latest</span>
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </SelectItem>
              <SelectItem value="liked">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Most Liked</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onCategoryChange('all')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Popular Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag.slug}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onTagFilter(tag.slug)}
              >
                #{tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
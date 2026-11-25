import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  ArrowLeft,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Loader2 } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  usePaginatedEquipment,
  useEquipmentCategories,
  useEquipmentAvailability,
  useEquipmentCategoryIcon } from
'../hooks/useEquipment';
import type { Equipment } from '../types/api.types';
function EquipmentCard({
  equipment,
  onClick,
  isDark




}: {equipment: Equipment;onClick: () => void;isDark: boolean;}) {
  const availability = useEquipmentAvailability(equipment);
  const categoryIcon = useEquipmentCategoryIcon(equipment.category);
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl overflow-hidden border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm hover:shadow-md'}`}>
      
      <div
        className={`relative aspect-[4/3] overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
        
        {equipment.images?.[0] ?
        <img
          src={equipment.images[0]}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> :


        <div className="w-full h-full flex items-center justify-center text-3xl">
            {categoryIcon}
          </div>
        }
        <div
          className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${availability.bgColor} ${availability.color}`}>
          
          {availability.label}
        </div>
        <div
          className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${isDark ? 'bg-slate-900/80 text-white' : 'bg-white/90 text-slate-700'}`}>
          
          {categoryIcon} {equipment.category}
        </div>
      </div>
      <div className="p-3">
        <h3
          className={`text-sm font-semibold mb-0.5 line-clamp-1 group-hover:text-cyan-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {equipment.name}
        </h3>
        {equipment.brand &&
        <p
          className={`text-xs mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          
            {equipment.brand}
          </p>
        }
        {equipment.rating &&
        <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span
            className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              {equipment.rating}
            </span>
            <span
            className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            
              ({equipment.reviewCount})
            </span>
          </div>
        }
        <div className="flex items-baseline gap-1">
          <span
            className={`text-base font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            
            {equipment.pricePerDay}
          </span>
          <span
            className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            TND/jour
          </span>
        </div>
      </div>
    </div>);

}
function EquipmentSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div
      className={`rounded-xl overflow-hidden border animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
      
      <div
        className={`aspect-[4/3] ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      
      <div className="p-3">
        <div
          className={`h-4 w-3/4 rounded mb-1.5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        
        <div
          className={`h-3 w-1/2 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        
        <div
          className={`h-5 w-1/3 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        
      </div>
    </div>);

}
function CategoryButton({
  category,
  selected,
  onClick,
  isDark





}: {category: string;selected: boolean;onClick: () => void;isDark: boolean;}) {
  const icon = useEquipmentCategoryIcon(category);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selected ? 'bg-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
      
      <span>{icon}</span>
      {category}
    </button>);

}
export function CyberEquipmentCatalog() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { data: categories, loading: categoriesLoading } =
  useEquipmentCategories();
  const {
    data: equipment,
    loading: equipmentLoading,
    pagination,
    filters,
    setFilters,
    nextPage,
    prevPage
  } = usePaginatedEquipment({
    page: 1,
    limit: 12,
    category: selectedCategory || undefined,
    search: searchQuery || undefined
  });
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setFilters({
      category: category || undefined,
      page: 1
    });
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const timeoutId = setTimeout(() => {
      setFilters({
        search: query || undefined,
        page: 1
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  };
  const handleEquipmentClick = (equipmentId: string) => {
    navigate(`/equipment/${equipmentId}`);
  };
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-20 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  Équipement Médical
                </h1>
                {pagination &&
                <p
                  className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    {pagination.total} équipements disponibles
                  </p>
                }
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                }
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                
                {viewMode === 'grid' ?
                <List className="h-4 w-4" /> :

                <Grid className="h-4 w-4" />
                }
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-cyan-500 text-white' : isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative mb-2">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            
            <input
              type="text"
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
            
            {searchQuery &&
            <button
              onClick={() => handleSearch('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              
                <X className="h-3.5 w-3.5" />
              </button>
            }
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedCategory ? 'bg-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
              
              Tous
            </button>
            {categoriesLoading ?
            <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                className={`w-20 h-7 rounded-full animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

              )}
              </div> :

            categories?.map((category) =>
            <CategoryButton
              key={category}
              category={category}
              selected={selectedCategory === category}
              onClick={() => handleCategorySelect(category)}
              isDark={isDark} />

            )
            }
          </div>

          {showFilters &&
          <div
            className={`mt-3 p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            
              <div className="flex items-center justify-between mb-2">
                <h3
                className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Filtres avancés
                </h3>
                <button
                onClick={() => setShowFilters(false)}
                className={`p-0.5 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label
                  className={`block text-[10px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Catégorie
                  </label>
                  <select
                  value={selectedCategory || ''}
                  onChange={(e) =>
                  handleCategorySelect(e.target.value || null)
                  }
                  className={`w-full px-2 py-1.5 rounded-lg border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  
                    <option value="">Toutes</option>
                    {categories?.map((cat) =>
                  <option key={cat} value={cat}>
                        {cat}
                      </option>
                  )}
                  </select>
                </div>
                <div>
                  <label
                  className={`block text-[10px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Tri par
                  </label>
                  <select
                  className={`w-full px-2 py-1.5 rounded-lg border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  
                    <option value="relevance">Pertinence</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="rating">Meilleures notes</option>
                  </select>
                </div>
                <div>
                  <label
                  className={`block text-[10px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Disponibilité
                  </label>
                  <select
                  className={`w-full px-2 py-1.5 rounded-lg border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  
                    <option value="all">Tous</option>
                    <option value="available">Disponible</option>
                    <option value="limited">Stock limité</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                onClick={() => {
                  handleCategorySelect(null);
                  handleSearch('');
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>
                
                  Réinitialiser
                </button>
                <button
                onClick={() => setShowFilters(false)}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-cyan-500 text-white hover:bg-cyan-600">
                
                  Appliquer
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {(selectedCategory || searchQuery) &&
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span
            className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
              Filtres:
            </span>
            {selectedCategory &&
          <button
            onClick={() => handleCategorySelect(null)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
            
                {selectedCategory}
                <X className="h-2.5 w-2.5" />
              </button>
          }
            {searchQuery &&
          <button
            onClick={() => handleSearch('')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
            
                "{searchQuery}"<X className="h-2.5 w-2.5" />
              </button>
          }
          </div>
        }

        {equipmentLoading ?
        <div
          className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
          <EquipmentSkeleton key={i} isDark={isDark} />
          )}
          </div> :
        equipment && equipment.length > 0 ?
        <>
            <div
            className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            
              {equipment.map((item) =>
            <EquipmentCard
              key={item.id}
              equipment={item}
              isDark={isDark}
              onClick={() => handleEquipmentClick(item.id)} />

            )}
            </div>
            {pagination && pagination.totalPages > 1 &&
          <div className="flex items-center justify-between mt-4">
                <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                  Page {pagination.page} sur {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                onClick={prevPage}
                disabled={!pagination.hasPrev}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                
                    Précédent
                  </button>
                  <button
                onClick={nextPage}
                disabled={!pagination.hasNext}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                
                    Suivant
                  </button>
                </div>
              </div>
          }
          </> :

        <div className="py-8 text-center">
            <div
            className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            
              <Search
              className={`h-5 w-5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            
            </div>
            <p
            className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            
              Aucun équipement trouvé
            </p>
            <p
            className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            
              Essayez de modifier vos critères de recherche
            </p>
            {(selectedCategory || searchQuery) &&
          <button
            onClick={() => {
              handleCategorySelect(null);
              handleSearch('');
            }}
            className="mt-3 text-xs text-cyan-500 hover:text-cyan-400 font-medium">
            
                Réinitialiser les filtres
              </button>
          }
          </div>
        }
      </div>
    </div>);

}
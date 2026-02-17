import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, Heart, Moon, Sun, X, ShoppingBag } from 'lucide-react'
import ProductCard from './components/ProductCard'
import products from './data/products.json'

const categoryLabels = {
  all: 'ทั้งหมด',
  fashion: 'แฟชั่น',
  electronics: 'อิเล็กทรอนิกส์',
  beauty: 'ความงาม',
  home: 'บ้าน',
  health: 'สุขภาพ',
}

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, useCallback(() => setDark((d) => !d), [])]
}

function useFavorites() {
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favs))
  }, [favs])

  const toggle = useCallback((id) => {
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  return [favs, toggle]
}

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  const [favs, toggleFav] = useFavorites()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showFavOnly, setShowFavOnly] = useState(false)

  const categories = useMemo(
    () => ['all', ...new Set(products.map((p) => p.category))],
    []
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (showFavOnly && !favs.includes(p.id)) return false
      if (category !== 'all' && p.category !== category) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [search, category, showFavOnly, favs])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f17] text-gray-900 dark:text-gray-100 transition-colors">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight">Shopee Picks</h1>
              <p className="text-[11px] text-gray-400 -mt-0.5">สินค้าแนะนำ พิมพ์คัดมาให้แล้ว</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f17] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowFavOnly(!showFavOnly)}
              className={`relative p-2.5 rounded-xl transition-all ${showFavOnly
                ? 'bg-red-50 dark:bg-red-500/10 text-red-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
                }`}
              title="รายการโปรด"
            >
              <Heart size={18} className={showFavOnly ? 'fill-red-500' : ''} />
              {favs.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favs.length}
                </span>
              )}
            </button>
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="เปลี่ยนธีม"
            >
              {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-500/30'
                }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {showFavOnly && (
              <span className="text-red-500 font-medium mr-1">
                <Heart size={12} className="inline fill-red-500 -mt-0.5" /> รายการโปรด
              </span>
            )}
            {filtered.length} สินค้า
          </p>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={favs.includes(product.id)}
                onToggleFav={toggleFav}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">
              {showFavOnly ? '💔' : '🔍'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {showFavOnly
                ? 'ยังไม่มีรายการโปรด'
                : 'ไม่พบสินค้าที่ค้นหา'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {showFavOnly
                ? 'กดหัวใจที่สินค้าเพื่อบันทึกไว้ดูภายหลัง'
                : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800/50 mt-8">
        Shopee Picks — สินค้าแนะนำคัดมาให้แล้ว
      </footer>
    </div>
  )
}

import { Heart, ExternalLink, Tag } from 'lucide-react'

export default function ProductCard({ product, isFav, onToggleFav }) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )
  const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(product.image)

  return (
    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {isVideo ? (
          <video
            src={product.image}
            muted
            loop
            playsInline
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleFav(product.id)
          }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={
              isFav
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-400'
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem] text-gray-800 dark:text-gray-200">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-bold text-orange-500">
            ฿{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ฿{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buy button */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all"
        >
          <ExternalLink size={15} />
          ซื้อเลย
        </a>
      </div>
    </div>
  )
}

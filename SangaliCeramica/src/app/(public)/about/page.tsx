import { Award, Compass, Heart, Users, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-24 py-24 bg-zinc-950">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
          Crafting Spaces of{' '}
          <span className="bg-gradient-to-r from-accent via-amber-400 to-white bg-clip-text text-transparent">
            Unparalleled Luxury
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
          Sangli Ceramica is Maharashtra's elite destination for designer tiles, Italian-style vitrified slabs, state-of-the-art sanitary ware, and premium bath fixtures.
        </p>
      </section>

      {/* Grid: Story & Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Our Legacy</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            Founded with a vision to bring world-class ceramic surface design and luxurious sanitary products to Sangli and the surrounding districts of Maharashtra, we have grown to become the preferred partner for leading architects, builders, and discerning homeowners.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            We operate a spacious, state-of-the-art showroom displaying complete bathroom concepts, slab cladding, and faucet mixers in realistic home layouts. This helps you visualize and build spaces that inspire.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850">
              <span className="text-3xl font-extrabold text-accent">15+</span>
              <p className="text-xs text-zinc-500 font-medium mt-1">Years of Trust & Quality</p>
            </div>
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850">
              <span className="text-3xl font-extrabold text-accent">5,000+</span>
              <p className="text-xs text-zinc-500 font-medium mt-1">Homes Beautified</p>
            </div>
          </div>
        </div>

        <div className="h-96 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            alt="Sangli Ceramica Premium Showroom Display"
            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <h2 className="text-3xl font-bold text-white text-center">Our Core Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-850 space-y-4">
            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Design Leadership</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We constantly curate our catalogs to include the latest international tile patterns, matte finishes, and smart automation in sanitaries.
            </p>
          </div>

          <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-850 space-y-4">
            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Customer Centrality</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              From free layout consulting to delivery coordination, we prioritize your convenience and budget requirements at every touchpoint.
            </p>
          </div>

          <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-850 space-y-4">
            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Genuine Brand Spares</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We deal strictly in authentic branded merchandise, offering complete manufacturer warranties and original spares for faucets.
            </p>
          </div>
        </div>
      </section>

      {/* Brands We Deal In */}
      <section className="bg-zinc-950 border-y border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Authorized Brand Partners</h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-xs sm:text-sm">
            We partner with the world's most trusted manufacturers to bring you durable and aesthetically excellent products.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-4 items-center justify-center opacity-70">
            <span className="text-lg md:text-xl font-extrabold text-zinc-500 hover:text-white transition-colors cursor-default">
              KAJARIA
            </span>
            <span className="text-lg md:text-xl font-extrabold text-zinc-500 hover:text-white transition-colors cursor-default">
              SOMANY
            </span>
            <span className="text-lg md:text-xl font-extrabold text-zinc-500 hover:text-white transition-colors cursor-default">
              JAQUAR
            </span>
            <span className="text-lg md:text-xl font-extrabold text-zinc-500 hover:text-white transition-colors cursor-default">
              TOTO
            </span>
            <span className="text-lg md:text-xl font-extrabold text-zinc-500 hover:text-white transition-colors cursor-default">
              SIMPOLO
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

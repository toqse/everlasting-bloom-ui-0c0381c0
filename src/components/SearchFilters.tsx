import { useState } from "react";
import { Search, MapPin, Calendar, Heart, Users, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const SearchFilters = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Profiles", icon: Users },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "new", label: "New Profiles", icon: Sparkles },
    { id: "premium", label: "Premium", icon: Heart },
  ];

  return (
    <section id="search" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-rose/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-gold/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-rose border border-primary/10 mb-4">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Find Your Match</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your <span className="text-gradient-primary">Perfect Partner</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use our advanced search to find someone who truly understands you
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-card rounded-3xl p-8 shadow-elevated border border-primary/5 animate-scale-in">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-white text-foreground hover:bg-accent-rose border border-primary/10"
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Looking For */}
              <div className="relative group">
                <label className="block text-sm font-medium text-foreground mb-2">Looking For</label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                  <select className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:border-primary focus:ring-0 transition-all appearance-none cursor-pointer">
                    <option>Bride</option>
                    <option>Groom</option>
                  </select>
                </div>
              </div>

              {/* Age Range */}
              <div className="relative group">
                <label className="block text-sm font-medium text-foreground mb-2">Age Range</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                  <select className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:border-primary focus:ring-0 transition-all appearance-none cursor-pointer">
                    <option>21 - 25</option>
                    <option>26 - 30</option>
                    <option>31 - 35</option>
                    <option>36 - 40</option>
                    <option>40+</option>
                  </select>
                </div>
              </div>

              {/* Religion */}
              <div className="relative group">
                <label className="block text-sm font-medium text-foreground mb-2">Religion</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                  <select className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:border-primary focus:ring-0 transition-all appearance-none cursor-pointer">
                    <option>All Religions</option>
                    <option>Hindu</option>
                    <option>Muslim</option>
                    <option>Christian</option>
                    <option>Sikh</option>
                    <option>Buddhist</option>
                    <option>Jain</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="relative group">
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                  <select className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:border-primary focus:ring-0 transition-all appearance-none cursor-pointer">
                    <option>All India</option>
                    <option>Mumbai</option>
                    <option>Delhi NCR</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Hyderabad</option>
                    <option>Kolkata</option>
                    <option>Pune</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <Button variant="romantic" size="xl" className="min-w-[200px]">
                <Search className="w-5 h-5" />
                Search Profiles
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: Users, value: "10,000+", label: "Active Today" },
              { icon: Heart, value: "500+", label: "New Matches" },
              { icon: Sparkles, value: "50+", label: "Success Stories This Week" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-full shadow-soft">
                <stat.icon className="w-5 h-5 text-secondary" />
                <span className="font-bold text-foreground">{stat.value}</span>
                <span className="text-muted-foreground text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilters;

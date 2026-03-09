import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import { Button } from "@/components/ui/button";
import { Heart, Quote, ChevronLeft, ChevronRight, Play, Calendar, MapPin, Star, Sparkles, ArrowRight } from "lucide-react";
import { storiesData } from "@/components/SuccessStories";
import { useNavigate } from "react-router-dom";

const allStories = [
  ...storiesData,
  { id: 4, couple: "Vikram & Anita", image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=400&fit=crop", quote: "We connected over our love for music and art. Aiswarya Matrimony's matching algorithm truly understood our compatibility.", location: "Bangalore, India", marriedDate: "March 2024", yearsOnPlatform: "10 months" },
  { id: 5, couple: "Rohan & Kavitha", image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=400&fit=crop", quote: "Distance couldn't keep us apart. Aiswarya Matrimony bridged the gap and now we're building our life together.", location: "Hyderabad, India", marriedDate: "November 2023", yearsOnPlatform: "1 year" },
  { id: 6, couple: "Aditya & Pooja", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=400&fit=crop", quote: "Our parents were skeptical about online matrimony, but Aiswarya Matrimony's verification process gave them confidence.", location: "Pune, India", marriedDate: "April 2024", yearsOnPlatform: "7 months" },
];

const SuccessStoriesPage = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState(allStories[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const storiesPerPage = 3;
  const totalPages = Math.ceil(allStories.length / storiesPerPage);
  const paginatedStories = allStories.slice(currentPage * storiesPerPage, (currentPage + 1) * storiesPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner (same style as Contact page) */}
      <PageHeroBanner
        tagLabel="Real Love Stories"
        TagIcon={Heart}
        titlePart1="Love Stories That"
        titleHighlight="Inspire"
        description="Every love story is beautiful, but yours will be unique."
        backgroundImage="https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=1920&h=800&fit=crop"
      />

      {/* Featured Story & Content */}
      <section className="py-16 bg-gradient-romantic relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Featured Story */}
          <div className="max-w-5xl mx-auto animate-scale-in">
            <div className="bg-white rounded-3xl overflow-hidden shadow-elevated border border-primary/5">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto min-h-[400px] overflow-hidden group">
                  <img src={selectedStory.image} alt={selectedStory.couple} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-all animate-pulse-soft">
                    <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                  </button>
                  <div className="absolute top-6 right-6 w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-gold animate-bounce-soft">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center mb-6 shadow-gold animate-glow">
                    <Quote className="w-7 h-7 text-white" />
                  </div>
                  <blockquote className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed mb-8">
                    "{selectedStory.quote}"
                  </blockquote>
                  <div className="border-t border-primary/10 pt-6">
                    <h3 className="font-serif text-2xl font-bold text-gradient-primary mb-3 flex items-center gap-2">
                      {selectedStory.couple}
                      <Heart className="w-5 h-5 text-primary fill-primary animate-heart-beat" />
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1.5 text-sm bg-accent-gold/50 text-foreground px-3 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4 text-secondary" />{selectedStory.marriedDate}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm bg-accent-rose/50 text-foreground px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 text-primary" />{selectedStory.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
            More <span className="text-gradient-gold">Love Stories</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedStories.map((story, index) => (
              <div key={story.id}
                className={`bg-gradient-card rounded-2xl overflow-hidden shadow-card border border-primary/5 hover-lift cursor-pointer group animate-fade-in-up ${selectedStory.id === story.id ? "ring-2 ring-secondary" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedStory(story)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={story.image} alt={story.couple} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4"><h3 className="font-serif text-xl font-bold text-white">{story.couple}</h3></div>
                  <div className="absolute top-4 right-4"><Heart className="w-6 h-6 text-white fill-white/50 group-hover:fill-white transition-all" /></div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">"{story.quote}"</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{story.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{story.marriedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="p-2 rounded-lg bg-accent-rose hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)} className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i ? "bg-primary text-primary-foreground" : "bg-accent-rose hover:bg-primary/10 text-foreground"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} className="p-2 rounded-lg bg-accent-rose hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-light relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Ready to Write Your Own Love Story?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">Join thousands of happy couples who found their soulmate on Aiswarya Matrimony</p>
          <Button variant="gold" size="xl" className="group" onClick={() => navigate("/auth")}>
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;

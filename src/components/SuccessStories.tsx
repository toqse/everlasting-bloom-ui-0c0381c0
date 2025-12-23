import { useState } from "react";
import { Heart, Quote, ChevronLeft, ChevronRight, Play, Calendar } from "lucide-react";
import { Button } from "./ui/button";

interface Story {
  id: number;
  couple: string;
  image: string;
  quote: string;
  location: string;
  marriedDate: string;
  yearsOnPlatform: string;
}

const stories: Story[] = [
  {
    id: 1,
    couple: "Rahul & Priya",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    quote: "We found each other on EternalBond and knew instantly that this was meant to be. Our families connected beautifully, and now we're living our dream together.",
    location: "Mumbai, India",
    marriedDate: "December 2023",
    yearsOnPlatform: "6 months",
  },
  {
    id: 2,
    couple: "Arjun & Sneha",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop",
    quote: "The compatibility matching was spot on! We share the same values, dreams, and even love for travel. Thank you EternalBond for this beautiful journey.",
    location: "Delhi NCR",
    marriedDate: "February 2024",
    yearsOnPlatform: "8 months",
  },
  {
    id: 3,
    couple: "Karthik & Meera",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop",
    quote: "From the first message to our wedding day, every moment has been magical. EternalBond made finding true love so simple and beautiful.",
    location: "Chennai, India",
    marriedDate: "January 2024",
    yearsOnPlatform: "1 year",
  },
];

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section id="stories" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-pink/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-gold/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-rose border border-primary/10 mb-4 animate-fade-in-up">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Success Stories</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Real Love, <span className="text-gradient-primary">Real Stories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Join thousands of couples who found their forever love with EternalBond
          </p>
        </div>

        {/* Main Story Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative">
            {/* Main Story Card */}
            <div className="bg-gradient-card rounded-3xl overflow-hidden shadow-elevated border border-primary/5">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-80 lg:h-auto min-h-[400px]">
                  <img
                    src={stories[currentIndex].image}
                    alt={stories[currentIndex].couple}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent lg:bg-gradient-to-t" />
                  
                  {/* Play Button */}
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform group">
                    <Play className="w-6 h-6 text-primary ml-1 group-hover:text-primary-dark" fill="currentColor" />
                  </button>

                  {/* Progress Line */}
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                    <div className="flex gap-2">
                      {stories.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            i === currentIndex ? "bg-secondary" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-full bg-accent-gold flex items-center justify-center mb-6">
                    <Quote className="w-6 h-6 text-secondary" />
                  </div>

                  {/* Quote */}
                  <blockquote className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed mb-6">
                    "{stories[currentIndex].quote}"
                  </blockquote>

                  {/* Couple Info */}
                  <div className="border-t border-primary/10 pt-6">
                    <h3 className="font-serif text-2xl font-bold text-gradient-primary mb-2">
                      {stories[currentIndex].couple}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-secondary" />
                        Married {stories[currentIndex].marriedDate}
                      </span>
                      <span>•</span>
                      <span>{stories[currentIndex].location}</span>
                      <span>•</span>
                      <span>{stories[currentIndex].yearsOnPlatform} on platform</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center hover:shadow-elevated hover:scale-110 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center hover:shadow-elevated hover:scale-110 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Story Thumbnails */}
          <div className="hidden lg:flex justify-center gap-4 mt-8">
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-4 ring-secondary scale-110 shadow-gold"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={story.image}
                  alt={story.couple}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "1M+", label: "Happy Couples", icon: Heart },
            { value: "50+", label: "Daily Weddings", icon: Calendar },
            { value: "98%", label: "Success Rate", icon: Heart },
            { value: "4.9★", label: "User Rating", icon: Heart },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-card rounded-2xl shadow-card border border-primary/5 hover-lift"
            >
              <div className="w-12 h-12 rounded-full bg-accent-rose flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary fill-primary animate-pulse-soft" />
              </div>
              <div className="font-serif text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;

import { useState } from "react";
import { Heart, Quote, ChevronLeft, ChevronRight, Play, Calendar, MapPin, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export interface Story {
  id: number;
  couple: string;
  image: string;
  quote: string;
  location: string;
  marriedDate: string;
  yearsOnPlatform: string;
}

export const storiesData: Story[] = [
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
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % storiesData.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + storiesData.length) % storiesData.length);
  };

  return (
    <section id="stories" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-pink/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-gold/40 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-rose/30 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Floating Hearts */}
      {[...Array(5)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-primary/10 fill-primary/10 animate-float"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + (i % 2) * 60}%`,
            width: `${30 + i * 10}px`,
            height: `${30 + i * 10}px`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-rose border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
            <Heart className="w-4 h-4 text-primary fill-primary animate-heart-beat" />
            <span className="text-sm font-medium text-primary">Success Stories</span>
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
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
            <div className="bg-gradient-card rounded-3xl overflow-hidden shadow-elevated border border-primary/5 animate-scale-in">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-80 lg:h-auto min-h-[420px] overflow-hidden">
                  <img
                    src={storiesData[currentIndex].image}
                    alt={storiesData[currentIndex].couple}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent lg:bg-gradient-to-t" />
                  
                  {/* Play Button */}
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-all duration-300 group animate-pulse-soft">
                    <Play className="w-8 h-8 text-primary ml-1 group-hover:text-primary-dark transition-colors" fill="currentColor" />
                  </button>

                  {/* Floating decoration */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-secondary/80 rounded-full flex items-center justify-center animate-bounce-soft">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>

                  {/* Progress Dots - Mobile */}
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                    <div className="flex gap-2">
                      {storiesData.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            i === currentIndex ? "bg-secondary" : "bg-white/50 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                  {/* Sparkle decoration */}
                  <Sparkles className="absolute top-8 right-8 w-6 h-6 text-secondary/40 animate-sparkle" />
                  
                  {/* Quote Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center mb-6 shadow-gold animate-glow">
                    <Quote className="w-7 h-7 text-white" />
                  </div>

                  {/* Quote */}
                  <blockquote className="font-serif text-xl lg:text-2xl text-foreground leading-relaxed mb-8">
                    "{storiesData[currentIndex].quote}"
                  </blockquote>

                  {/* Couple Info */}
                  <div className="border-t border-primary/10 pt-6">
                    <h3 className="font-serif text-2xl font-bold text-gradient-primary mb-3 flex items-center gap-2">
                      {storiesData[currentIndex].couple}
                      <Heart className="w-5 h-5 text-primary fill-primary animate-heart-beat" />
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-accent-gold/50 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4 text-secondary" />
                        Married {storiesData[currentIndex].marriedDate}
                      </span>
                      <span className="flex items-center gap-1.5 bg-accent-rose/50 px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4 text-primary" />
                        {storiesData[currentIndex].location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevStory}
              className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-elevated flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all z-10 group"
            >
              <ChevronLeft className="w-6 h-6 text-primary group-hover:text-primary-dark" />
            </button>
            <button
              onClick={nextStory}
              className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-elevated flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all z-10 group"
            >
              <ChevronRight className="w-6 h-6 text-primary group-hover:text-primary-dark" />
            </button>
          </div>

          {/* Story Thumbnails - Desktop */}
          <div className="hidden lg:flex justify-center gap-4 mt-10">
            {storiesData.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-28 h-28 rounded-2xl overflow-hidden transition-all duration-500 hover-lift ${
                  index === currentIndex
                    ? "ring-4 ring-secondary scale-110 shadow-gold"
                    : "opacity-60 hover:opacity-100 shadow-card"
                }`}
              >
                <img
                  src={story.image}
                  alt={story.couple}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white animate-heart-beat" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
          {[
            { value: "1M+", label: "Happy Couples", icon: Heart },
            { value: "50+", label: "Daily Weddings", icon: Calendar },
            { value: "98%", label: "Success Rate", icon: Star },
            { value: "4.9★", label: "User Rating", icon: Sparkles },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-5 md:p-6 bg-gradient-card rounded-2xl shadow-card border border-primary/5 hover-lift group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-accent-rose flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                <stat.icon className="w-6 h-6 text-primary fill-primary/50 group-hover:animate-bounce-soft" />
              </div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="group"
            onClick={() => navigate("/success-stories")}
          >
            Read All Stories
            <Heart className="w-5 h-5 group-hover:animate-heart-beat" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;

import { User, PlusCircle } from "lucide-react";

interface Props {
  photos: string[];
  setPhotos: (p: string[]) => void;
}

const PhotosStep = ({ photos, setPhotos }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Add Photos</h1>
      <p className="text-muted-foreground text-sm">
        Add your photos to complete your profile. You can add up to 4 photos.
      </p>
    </div>
    <div className="flex justify-center mb-6">
      <div className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center bg-accent-rose overflow-hidden">
        {photos.length > 0 ? (
          <img src={photos[0]} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 text-primary/50" />
        )}
      </div>
    </div>
    <p className="font-medium text-foreground mb-3">All photos</p>
    <div className="grid grid-cols-2 gap-4">
      {photos.map((p, i) => (
        <div key={i} className="aspect-square rounded-2xl border-2 border-primary/10 bg-accent-rose flex items-center justify-center overflow-hidden relative group">
          <img src={p} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
      {photos.length < 4 && (
        <label className="aspect-square rounded-2xl border-2 border-primary/20 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-accent-rose transition-colors">
          <PlusCircle className="w-8 h-8 text-primary/50 mb-1" />
          <span className="text-sm text-primary font-medium">Add Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPhotos([...photos, url]);
              }
            }}
          />
        </label>
      )}
    </div>
  </>
);

export default PhotosStep;

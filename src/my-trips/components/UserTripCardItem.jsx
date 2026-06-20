import { getPlaceImage, getFallbackImage } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function UserTripCardItem({ trip, onDeleted, onRenamed }) {
  const destination = trip?.userSelction?.Destination;
  const displayName = trip?.customName || destination || "Unknown Location";

  const [photoUrl, setPhotoUrl] = useState(getFallbackImage(destination || "trip"));
  const [isLoading, setIsLoading] = useState(true);
  const [renameOpen, setRenameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!destination) {
      setIsLoading(false);
      return;
    }
    let active = true;
    // Free destination thumbnail from Wikipedia, with a curated fallback.
    getPlaceImage(destination).then((url) => {
      if (!active) return;
      if (url) setPhotoUrl(url);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [destination]);

  const handleDelete = async () => {
    if (!trip?.id) return;
    if (!window.confirm(`Delete "${displayName}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "AITrips", trip.id));
      toast.success("Trip deleted.");
      onDeleted?.(trip.id);
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Couldn't delete the trip. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleRename = async () => {
    const name = nameDraft.trim();
    if (!name || !trip?.id) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "AITrips", trip.id), { customName: name });
      toast.success("Trip renamed.");
      onRenamed?.(trip.id, name);
      setRenameOpen(false);
    } catch (error) {
      console.error("Error renaming trip:", error);
      toast.error("Couldn't rename the trip. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <Link to={"/view-trip/" + trip?.id}>
        <div className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-[200px] w-full overflow-hidden">
            {isLoading ? (
              <div className="h-full w-full animate-pulse bg-white/10" />
            ) : (
              <>
                <img
                  src={photoUrl}
                  alt={destination || "Trip Image"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(destination || "trip");
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                {trip?.userSelction?.budget && (
                  <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {trip.userSelction.budget}
                  </span>
                )}
                <h2 className="absolute bottom-3 left-4 right-12 truncate text-lg font-bold text-white drop-shadow">
                  {displayName}
                </h2>
              </>
            )}
          </div>
          {/* Meta */}
          <div className="flex items-center justify-between p-4">
            <p className="flex items-center gap-1.5 text-sm text-white/80">
              <span>📅</span>
              {trip?.userSelction?.days} {trip?.userSelction?.days == 1 ? "Day" : "Days"} trip
            </p>
            <span className="text-sm font-medium text-orange-400 transition-transform group-hover:translate-x-1">
              View →
            </span>
          </div>
        </div>
      </Link>

      {/* Actions menu — a sibling of the Link (not nested inside it), so its
          clicks never trigger card navigation. */}
      <Popover>
        <PopoverTrigger
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white outline-none backdrop-blur transition-colors hover:bg-black/65"
          aria-label="Trip options"
        >
          ⋯
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40 p-1">
          <button
            onClick={() => {
              setNameDraft(displayName);
              setRenameOpen(true);
            }}
            className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
          >
            ✏️ Rename
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="mt-0.5 block w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/15 disabled:opacity-50"
          >
            🗑️ Delete
          </button>
        </PopoverContent>
      </Popover>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white">Rename trip</DialogTitle>
            <DialogDescription className="text-white/60">
              Give this trip a custom name. Leave it to use the destination.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            placeholder={destination || "Trip name"}
            className="input-dark mt-2"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setRenameOpen(false)}
              className="rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={busy || !nameDraft.trim()}
              className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserTripCardItem;

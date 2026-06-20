import React, { useState } from "react";
import { toast } from "sonner";

// Share + export bar for a generated trip.
//   • Copy link / native share — the view-trip URL is public (the page loads
//     the trip by id straight from Firestore), so the link just works for anyone.
//   • Save as PDF — triggers the browser print dialog; a dedicated print
//     stylesheet (see index.css) renders the itinerary as a clean light document.
function TripActions({ trip }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const destination = trip?.userSelction?.Destination || "my trip";
  const shareTitle = `Trip to ${destination}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link — please copy it from the address bar.");
    }
  };

  const nativeShare = async () => {
    // Web Share API is mainly a mobile/secure-context feature; fall back to copy.
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl });
      } catch {
        /* user dismissed the share sheet — nothing to do */
      }
    } else {
      copyLink();
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="no-print mt-6 flex flex-wrap items-center gap-3">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
      >
        {copied ? "✅ Copied" : "🔗 Copy link"}
      </button>

      {canNativeShare && (
        <button
          onClick={nativeShare}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          📤 Share
        </button>
      )}

      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03] hover:from-orange-600 hover:to-orange-700"
      >
        📄 Save as PDF
      </button>
    </div>
  );
}

export default TripActions;

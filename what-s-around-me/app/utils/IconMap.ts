// Define the itemIcons map
export const itemIcons: Map<string, Map<string, string>> = new Map([
  [
    "amenity",
    new Map([
      ["hospital", "🏥"],
      ["clinic", "🏥"],
      ["pharmacy", "💊"],
      ["veterinary", "🐾"],
      ["school", "🎓"],
      ["restaurant", "🍴"],
      ["post_office", "📮"],
      ["government", "🏛️"],
      ["bank", "🏦"],
      ["fuel", "⛽"],
      ["bus_stop", "🚌"],
      ["community_centre", "🏠"],
      ["arts_centre", "🎨"],
      ["social_facility", "🫂"],
      ["embassy", "🏢"],
    ]),
  ],
  [
    "shop",
    new Map([
      ["supermarket", "🛒"],
      ["convenience", "🛍️"],
      ["mall", "🏬"],
      ["marketplace", "🛒"],
    ]),
  ],
  [
    "tourism",
    new Map([
      ["attraction", "🗺️"],
      ["hostel", "🏨"],
    ]),
  ],
  [
    "natural",
    new Map([
      ["wood", "🌲"],
      ["reserve", "🌳"],
    ]),
  ],
  [
    "leisure",
    new Map([
      ["park", "🌳"],
      ["sports_centre", "🏋️"],
      ["stadium", "🏟️"],
      ["pitch", "⚽"],
      ["track", "🏃"],
    ]),
  ],
  [
    "sport",
    new Map([
      ["soccer", "⚽"],
      ["tennis", "🎾"],
      ["basketball", "🏀"],
      ["swimming", "🏊"],
      ["running", "🏃"],
      ["cycling", "🚴"],
    ]),
  ],
]);

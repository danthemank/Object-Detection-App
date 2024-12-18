export const MARKET_SOURCES = {
  pokemon_card: [
    { name: "TCGPlayer", type: "marketplace", priority: 1 },
    { name: "eBay", type: "marketplace", priority: 2 },
    { name: "PSA", type: "grading", priority: 3 },
    { name: "Cardmarket", type: "marketplace", priority: 4 }
  ],
  sports_card: [
    { name: "PWCC", type: "marketplace", priority: 1 },
    { name: "eBay", type: "marketplace", priority: 2 },
    { name: "PSA", type: "grading", priority: 3 },
    { name: "Beckett", type: "grading", priority: 4 }
  ],
  action_figure: [
    { name: "eBay", type: "marketplace", priority: 1 },
    { name: "Amazon", type: "marketplace", priority: 2 },
    { name: "Mercari", type: "marketplace", priority: 3 },
    { name: "Heritage Auctions", type: "auction", priority: 4 }
  ],
  video_game: [
    { name: "PriceCharting", type: "price_guide", priority: 1 },
    { name: "eBay", type: "marketplace", priority: 2 },
    { name: "GameValueNow", type: "price_guide", priority: 3 },
    { name: "Heritage Auctions", type: "auction", priority: 4 }
  ],
  comic_book: [
    { name: "GoCollect", type: "price_guide", priority: 1 },
    { name: "eBay", type: "marketplace", priority: 2 },
    { name: "Heritage Auctions", type: "auction", priority: 3 },
    { name: "MyComicShop", type: "marketplace", priority: 4 }
  ],
  collectible: [
    { name: "eBay", type: "marketplace", priority: 1 },
    { name: "Heritage Auctions", type: "auction", priority: 2 },
    { name: "Mercari", type: "marketplace", priority: 3 },
    { name: "Etsy", type: "marketplace", priority: 4 }
  ]
};

export function getRelevantMarketSources(objectType) {
  return MARKET_SOURCES[objectType] || MARKET_SOURCES.collectible;
}

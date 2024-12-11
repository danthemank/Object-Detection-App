export const VALUE_THRESHOLDS = {
  pokemon_card: {
    not_valuable: 0,
    somewhat_valuable: 10, // $10-$49.99
    valuable: 50 // $50+
  },
  sports_card: {
    not_valuable: 0,
    somewhat_valuable: 20, // $20-$99.99
    valuable: 100 // $100+
  },
  video_game: {
    not_valuable: 0,
    somewhat_valuable: 30, // $30-$99.99
    valuable: 100 // $100+
  },
  collectible: {
    not_valuable: 0,
    somewhat_valuable: 50, // $50-$199.99
    valuable: 200 // $200+
  },
  default: {
    not_valuable: 0,
    somewhat_valuable: 25, // $25-$99.99
    valuable: 100 // $100+
  }
};

export function getValueCategory(price, type) {
  const thresholds = VALUE_THRESHOLDS[type] || VALUE_THRESHOLDS.default;
  
  if (price >= thresholds.valuable) {
    return 'Valuable';
  } else if (price >= thresholds.somewhat_valuable) {
    return 'Somewhat Valuable';
  }
  return 'Not Valuable';
}

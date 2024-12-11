// Value thresholds for different item types (in USD)
const VALUE_THRESHOLDS = {
  pokemon_card: {
    not_valuable: 0,
    somewhat_valuable: 10,
    valuable: 50
  },
  sports_card: {
    not_valuable: 0,
    somewhat_valuable: 20,
    valuable: 100
  },
  default: {
    not_valuable: 0,
    somewhat_valuable: 25,
    valuable: 100
  }
};

export function determineValueCategory(price, type) {
  const thresholds = VALUE_THRESHOLDS[type] || VALUE_THRESHOLDS.default;
  
  if (price >= thresholds.valuable) {
    return 'Valuable';
  } else if (price >= thresholds.somewhat_valuable) {
    return 'Somewhat Valuable';
  }
  return 'Not Valuable';
}

export function formatPriceRange(min, max) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  if (min === max) {
    return formatter.format(min);
  }
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

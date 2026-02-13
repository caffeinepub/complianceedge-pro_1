// Validation helpers for manual trade entry

export interface ManualTradeEntry {
  client_code: string;
  trade_date: string;
  exchange: string;
  segment: string;
  security: string;
  side: 'Buy' | 'Sell' | '';
  quantity: string;
  price: string;
  order_id: string;
  trade_id: string;
}

export interface ValidationErrors {
  client_code?: string;
  trade_date?: string;
  exchange?: string;
  segment?: string;
  security?: string;
  side?: string;
  quantity?: string;
  price?: string;
  order_id?: string;
  trade_id?: string;
}

export const ALLOWED_SIDES = ['Buy', 'Sell'] as const;

export function validateManualTrade(trade: ManualTradeEntry): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required field checks
  if (!trade.client_code.trim()) {
    errors.client_code = 'Client code is required';
  }

  if (!trade.trade_date.trim()) {
    errors.trade_date = 'Trade date is required';
  } else {
    // Validate date format
    const dateValue = new Date(trade.trade_date);
    if (isNaN(dateValue.getTime())) {
      errors.trade_date = 'Invalid date format';
    }
  }

  if (!trade.exchange.trim()) {
    errors.exchange = 'Exchange is required';
  }

  if (!trade.segment.trim()) {
    errors.segment = 'Segment is required';
  }

  if (!trade.security.trim()) {
    errors.security = 'Security is required';
  }

  if (!trade.side) {
    errors.side = 'Side is required';
  } else if (!ALLOWED_SIDES.includes(trade.side as any)) {
    errors.side = 'Side must be Buy or Sell';
  }

  if (!trade.quantity.trim()) {
    errors.quantity = 'Quantity is required';
  } else {
    const qty = parseFloat(trade.quantity);
    if (isNaN(qty) || qty <= 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
  }

  if (!trade.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const priceValue = parseFloat(trade.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Price must be a positive number';
    }
  }

  if (!trade.order_id.trim()) {
    errors.order_id = 'Order ID is required';
  }

  if (!trade.trade_id.trim()) {
    errors.trade_id = 'Trade ID is required';
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function createEmptyTrade(): ManualTradeEntry {
  return {
    client_code: '',
    trade_date: '',
    exchange: '',
    segment: '',
    security: '',
    side: '',
    quantity: '',
    price: '',
    order_id: '',
    trade_id: '',
  };
}

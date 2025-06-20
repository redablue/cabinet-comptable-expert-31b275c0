
export const formatMAD = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-MA').format(number);
};

// Conformité TVA Maroc (20%)
export const TVA_RATE = 0.20;

export const calculateTVA = (amountHT: number): number => {
  return amountHT * TVA_RATE;
};

export const calculateTTC = (amountHT: number): number => {
  return amountHT * (1 + TVA_RATE);
};

import { cache } from "react";

export const revalidate = 3600; // revalidate the data at most every hour

export const getPubkey = cache(async () => {
  try {
    const response = await fetch("https://api.monobank.ua/api/merchant/pubkey");

    const { pubkey } = (await response.json()) as { pubkey: string };

    if (response.ok) {
      return pubkey;
    }

    return false;
  } catch (error) {
    return false;
  }
});

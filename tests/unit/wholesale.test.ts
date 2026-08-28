import { describe, it, expect } from "vitest";
import { calculateWholesaleSettlement } from "@/lib/wholesale/wholesale-calculator";
import { store } from "@/lib/store";

describe("Wholesale B2B Auction & Exchange Engine", () => {
  it("calculates 1.5% buyer fee correctly", () => {
    const res = calculateWholesaleSettlement(10000000);
    expect(res.wholesalePriceCLP).toBe(10000000);
    expect(res.platformFeeCLP).toBe(150000);
    expect(res.totalBuyerPaysCLP).toBe(10150000);
    expect(res.netSellerReceivesCLP).toBe(10000000);
  });

  it("places higher bid and updates highest bidder atomically", () => {
    const listings = store.getWholesaleListings();
    const target = listings[0];
    const initialPrice = target.currentHighestBidCLP || target.startingPriceCLP;

    const bid = store.placeWholesaleBid(target.id, "tenant-test", "Automotora Bilbao", initialPrice + 200000);
    expect(bid).toBeDefined();
    expect(target.currentHighestBidCLP).toBe(initialPrice + 200000);
    expect(target.highestBidderTenantName).toBe("Automotora Bilbao");
  });

  it("closes listing as SOLD when bid equals or exceeds Buy Now price", () => {
    const listings = store.getWholesaleListings();
    const target = listings[0];
    store.placeWholesaleBid(target.id, "tenant-test", "Automotora Bilbao", target.buyNowPriceCLP);
    expect(target.status).toBe("SOLD");
  });
});

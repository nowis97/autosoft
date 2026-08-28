/**
 * Autosoft 360 - Mercado Libre Chile (MLC) Automotive Sync Engine
 * Handles OAuth2 token expiration checks, category mapping, and payload formatting.
 */

export interface MLVehicleItemInput {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  priceCLP: number;
  description: string;
  images: string[];
  licensePlate: string;
}

export interface MLItemAttribute {
  id: string;
  value_name: string;
}

export interface MLItemPayload {
  title: string;
  category_id: string;
  price: number;
  currency_id: "CLP";
  available_quantity: number;
  buying_mode: "classified";
  listing_type_id: "gold_premium" | "gold" | "silver" | "free";
  condition: "used";
  pictures: Array<{ source: string }>;
  attributes: MLItemAttribute[];
  description: {
    plain_text: string;
  };
}

export interface MLRemoteItem {
  localVehicleId: string;
  mlItemId: string;
  price: number;
  status: string;
}

export interface MLSyncDiff {
  toCreate: MLVehicleItemInput[];
  toUpdate: Array<{ localVehicle: MLVehicleItemInput; remoteItem: MLRemoteItem }>;
  inSync: MLVehicleItemInput[];
}

/**
 * Builds the official Mercado Libre Chile (MLC) classified payload
 */
export function buildMercadoLibreItemPayload(
  vehicle: MLVehicleItemInput,
  listingType: "gold_premium" | "gold" | "silver" | "free" = "gold_premium"
): MLItemPayload {
  return {
    title: vehicle.title,
    category_id: "MLC1744", // MLC Automotive classified category
    price: vehicle.priceCLP,
    currency_id: "CLP",
    available_quantity: 1,
    buying_mode: "classified",
    listing_type_id: listingType,
    condition: "used",
    pictures: vehicle.images.map((img) => ({ source: img })),
    attributes: [
      { id: "BRAND", value_name: vehicle.brand },
      { id: "MODEL", value_name: vehicle.model },
      { id: "VEHICLE_YEAR", value_name: String(vehicle.year) },
      { id: "KILOMETERS", value_name: `${vehicle.mileage} km` },
      { id: "LICENSE_PLATE", value_name: vehicle.licensePlate },
    ],
    description: {
      plain_text: vehicle.description,
    },
  };
}

/**
 * Checks if an OAuth2 token is expired (including a 5-minute safety buffer)
 */
export function isTokenExpired(expiresAtTimestampMs: number): boolean {
  const safetyBufferMs = 5 * 60 * 1000; // 5 minutes
  return Date.now() + safetyBufferMs >= expiresAtTimestampMs;
}

/**
 * Calculates synchronization diff between local vehicle stock and remote published MLC items
 */
export function calculateSyncStatus(
  localVehicles: MLVehicleItemInput[],
  remoteItems: MLRemoteItem[]
): MLSyncDiff {
  const remoteMap = new Map<string, MLRemoteItem>();
  for (const item of remoteItems) {
    remoteMap.set(item.localVehicleId, item);
  }

  const toCreate: MLVehicleItemInput[] = [];
  const toUpdate: Array<{ localVehicle: MLVehicleItemInput; remoteItem: MLRemoteItem }> = [];
  const inSync: MLVehicleItemInput[] = [];

  for (const local of localVehicles) {
    const remote = remoteMap.get(local.id);
    if (!remote) {
      toCreate.push(local);
    } else if (remote.price !== local.priceCLP || remote.status !== "active") {
      toUpdate.push({ localVehicle: local, remoteItem: remote });
    } else {
      inSync.push(local);
    }
  }

  return { toCreate, toUpdate, inSync };
}

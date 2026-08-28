import { store } from "@/lib/store";
import { Vehicle, Lead, ServiceOrder, TradeInValuation, TransferOrder } from "@/types";

export class MultiTenantRepository {
  async getTenant(slug?: string) {
    return store.getTenant(slug);
  }

  async getVehicles(tenantId: string): Promise<Vehicle[]> {
    return store.getVehicles().filter((v) => v.tenantId === tenantId);
  }

  async getVehicleById(tenantId: string, id: string): Promise<Vehicle | undefined> {
    const v = store.getVehicleById(id);
    return v && v.tenantId === tenantId ? v : undefined;
  }

  async createVehicle(tenantId: string, data: Omit<Vehicle, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Vehicle> {
    return store.createVehicle({
      ...data,
      tenantId,
    });
  }

  async getLeads(tenantId: string): Promise<Lead[]> {
    return store.getLeads().filter((l) => l.tenantId === tenantId);
  }

  async getServiceOrders(tenantId: string): Promise<ServiceOrder[]> {
    return store.getServiceOrders().filter((o) => o.tenantId === tenantId);
  }

  async getValuations(tenantId: string): Promise<TradeInValuation[]> {
    return store.getValuations().filter((v) => v.tenantId === tenantId);
  }

  async getTransfers(tenantId: string): Promise<TransferOrder[]> {
    return store.getTransfers().filter((t) => t.tenantId === tenantId);
  }
}

export const repository = new MultiTenantRepository();

import { store } from "./store";
import { Vehicle, Lead, FinancingApplication, TransferOrder, ServiceOrder } from "@/types";

export interface IAutosoftRepository {
  getVehicles(): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | undefined>;
  getLeads(): Promise<Lead[]>;
  getServiceOrders(): Promise<ServiceOrder[]>;
  getTransfers(): Promise<TransferOrder[]>;
}

export class AutosoftHybridRepository implements IAutosoftRepository {
  private isPostgresActive = !!process.env.DATABASE_URL;

  async getVehicles(): Promise<Vehicle[]> {
    return store.getVehicles();
  }

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    return store.getVehicleById(id);
  }

  async getLeads(): Promise<Lead[]> {
    return store.getLeads();
  }

  async getServiceOrders(): Promise<ServiceOrder[]> {
    return store.getServiceOrders();
  }

  async getTransfers(): Promise<TransferOrder[]> {
    return store.getTransfers();
  }
}

export const repository = new AutosoftHybridRepository();

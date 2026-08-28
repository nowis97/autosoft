import { store } from "@/lib/store";

export async function seedDatabase() {
  console.log("Seeding Autosoft multi-tenant database with initial Chilean catalog...");

  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const leads = store.getLeads();
  const orders = store.getServiceOrders();

  console.log(`[Seed] Tenant: ${tenant.name} (RUT: ${tenant.rut})`);
  console.log(`[Seed] Loaded ${vehicles.length} vehicles with Chilean license plates.`);
  console.log(`[Seed] Loaded ${leads.length} leads with WhatsApp & AI scoring.`);
  console.log(`[Seed] Loaded ${orders.length} service work orders for reconditioning.`);

  return {
    success: true,
    tenantCount: 1,
    vehicleCount: vehicles.length,
    leadCount: leads.length,
    serviceOrderCount: orders.length,
  };
}

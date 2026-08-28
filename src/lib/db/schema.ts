import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", [
  "SUPERADMIN",
  "DEALER_OWNER",
  "DEALER_MANAGER",
  "DEALER_SALES_REP",
]);

export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "IN_MAINTENANCE",
]);

export const transmissionEnum = pgEnum("transmission", [
  "MANUAL",
  "AUTOMATICA",
]);

export const fuelTypeEnum = pgEnum("fuel_type", [
  "BENCINA",
  "DIESEL",
  "HIBRIDO",
  "ELECTRICO",
]);

export const bodyTypeEnum = pgEnum("body_type", [
  "SUV",
  "SEDAN",
  "HATCHBACK",
  "CAMIONETA",
  "COUPE",
  "UTILITARIO",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export const leadChannelEnum = pgEnum("lead_channel", [
  "WEB",
  "WHATSAPP",
  "CHILEAUTOS",
  "MERCADOLIBRE",
  "WALK_IN",
]);

export const leadTemperatureEnum = pgEnum("lead_temperature", [
  "HOT",
  "WARM",
  "COLD",
]);

export const financingStatusEnum = pgEnum("financing_status", [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "FUNDED",
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "DRAFT",
  "INSPECTION_PENDING",
  "SIGNATURE_PENDING",
  "REGISTERED",
  "REJECTED",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "MECANICA",
  "PINTURA_DESABOLLADURA",
  "NEUMATICOS_FRENOS",
  "DETAILING_ESTETICA",
  "TRAMITES_REVISION",
]);

export const serviceOrderStatusEnum = pgEnum("service_order_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

// 1. Tenants Table
export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  rut: text("rut").notNull(),
  customDomain: text("custom_domain"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#2563eb"),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  tagline: text("tagline"),
  bannerUrl: text("banner_url"),
  chileautosToken: text("chileautos_token"),
  mercadolibreConnected: boolean("mercadolibre_connected").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: roleEnum("role").default("DEALER_SALES_REP").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("user_tenant_idx").on(table.tenantId),
]);

// 3. Vehicles Table
export const vehicles = pgTable("vehicles", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  licensePlate: text("license_plate").notNull(),
  vin: text("vin"),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  version: text("version").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  bodyType: bodyTypeEnum("body_type").notNull(),
  color: text("color").notNull(),
  priceCash: integer("price_cash").notNull(),
  priceFinanced: integer("price_financed"),
  acquisitionCost: integer("acquisition_cost"),
  status: vehicleStatusEnum("status").default("AVAILABLE").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().default([]).notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  publishedToWeb: boolean("published_to_web").default(true).notNull(),
  publishedToMercadolibre: boolean("published_to_mercadolibre").default(false).notNull(),
  publishedToChileautos: boolean("published_to_chileautos").default(false).notNull(),
  publishedToYapo: boolean("published_to_yapo").default(false).notNull(),
  daysInStock: integer("days_in_stock").default(1),
  reconditioningCostCLP: integer("reconditioning_cost_clp").default(0),
  reconditioningStatus: text("reconditioning_status").default("LISTO_PARA_EXHIBIR"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("vehicle_tenant_idx").on(table.tenantId),
  index("vehicle_tenant_status_idx").on(table.tenantId, table.status),
  index("vehicle_tenant_plate_idx").on(table.tenantId, table.licensePlate),
]);

// 4. Leads Table
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  vehicleId: text("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  assignedUserId: text("assigned_user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  rut: text("rut"),
  channel: leadChannelEnum("channel").default("WHATSAPP").notNull(),
  status: leadStatusEnum("status").default("NEW").notNull(),
  notes: text("notes"),
  financingRequested: boolean("financing_requested").default(false),
  downPayment: integer("down_payment"),
  termMonths: integer("term_months"),
  aiLeadScore: integer("ai_lead_score").default(30),
  aiTemperature: leadTemperatureEnum("ai_temperature").default("COLD"),
  aiSummary: text("ai_summary"),
  tradeInDetails: jsonb("trade_in_details").$type<{
    brand: string;
    model: string;
    year: number;
    mileage: number;
    expectedPrice?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("lead_tenant_idx").on(table.tenantId),
  index("lead_tenant_status_idx").on(table.tenantId, table.status),
]);

// 5. Financing Applications Table
export const financingApplications = pgTable("financing_applications", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  applicantName: text("applicant_name").notNull(),
  applicantRut: text("applicant_rut").notNull(),
  applicantEmail: text("applicant_email"),
  applicantPhone: text("applicant_phone"),
  monthlyIncome: integer("monthly_income").notNull(),
  downPayment: integer("down_payment").notNull(),
  termMonths: integer("term_months").notNull(),
  employmentStatus: text("employment_status").notNull(),
  financialPartner: text("financial_partner").default("FORUM"),
  status: financingStatusEnum("status").default("SUBMITTED").notNull(),
  estimatedMonthlyPayment: integer("estimated_monthly_payment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("financing_tenant_idx").on(table.tenantId),
]);

// 6. Transfer Orders Table
export const transferOrders = pgTable("transfer_orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  buyerName: text("buyer_name").notNull(),
  buyerRut: text("buyer_rut").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerAddress: text("buyer_address").notNull(),
  buyerCity: text("buyer_city").notNull(),
  salePrice: integer("sale_price").notNull(),
  fiscalAppraisal: integer("fiscal_appraisal").notNull(),
  transferTax15: integer("transfer_tax_15").notNull(),
  notaryFee: integer("notary_fee").default(28000).notNull(),
  civilRegistryFee: integer("civil_registry_fee").default(30490).notNull(),
  totalCost: integer("total_cost").notNull(),
  status: transferStatusEnum("status").default("SIGNATURE_PENDING").notNull(),
  autofactReport: jsonb("autofact_report").notNull(),
  deliveryAct: jsonb("delivery_act"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("transfer_tenant_idx").on(table.tenantId),
]);

// 7. Insurance Policies Table
export const insurancePolicies = pgTable("insurance_policies", {
  id: text("id").primaryKey(),
  transferId: text("transfer_id").notNull().references(() => transferOrders.id, { onDelete: "cascade" }),
  carrier: text("carrier").notNull(),
  policyNumber: text("policy_number").notNull(),
  monthlyPremiumCLP: integer("monthly_premium_clp").notNull(),
  deductibleUF: integer("deductible_uf").notNull(),
  dealerCommissionCLP: integer("dealer_commission_clp").notNull(),
  status: text("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Trade-In Valuations Table
export const tradeInValuations = pgTable("trade_in_valuations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  licensePlate: text("license_plate").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  version: text("version").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  condition: text("condition").notNull(),
  estimatedMarketPrice: integer("estimated_market_price").notNull(),
  quickOffer: integer("quick_offer").notNull(),
  recommendedOffer: integer("recommended_offer").notNull(),
  maxOffer: integer("max_offer").notNull(),
  reconditioningEstimateCLP: integer("reconditioning_estimate_clp").notNull(),
  expectedGrossProfitCLP: integer("expected_gross_profit_clp").notNull(),
  clientName: text("client_name"),
  clientPhone: text("client_phone"),
  status: text("status").default("DRAFT").notNull(),
  convertedToVehicleId: text("converted_to_vehicle_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("valuation_tenant_idx").on(table.tenantId),
]);

// 9. Appointment Bookings Table
export const appointmentBookings = pgTable("appointment_bookings", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  leadName: text("lead_name").notNull(),
  leadPhone: text("lead_phone").notNull(),
  vehicleName: text("vehicle_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").default("SCHEDULED").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("appointment_tenant_idx").on(table.tenantId),
]);

// 10. Service Orders Table
export const serviceOrders = pgTable("service_orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  category: serviceCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  providerName: text("provider_name").notNull(),
  costCLP: integer("cost_clp").notNull(),
  invoiceNumber: text("invoice_number"),
  status: serviceOrderStatusEnum("status").default("PENDING").notNull(),
  estimatedCompletionDate: text("estimated_completion_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("service_tenant_idx").on(table.tenantId),
  index("service_vehicle_idx").on(table.vehicleId),
]);

// Drizzle Relations
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  vehicles: many(vehicles),
  leads: many(leads),
  serviceOrders: many(serviceOrders),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [vehicles.tenantId],
    references: [tenants.id],
  }),
  serviceOrders: many(serviceOrders),
  leads: many(leads),
}));

export const serviceOrdersRelations = relations(serviceOrders, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [serviceOrders.vehicleId],
    references: [vehicles.id],
  }),
  tenant: one(tenants, {
    fields: [serviceOrders.tenantId],
    references: [tenants.id],
  }),
}));

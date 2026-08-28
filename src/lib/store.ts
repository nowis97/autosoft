import {
  Tenant,
  User,
  Vehicle,
  Lead,
  FinancingApplication,
  TransferOrder,
  InsurancePolicy,
  TradeInValuation,
  AppointmentBooking,
  ServiceOrder,
  Consignment,
  InvoiceDTE,
  TenantSubscription,
  SubscriptionPlanTier,
  AuditLog,
  VehicleInspection,
  WholesaleListing,
  WholesaleBid,
  WarrantyTicket,
  AftersalesReminder,
} from "@/types";
import {
  INITIAL_TENANT,
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_LEADS,
  INITIAL_APPLICATIONS,
} from "./mock-data";
import { calculateTransferTaxes } from "./chilean-utils/tax-calculator";
import { calculateConsignmentSettlement } from "./consignments/consignment-calculator";
import { calculateUsedCarInvoiceTaxes } from "./chilean-utils/tax-invoicing";
import { calculateInspectionScore, INSPECTION_50_POINTS_TEMPLATE } from "./inspection/inspection-engine";
import { calculateWholesaleSettlement } from "./wholesale/wholesale-calculator";

const initialWholesaleListings: WholesaleListing[] = [
  {
    id: "who-1",
    sellerTenantId: "tenant-oriente-1",
    sellerTenantName: "Automotora Oriente",
    vehicleId: "veh-4",
    brand: "Suzuki",
    model: "Baleno 1.4 GLX",
    year: 2020,
    mileage: 68000,
    licensePlate: "LKJW23",
    daysInStock: 52,
    inspectionScore: 88,
    startingPriceCLP: 7200000,
    buyNowPriceCLP: 7600000,
    currentHighestBidCLP: 7400000,
    highestBidderTenantId: "tenant-sur-1",
    highestBidderTenantName: "Autos del Sur (Concepción)",
    status: "OPEN",
    expiresAt: "2026-08-30T18:00:00Z",
    createdAt: "2026-08-25T10:00:00Z",
  },
  {
    id: "who-2",
    sellerTenantId: "tenant-norte-1",
    sellerTenantName: "Automotora Bilbao",
    vehicleId: "veh-ext-1",
    brand: "Nissan",
    model: "Kicks 1.6 Advance CVT",
    year: 2019,
    mileage: 54000,
    licensePlate: "PRTG77",
    daysInStock: 48,
    inspectionScore: 91,
    startingPriceCLP: 10200000,
    buyNowPriceCLP: 10800000,
    currentHighestBidCLP: 10450000,
    highestBidderTenantId: "tenant-oriente-1",
    highestBidderTenantName: "Automotora Oriente",
    status: "OPEN",
    expiresAt: "2026-08-31T12:00:00Z",
    createdAt: "2026-08-26T14:00:00Z",
  },
];

const initialWarrantyTickets: WarrantyTicket[] = [
  {
    id: "war-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-6",
    clientName: "Gonzalo Valenzuela",
    clientPhone: "+56 9 9876 5432",
    clientRut: "11.111.111-1",
    issueDescription: "Ruido anormal en sensor de reversa y luz testigo de presión de neumáticos.",
    category: "SISTEMA_ELECTRICO",
    status: "IN_REPAIR",
    deliveryDate: "2026-08-25",
    warrantyExpiryDate: "2027-02-25",
    createdAt: "2026-08-27T09:30:00Z",
  },
];

const initialAftersalesReminders: AftersalesReminder[] = [
  {
    id: "rem-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-6",
    clientName: "Gonzalo Valenzuela",
    clientPhone: "+56 9 9876 5432",
    vehicleDescription: "Jeep Grand Cherokee Limited 3.6 (2019)",
    reminderType: "30_DAYS_CHECK",
    dueDate: "2026-09-25",
    status: "PENDING",
    messageText: "Hola Gonzalo, de Automotora Oriente esperamos que estés disfrutando tu Jeep Grand Cherokee. Te invitamos a agendar tu chequeo gratuito de los 30 días para revisar niveles y presión.",
    createdAt: "2026-08-25T16:00:00Z",
  },
];

const initialInspections: VehicleInspection[] = [
  {
    id: "insp-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-1",
    inspectorName: "Claudio Morales",
    inspectorRut: "15.981.204-9",
    receptionMileage: 42350,
    fuelLevel: "3/4",
    score: 92,
    rating: "EXCELENTE",
    items: INSPECTION_50_POINTS_TEMPLATE.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      status: t.id === "car-6" ? "WARNING" : "PASS",
      notes: t.id === "car-6" ? "Raspón superficial en borde inferior parachoques" : undefined,
    })),
    damagePoints: [
      {
        id: "dmg-1",
        x: 18,
        y: 82,
        type: "RAYON",
        severity: "LEVE",
        description: "Raspón menor en esquina parachoques delantero",
      },
    ],
    clientSignature: "Signed by Marcela Contreras",
    inspectorSignature: "Signed by Claudio Morales (Inspector Oficial)",
    reconditioningEstimateCLP: 185000,
    status: "COMPLETED",
    createdAt: "2026-08-25T11:00:00Z",
  },
  {
    id: "insp-2",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-2",
    inspectorName: "Claudio Morales",
    inspectorRut: "15.981.204-9",
    receptionMileage: 28900,
    fuelLevel: "1/2",
    score: 84,
    rating: "BUENO",
    items: INSPECTION_50_POINTS_TEMPLATE.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      status: t.id === "car-6" ? "FAIL" : t.id === "neu-1" ? "WARNING" : "PASS",
      notes: t.id === "car-6" ? "Abolladura con pintura saltada requiere repintado" : undefined,
    })),
    damagePoints: [
      {
        id: "dmg-2",
        x: 52,
        y: 22,
        type: "ABOLLADURA",
        severity: "MODERADO",
        description: "Abolladura en puerta trasera derecha",
      },
    ],
    clientSignature: "Signed by Patricia Undurraga",
    inspectorSignature: "Signed by Claudio Morales",
    reconditioningEstimateCLP: 220000,
    status: "COMPLETED",
    createdAt: "2026-08-26T15:30:00Z",
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "aud-1",
    tenantId: "tenant-oriente-1",
    userId: "usr-3",
    userName: "Matías Silva",
    userRole: "DEALER_SALES_REP",
    actionType: "PRICE_CHANGE",
    severity: "WARNING",
    entityType: "VEHICLE",
    entityId: "veh-1",
    entityName: "Toyota RAV4 (2021) - Patente BB·CL·12",
    details: "Rebaja de precio contado de $16.990.000 a $16.490.000 (-$500.000 CLP).",
    previousValue: { priceCash: 16990000 },
    newValue: { priceCash: 16490000 },
    ipAddress: "190.160.45.112 (Santiago, CL)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0.0.0",
    timestamp: "2026-08-27T18:30:00Z",
  },
  {
    id: "aud-2",
    tenantId: "tenant-oriente-1",
    userId: "usr-3",
    userName: "Matías Silva",
    userRole: "DEALER_SALES_REP",
    actionType: "LEAD_EXPORT",
    severity: "CRITICAL",
    entityType: "LEAD",
    entityId: "export-leads-all",
    entityName: "Exportación Cartera de Clientes (CSV)",
    details: "Descarga masiva de 142 leads con números de teléfono y cotizaciones de crédito.",
    ipAddress: "190.160.45.112 (Santiago, CL)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0.0.0",
    timestamp: "2026-08-27T19:15:00Z",
  },
  {
    id: "aud-3",
    tenantId: "tenant-oriente-1",
    userId: "usr-1",
    userName: "Rodrigo Valenzuela",
    userRole: "DEALER_OWNER",
    actionType: "DTE_ISSUED",
    severity: "INFO",
    entityType: "INVOICE",
    entityId: "dte-1",
    entityName: "Factura Electrónica DTE 33 Folio N° 1042",
    details: "Emisión de DTE 33 con régimen IVA sobre Margen (Ley 21.420) por $22.990.000 CLP.",
    ipAddress: "200.89.67.24 (Las Condes, CL)",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0",
    timestamp: "2026-08-25T16:30:00Z",
  },
];

const initialSubscription: TenantSubscription = {
  tier: "PRO",
  priceUF: 5.0,
  maxVehicles: 45,
  maxUsers: 5,
  aiPhotoCreditsMonthly: 100,
  aiPhotoCreditsUsed: 42,
  aiCopilotChatsMonthly: 500,
  aiCopilotChatsUsed: 128,
  billingCycle: "MONTHLY",
  paymentMethod: {
    type: "CREDIT_CARD",
    brand: "Visa",
    last4: "8841",
    bankName: "Banco de Chile",
  },
  nextBillingDate: "2026-09-25",
  status: "ACTIVE",
};

const initialInvoices: InvoiceDTE[] = [
  {
    id: "dte-1",
    tenantId: "tenant-oriente-1",
    folio: 1042,
    dteType: "33",
    vehicleId: "veh-6",
    receiverName: "Gonzalo Valenzuela",
    receiverRut: "11.111.111-1",
    receiverAddress: "Av. Vitacura 5400",
    receiverCity: "Vitacura, Santiago",
    receiverEmail: "gonzalo.valenzuela@correo.cl",
    description: "Venta Vehículo Usado Jeep Grand Cherokee Limited 3.6 (2019) Patente CD1234 - IVA sobre Margen Ley 21.420",
    exemptAmountCLP: 17000000,
    netTaxableAmountCLP: 5033613,
    vat19CLP: 956387,
    totalCLP: 22990000,
    siiStatus: "ACCEPTED",
    siiTrackId: "SII-TRK-8812903",
    issuedAt: "2026-08-25T16:30:00Z",
  },
];

const initialTransfers: TransferOrder[] = [
  {
    id: "trans-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-6",
    buyerName: "Gonzalo Valenzuela",
    buyerRut: "11.111.111-1",
    buyerPhone: "+56 9 9876 5432",
    buyerEmail: "gonzalo.valenzuela@correo.cl",
    buyerAddress: "Av. Vitacura 5400",
    buyerCity: "Vitacura, Santiago",
    salePrice: 22990000,
    fiscalAppraisal: 19500000,
    transferTax15: 344850,
    notaryFee: 28000,
    civilRegistryFee: 30490,
    totalCost: 403340,
    status: "REGISTERED",
    autofactReport: {
      hasFines: false,
      tagFinesCount: 0,
      hasEncumbrance: false,
      isStolen: false,
      technicalInspectionValid: true,
      technicalInspectionExpiry: "2026-11-30",
      soapValid: true,
      ownersCount: 1,
      mileageRecord: 54000,
    },
    insurancePolicy: {
      id: "pol-1",
      transferId: "trans-1",
      carrier: "BCI Seguros",
      policyNumber: "BCI-AUT-89214",
      monthlyPremiumCLP: 54900,
      deductibleUF: 3,
      dealerCommissionCLP: 45000,
      status: "ACTIVE",
      createdAt: "2026-08-25T14:30:00Z",
    },
    deliveryAct: {
      deliveredMileage: 54200,
      fuelLevel: "Lleno",
      hasSpareTire: true,
      hasToolkit: true,
      hasDuplicateKey: true,
      hasTriangleAndVest: true,
      hasManuals: true,
      cleanExterior: true,
      cleanInterior: true,
      signedAt: "2026-08-25T16:00:00Z",
      receiverName: "Gonzalo Valenzuela",
      receiverRut: "11.111.111-1",
    },
    createdAt: "2026-08-25T10:00:00Z",
    completedAt: "2026-08-25T16:15:00Z",
  },
];

const initialValuations: TradeInValuation[] = [
  {
    id: "val-1",
    tenantId: "tenant-oriente-1",
    licensePlate: "LKJW23",
    brand: "Hyundai",
    model: "Accent",
    version: "1.4 GL MT",
    year: 2019,
    mileage: 62000,
    condition: "GOOD",
    estimatedMarketPrice: 8900000,
    quickOffer: 7120000,
    recommendedOffer: 7480000,
    maxOffer: 7830000,
    reconditioningEstimateCLP: 350000,
    expectedGrossProfitCLP: 1070000,
    clientName: "Marcela Contreras",
    clientPhone: "+56 9 8234 5678",
    status: "OFFERED",
    createdAt: "2026-08-26T14:30:00Z",
  },
];

const initialAppointments: AppointmentBooking[] = [
  {
    id: "appo-1",
    tenantId: "tenant-oriente-1",
    leadName: "Felipe Albornoz",
    leadPhone: "+56 9 9123 4567",
    vehicleName: "Toyota RAV4 (2021)",
    date: "2026-08-29",
    time: "11:00 AM",
    status: "CONFIRMED",
    notes: "Agendado automáticamente por Copiloto IA de WhatsApp.",
    createdAt: "2026-08-27T12:00:00Z",
  },
];

const initialServiceOrders: ServiceOrder[] = [
  {
    id: "srv-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-1",
    category: "MECANICA",
    description: "Mantención de 40.000 km: cambio de aceite sintético 5W30, filtro de aceite y filtro de aire.",
    providerName: "Taller Mecánico Oficial Oriente",
    costCLP: 185000,
    invoiceNumber: "FAC-88129",
    status: "COMPLETED",
    completedAt: "2026-08-12T16:00:00Z",
    createdAt: "2026-08-11T10:00:00Z",
  },
  {
    id: "srv-2",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-1",
    category: "DETAILING_ESTETICA",
    description: "Pulido cerámico 3 pasos y limpieza profunda de tapiz.",
    providerName: "Detailing Center Las Condes",
    costCLP: 140000,
    invoiceNumber: "BOL-4412",
    status: "COMPLETED",
    completedAt: "2026-08-14T18:00:00Z",
    createdAt: "2026-08-13T09:00:00Z",
  },
  {
    id: "srv-3",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-2",
    category: "PINTURA_DESABOLLADURA",
    description: "Pintura y retoque de parachoques delantero por raspones de estacionamiento.",
    providerName: "Taller Pintura AutoExpress",
    costCLP: 220000,
    invoiceNumber: "FAC-90114",
    status: "IN_PROGRESS",
    estimatedCompletionDate: "2026-08-28",
    createdAt: "2026-08-24T11:00:00Z",
  },
  {
    id: "srv-4",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-4",
    category: "NEUMATICOS_FRENOS",
    description: "Cambio de 2 neumáticos delanteros 185/65 R15 y cambio de pastillas de freno.",
    providerName: "Neumateca Central",
    costCLP: 280000,
    invoiceNumber: "FAC-10294",
    status: "COMPLETED",
    completedAt: "2026-08-08T15:00:00Z",
    createdAt: "2026-08-06T14:00:00Z",
  },
];

const initialConsignments: Consignment[] = [
  {
    id: "cons-1",
    tenantId: "tenant-oriente-1",
    vehicleId: "veh-2",
    ownerName: "Patricia Undurraga",
    ownerRut: "14.281.902-3",
    ownerPhone: "+56 9 8456 1234",
    ownerEmail: "patricia.undurraga@gmail.com",
    ownerBank: "Banco de Chile",
    ownerAccountType: "Corriente",
    ownerAccountNumber: "00-128-49120-01",
    type: "PHYSICAL",
    ownerTargetPriceCLP: 18000000,
    agreedSalePriceCLP: 18990000,
    commissionType: "PERCENTAGE",
    commissionValue: 4,
    contractExclusivityDays: 60,
    status: "ACTIVE",
    createdAt: "2026-08-20T10:00:00Z",
  },
];

class MemoryStore {
  private tenant: Tenant = { ...INITIAL_TENANT };
  private users: User[] = [...INITIAL_USERS];
  private vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  private leads: Lead[] = [...INITIAL_LEADS];
  private applications: FinancingApplication[] = [...INITIAL_APPLICATIONS];
  private transfers: TransferOrder[] = [...initialTransfers];
  private valuations: TradeInValuation[] = [...initialValuations];
  private appointments: AppointmentBooking[] = [...initialAppointments];
  private serviceOrders: ServiceOrder[] = [...initialServiceOrders];
  private consignments: Consignment[] = [...initialConsignments];
  private invoices: InvoiceDTE[] = [...initialInvoices];
  private subscription: TenantSubscription = { ...initialSubscription };
  private auditLogs: AuditLog[] = [...initialAuditLogs];
  private inspections: VehicleInspection[] = [...initialInspections];
  private wholesaleListings: WholesaleListing[] = [...initialWholesaleListings];
  private wholesaleBids: WholesaleBid[] = [];
  private warrantyTickets: WarrantyTicket[] = [...initialWarrantyTickets];
  private aftersalesReminders: AftersalesReminder[] = [...initialAftersalesReminders];
  private nextFolio = 1043;
  private subscribers: Array<() => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem("autosoft_db_state_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tenant) this.tenant = parsed.tenant;
        if (parsed.users) this.users = parsed.users;
        if (parsed.vehicles) this.vehicles = parsed.vehicles;
        if (parsed.leads) this.leads = parsed.leads;
        if (parsed.applications) this.applications = parsed.applications;
        if (parsed.transfers) this.transfers = parsed.transfers;
        if (parsed.valuations) this.valuations = parsed.valuations;
        if (parsed.appointments) this.appointments = parsed.appointments;
        if (parsed.serviceOrders) this.serviceOrders = parsed.serviceOrders;
        if (parsed.consignments) this.consignments = parsed.consignments;
        if (parsed.invoices) this.invoices = parsed.invoices;
        if (parsed.subscription) this.subscription = parsed.subscription;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (parsed.inspections) this.inspections = parsed.inspections;
        if (parsed.wholesaleListings) this.wholesaleListings = parsed.wholesaleListings;
        if (parsed.wholesaleBids) this.wholesaleBids = parsed.wholesaleBids;
        if (parsed.warrantyTickets) this.warrantyTickets = parsed.warrantyTickets;
        if (parsed.aftersalesReminders) this.aftersalesReminders = parsed.aftersalesReminders;
      }
    } catch (e) {
      console.warn("Could not load stored state", e);
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        const state = {
          tenant: this.tenant,
          users: this.users,
          vehicles: this.vehicles,
          leads: this.leads,
          applications: this.applications,
          transfers: this.transfers,
          valuations: this.valuations,
          appointments: this.appointments,
          serviceOrders: this.serviceOrders,
          consignments: this.consignments,
          invoices: this.invoices,
          subscription: this.subscription,
          auditLogs: this.auditLogs,
          inspections: this.inspections,
          wholesaleListings: this.wholesaleListings,
          wholesaleBids: this.wholesaleBids,
          warrantyTickets: this.warrantyTickets,
          aftersalesReminders: this.aftersalesReminders,
        };
        localStorage.setItem("autosoft_db_state_v1", JSON.stringify(state));
      } catch (e) {
        console.warn("Could not save store state", e);
      }
    }
  }

  clearMockData() {
    this.vehicles = [];
    this.leads = [];
    this.applications = [];
    this.transfers = [];
    this.valuations = [];
    this.appointments = [];
    this.serviceOrders = [];
    this.consignments = [];
    this.invoices = [];
    this.inspections = [];
    this.wholesaleListings = [];
    this.wholesaleBids = [];
    this.warrantyTickets = [];
    this.aftersalesReminders = [];
    this.notify();
  }

  restoreMockData() {
    this.tenant = { ...INITIAL_TENANT };
    this.users = [...INITIAL_USERS];
    this.vehicles = [...INITIAL_VEHICLES];
    this.leads = [...INITIAL_LEADS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.transfers = [...initialTransfers];
    this.valuations = [...initialValuations];
    this.appointments = [...initialAppointments];
    this.serviceOrders = [...initialServiceOrders];
    this.consignments = [...initialConsignments];
    this.invoices = [...initialInvoices];
    this.subscription = { ...initialSubscription };
    this.auditLogs = [...initialAuditLogs];
    this.inspections = [...initialInspections];
    this.wholesaleListings = [...initialWholesaleListings];
    this.wholesaleBids = [];
    this.warrantyTickets = [...initialWarrantyTickets];
    this.aftersalesReminders = [...initialAftersalesReminders];
    this.notify();
  }

  subscribe(listener: () => void) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.subscribers.forEach((listener) => listener());
  }

  getTenant(slug?: string): Tenant {
    return this.tenant;
  }

  updateTenant(updates: Partial<Tenant>): Tenant {
    this.tenant = { ...this.tenant, ...updates };
    this.notify();
    return this.tenant;
  }

  getUsers(): User[] {
    return this.users;
  }

  getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  createVehicle(data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Vehicle {
    const newVehicle: Vehicle = {
      ...data,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      daysInStock: data.daysInStock || 1,
    };
    this.vehicles.unshift(newVehicle);
    this.notify();
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return undefined;

    const prev = this.vehicles[idx];

    if (updates.priceCash !== undefined && updates.priceCash !== prev.priceCash) {
      const diff = updates.priceCash - prev.priceCash;
      this.createAuditLog({
        tenantId: prev.tenantId,
        userId: "usr-3",
        userName: "Matías Silva",
        userRole: "DEALER_SALES_REP",
        actionType: "PRICE_CHANGE",
        severity: Math.abs(diff) >= 500000 ? "WARNING" : "INFO",
        entityType: "VEHICLE",
        entityId: prev.id,
        entityName: `${prev.brand} ${prev.model} (${prev.year}) Patente ${prev.licensePlate}`,
        details: `Modificación de precio de $${prev.priceCash.toLocaleString("es-CL")} a $${updates.priceCash.toLocaleString("es-CL")} (${diff > 0 ? "+" : ""}${diff.toLocaleString("es-CL")} CLP).`,
        previousValue: { priceCash: prev.priceCash },
        newValue: { priceCash: updates.priceCash },
        ipAddress: "190.160.45.112 (Santiago, CL)",
      });
    }

    if (updates.status === "SOLD") {
      updates.publishedToWeb = false;
      updates.publishedToMercadolibre = false;
      updates.publishedToChileautos = false;
      updates.publishedToYapo = false;
    }

    this.vehicles[idx] = {
      ...this.vehicles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notify();
    return this.vehicles[idx];
  }

  deleteVehicle(id: string): boolean {
    const prevLen = this.vehicles.length;
    const v = this.getVehicleById(id);
    if (v) {
      this.createAuditLog({
        tenantId: v.tenantId,
        userId: "usr-1",
        userName: "Rodrigo Valenzuela",
        userRole: "DEALER_OWNER",
        actionType: "VEHICLE_DELETE",
        severity: "WARNING",
        entityType: "VEHICLE",
        entityId: v.id,
        entityName: `${v.brand} ${v.model} (${v.year}) Patente ${v.licensePlate}`,
        details: `Baja y eliminación definitiva del vehículo del inventario DMS.`,
        ipAddress: "200.89.67.24 (Las Condes, CL)",
      });
    }

    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    if (this.vehicles.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  toggleSyndication(vehicleId: string, portal: "web" | "mercadolibre" | "chileautos" | "yapo") {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle) return;

    if (portal === "web") this.updateVehicle(vehicleId, { publishedToWeb: !vehicle.publishedToWeb });
    if (portal === "mercadolibre") this.updateVehicle(vehicleId, { publishedToMercadolibre: !vehicle.publishedToMercadolibre });
    if (portal === "chileautos") this.updateVehicle(vehicleId, { publishedToChileautos: !vehicle.publishedToChileautos });
    if (portal === "yapo") this.updateVehicle(vehicleId, { publishedToYapo: !vehicle.publishedToYapo });
  }

  getLeads(): Lead[] {
    return this.leads;
  }

  getLeadById(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id);
  }

  createLead(data: Omit<Lead, "id" | "createdAt">): Lead {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.unshift(newLead);
    this.notify();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead["status"]): Lead | undefined {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = { ...this.leads[idx], status, updatedAt: new Date().toISOString() };
    this.notify();
    return this.leads[idx];
  }

  updateLeadNotes(id: string, notes: string): Lead | undefined {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = { ...this.leads[idx], notes, updatedAt: new Date().toISOString() };
    this.notify();
    return this.leads[idx];
  }

  getApplications(): FinancingApplication[] {
    return this.applications;
  }

  createApplication(data: Omit<FinancingApplication, "id" | "createdAt">): FinancingApplication {
    const newApp: FinancingApplication = {
      ...data,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);
    this.notify();
    return newApp;
  }

  getTransfers(): TransferOrder[] {
    return this.transfers;
  }

  getTransferById(id: string): TransferOrder | undefined {
    return this.transfers.find((t) => t.id === id);
  }

  createTransferOrder(data: {
    tenantId: string;
    vehicleId: string;
    buyerName: string;
    buyerRut: string;
    buyerPhone: string;
    buyerEmail: string;
    buyerAddress: string;
    buyerCity: string;
    salePrice: number;
    fiscalAppraisal?: number;
    autofactReport?: Partial<TransferOrder["autofactReport"]>;
    insurancePolicy?: TransferOrder["insurancePolicy"];
    deliveryAct?: TransferOrder["deliveryAct"];
  }): TransferOrder {
    const taxes = calculateTransferTaxes({
      salePrice: data.salePrice,
      fiscalAppraisal: data.fiscalAppraisal,
    });

    const newTransfer: TransferOrder = {
      id: `trans-${Date.now()}`,
      tenantId: data.tenantId,
      vehicleId: data.vehicleId,
      buyerName: data.buyerName,
      buyerRut: data.buyerRut,
      buyerPhone: data.buyerPhone,
      buyerEmail: data.buyerEmail,
      buyerAddress: data.buyerAddress,
      buyerCity: data.buyerCity,
      salePrice: data.salePrice,
      fiscalAppraisal: taxes.fiscalAppraisal,
      transferTax15: taxes.transferTax15,
      notaryFee: taxes.notaryFee,
      civilRegistryFee: taxes.civilRegistryFee,
      totalCost: taxes.totalTransferCost,
      status: "SIGNATURE_PENDING",
      autofactReport: {
        hasFines: false,
        tagFinesCount: 0,
        hasEncumbrance: false,
        isStolen: false,
        technicalInspectionValid: true,
        technicalInspectionExpiry: "2026-12-31",
        soapValid: true,
        ownersCount: 1,
        mileageRecord: 40000,
        ...data.autofactReport,
      },
      insurancePolicy: data.insurancePolicy,
      deliveryAct: data.deliveryAct,
      createdAt: new Date().toISOString(),
    };

    this.transfers.unshift(newTransfer);
    this.notify();
    return newTransfer;
  }

  completeTransfer(id: string, deliveryAct: TransferOrder["deliveryAct"]): TransferOrder | undefined {
    const idx = this.transfers.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;

    this.transfers[idx] = {
      ...this.transfers[idx],
      status: "REGISTERED",
      deliveryAct,
      completedAt: new Date().toISOString(),
    };

    const vehicleId = this.transfers[idx].vehicleId;
    this.updateVehicle(vehicleId, { status: "SOLD" });

    const relatedLead = this.leads.find((l) => l.vehicleId === vehicleId);
    if (relatedLead) {
      this.updateLeadStatus(relatedLead.id, "WON");
    }

    if (this.transfers[idx].insurancePolicy) {
      this.transfers[idx].insurancePolicy!.status = "ACTIVE";
    }

    const v = this.getVehicleById(vehicleId);
    if (v) {
      this.createAftersalesReminder({
        tenantId: this.transfers[idx].tenantId,
        vehicleId: v.id,
        clientName: this.transfers[idx].buyerName,
        clientPhone: this.transfers[idx].buyerPhone,
        vehicleDescription: `${v.brand} ${v.model} (${v.year})`,
        reminderType: "30_DAYS_CHECK",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "PENDING",
        messageText: `Hola ${this.transfers[idx].buyerName}, esperamos que disfrutes tu ${v.brand} ${v.model}. Te invitamos a tu chequeo gratuito de los 30 días en Automotora Oriente.`,
      });
    }

    this.notify();
    return this.transfers[idx];
  }

  getInsurancePolicies(): InsurancePolicy[] {
    const list: InsurancePolicy[] = [];
    this.transfers.forEach((t) => {
      if (t.insurancePolicy) {
        list.push(t.insurancePolicy);
      }
    });
    return list;
  }

  getValuations(): TradeInValuation[] {
    return this.valuations;
  }

  createValuation(data: Omit<TradeInValuation, "id" | "createdAt">): TradeInValuation {
    const newValuation: TradeInValuation = {
      ...data,
      id: `val-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.valuations.unshift(newValuation);
    this.notify();
    return newValuation;
  }

  convertValuationToVehicle(valuationId: string, offerAmount: number): Vehicle | undefined {
    const val = this.valuations.find((v) => v.id === valuationId);
    if (!val) return undefined;

    const newVehicle = this.createVehicle({
      tenantId: val.tenantId,
      licensePlate: val.licensePlate,
      brand: val.brand,
      model: val.model,
      version: val.version || "1.6",
      year: val.year,
      mileage: val.mileage,
      transmission: "AUTOMATICA",
      fuelType: "BENCINA",
      bodyType: "SUV",
      color: "Gris Plata",
      priceCash: val.estimatedMarketPrice,
      priceFinanced: Math.round(val.estimatedMarketPrice * 0.95),
      acquisitionCost: offerAmount,
      status: "IN_MAINTENANCE",
      description: `Vehículo recibido en parte de pago de ${val.clientName || "cliente"}. En proceso de preparación y revisión técnica oficial.`,
      features: ["Aire Acondicionado", "Cierre Centralizado", "Frenos ABS", "Doble Airbag"],
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
      ],
      publishedToWeb: false,
      publishedToMercadolibre: false,
      publishedToChileautos: false,
      publishedToYapo: false,
    });

    val.status = "ACCEPTED";
    val.convertedToVehicleId = newVehicle.id;
    this.notify();

    return newVehicle;
  }

  getAppointments(): AppointmentBooking[] {
    return this.appointments;
  }

  createAppointment(data: Omit<AppointmentBooking, "id" | "createdAt">): AppointmentBooking {
    const newAppointment: AppointmentBooking = {
      ...data,
      id: `appo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appointments.unshift(newAppointment);
    this.notify();
    return newAppointment;
  }

  updateAppointmentStatus(id: string, status: AppointmentBooking["status"]): AppointmentBooking | undefined {
    const idx = this.appointments.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.appointments[idx] = { ...this.appointments[idx], status };
    this.notify();
    return this.appointments[idx];
  }

  getServiceOrders(): ServiceOrder[] {
    return this.serviceOrders;
  }

  getServiceOrdersByVehicle(vehicleId: string): ServiceOrder[] {
    return this.serviceOrders.filter((o) => o.vehicleId === vehicleId);
  }

  createServiceOrder(data: Omit<ServiceOrder, "id" | "createdAt">): ServiceOrder {
    const newOrder: ServiceOrder = {
      ...data,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.serviceOrders.unshift(newOrder);

    const vehicleOrders = this.getServiceOrdersByVehicle(data.vehicleId);
    const totalCost = vehicleOrders.reduce((sum, o) => sum + o.costCLP, 0);
    this.updateVehicle(data.vehicleId, {
      reconditioningCostCLP: totalCost,
      reconditioningStatus: "EN_TALLER",
    });

    this.notify();
    return newOrder;
  }

  completeServiceOrder(id: string): ServiceOrder | undefined {
    const idx = this.serviceOrders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;

    this.serviceOrders[idx] = {
      ...this.serviceOrders[idx],
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };

    this.notify();
    return this.serviceOrders[idx];
  }

  readyVehicleForSale(vehicleId: string): Vehicle | undefined {
    const v = this.updateVehicle(vehicleId, {
      status: "AVAILABLE",
      reconditioningStatus: "LISTO_PARA_EXHIBIR",
      publishedToWeb: true,
    });
    this.notify();
    return v;
  }

  getConsignments(): Consignment[] {
    return this.consignments;
  }

  createConsignment(data: Omit<Consignment, "id" | "createdAt">): Consignment {
    const newConsignment: Consignment = {
      ...data,
      id: `cons-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.consignments.unshift(newConsignment);

    this.updateVehicle(data.vehicleId, {
      isConsignment: true,
      consignmentId: newConsignment.id,
      acquisitionCost: 0,
    });

    this.notify();
    return newConsignment;
  }

  settleConsignment(id: string, salePriceReal: number, deductibleExpenses = 0): Consignment | undefined {
    const idx = this.consignments.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;

    const cons = this.consignments[idx];
    const settlement = calculateConsignmentSettlement({
      salePrice: salePriceReal,
      commissionType: cons.commissionType,
      commissionValue: cons.commissionValue,
      deductibleExpensesCLP: deductibleExpenses,
    });

    this.consignments[idx] = {
      ...cons,
      status: "SETTLED",
      settledAt: new Date().toISOString(),
      netPayoutCLP: settlement.netPayoutToOwnerCLP,
    };

    this.notify();
    return this.consignments[idx];
  }

  getInvoices(): InvoiceDTE[] {
    return this.invoices;
  }

  createInvoice(data: Omit<InvoiceDTE, "id" | "folio" | "siiStatus" | "siiTrackId" | "issuedAt">): InvoiceDTE {
    const newInvoice: InvoiceDTE = {
      ...data,
      id: `dte-${Date.now()}`,
      folio: this.nextFolio++,
      siiStatus: "ACCEPTED",
      siiTrackId: `SII-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      issuedAt: new Date().toISOString(),
    };
    this.invoices.unshift(newInvoice);

    this.createAuditLog({
      tenantId: data.tenantId,
      userId: "usr-1",
      userName: "Rodrigo Valenzuela",
      userRole: "DEALER_OWNER",
      actionType: "DTE_ISSUED",
      severity: "INFO",
      entityType: "INVOICE",
      entityId: newInvoice.id,
      entityName: `DTE ${data.dteType} Folio N° ${newInvoice.folio}`,
      details: `Emisión de Factura Electrónica a ${data.receiverName} (${data.receiverRut}) por $${data.totalCLP.toLocaleString("es-CL")}.`,
      ipAddress: "200.89.67.24 (Las Condes, CL)",
    });

    this.notify();
    return newInvoice;
  }

  getInvoicesSummary() {
    const totalInvoices = this.invoices.length;
    const totalExempt = this.invoices.reduce((sum, i) => sum + i.exemptAmountCLP, 0);
    const totalNetTaxable = this.invoices.reduce((sum, i) => sum + i.netTaxableAmountCLP, 0);
    const totalVAT = this.invoices.reduce((sum, i) => sum + i.vat19CLP, 0);
    const totalBilled = this.invoices.reduce((sum, i) => sum + i.totalCLP, 0);

    return {
      totalInvoices,
      totalExempt,
      totalNetTaxable,
      totalVAT,
      totalBilled,
    };
  }

  getSubscription(): TenantSubscription {
    return this.subscription;
  }

  updateSubscriptionPlan(tier: SubscriptionPlanTier, billingCycle: "MONTHLY" | "ANNUAL" = "MONTHLY"): TenantSubscription {
    const tierConfig = {
      STARTER: { priceUF: 2.5, maxVehicles: 15, maxUsers: 2, aiPhotoCreditsMonthly: 20, aiCopilotChatsMonthly: 100 },
      PRO: { priceUF: 5.0, maxVehicles: 45, maxUsers: 5, aiPhotoCreditsMonthly: 100, aiCopilotChatsMonthly: 500 },
      ENTERPRISE: { priceUF: 10.0, maxVehicles: 9999, maxUsers: 999, aiPhotoCreditsMonthly: 500, aiCopilotChatsMonthly: 2000 },
    };

    const cfg = tierConfig[tier];
    this.subscription = {
      ...this.subscription,
      tier,
      priceUF: cfg.priceUF,
      maxVehicles: cfg.maxVehicles,
      maxUsers: cfg.maxUsers,
      aiPhotoCreditsMonthly: cfg.aiPhotoCreditsMonthly,
      aiCopilotChatsMonthly: cfg.aiCopilotChatsMonthly,
      billingCycle,
      status: "ACTIVE",
    };

    this.notify();
    return this.subscription;
  }

  updatePaymentMethod(paymentMethod: TenantSubscription["paymentMethod"]): TenantSubscription {
    this.subscription = {
      ...this.subscription,
      paymentMethod,
    };
    this.notify();
    return this.subscription;
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  createAuditLog(data: Omit<AuditLog, "id" | "timestamp">): AuditLog {
    const newLog: AuditLog = {
      ...data,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    this.notify();
    return newLog;
  }

  getSecurityAlerts() {
    const criticals = this.auditLogs.filter((a) => a.severity === "CRITICAL");
    const warnings = this.auditLogs.filter((a) => a.severity === "WARNING");
    return {
      criticalCount: criticals.length,
      warningCount: warnings.length,
      criticals,
      warnings,
    };
  }

  getInspections(): VehicleInspection[] {
    return this.inspections;
  }

  createInspection(data: Omit<VehicleInspection, "id" | "score" | "rating" | "createdAt">): VehicleInspection {
    const scoring = calculateInspectionScore(data.items);
    const newInspection: VehicleInspection = {
      ...data,
      id: `insp-${Date.now()}`,
      score: scoring.score,
      rating: scoring.rating,
      createdAt: new Date().toISOString(),
    };
    this.inspections.unshift(newInspection);

    if (scoring.rating === "REQUIERE_TALLER" || scoring.failCount > 0) {
      this.updateVehicle(data.vehicleId, {
        reconditioningStatus: "EN_TALLER",
      });
    }

    this.notify();
    return newInspection;
  }

  convertInspectionToServiceOrders(inspectionId: string): ServiceOrder[] {
    const insp = this.inspections.find((i) => i.id === inspectionId);
    if (!insp) return [];

    const createdOrders: ServiceOrder[] = [];
    const failedItems = insp.items.filter((i) => i.status === "FAIL");

    failedItems.forEach((item) => {
      const category: ServiceOrder["category"] =
        item.category === "MECANICA_MOTOR"
          ? "MECANICA"
          : item.category === "CARROCERIA_PINTURA"
          ? "PINTURA_DESABOLLADURA"
          : item.category === "NEUMATICOS_FRENOS"
          ? "NEUMATICOS_FRENOS"
          : "DETAILING_ESTETICA";

      const order = this.createServiceOrder({
        tenantId: insp.tenantId,
        vehicleId: insp.vehicleId,
        category,
        description: `Reparación constatada en Inspección Técnica: ${item.name}${item.notes ? ` (${item.notes})` : ""}`,
        providerName: "Taller Mecánico Oficial Oriente",
        costCLP: 150000,
        status: "PENDING",
      });
      createdOrders.push(order);
    });

    return createdOrders;
  }

  // Wholesale B2B
  getWholesaleListings(): WholesaleListing[] {
    return this.wholesaleListings;
  }

  createWholesaleListing(data: Omit<WholesaleListing, "id" | "status" | "createdAt">): WholesaleListing {
    const newListing: WholesaleListing = {
      ...data,
      id: `who-${Date.now()}`,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    this.wholesaleListings.unshift(newListing);
    this.notify();
    return newListing;
  }

  placeWholesaleBid(listingId: string, bidderTenantId: string, bidderTenantName: string, bidAmountCLP: number): WholesaleBid | undefined {
    const listing = this.wholesaleListings.find((l) => l.id === listingId);
    if (!listing || listing.status !== "OPEN") return undefined;

    if (bidAmountCLP <= (listing.currentHighestBidCLP || listing.startingPriceCLP)) {
      return undefined;
    }

    const newBid: WholesaleBid = {
      id: `bid-${Date.now()}`,
      listingId,
      bidderTenantId,
      bidderTenantName,
      bidAmountCLP,
      timestamp: new Date().toISOString(),
    };

    this.wholesaleBids.unshift(newBid);
    listing.currentHighestBidCLP = bidAmountCLP;
    listing.highestBidderTenantId = bidderTenantId;
    listing.highestBidderTenantName = bidderTenantName;

    if (bidAmountCLP >= listing.buyNowPriceCLP) {
      listing.status = "SOLD";
    }

    this.notify();
    return newBid;
  }

  // Warranty & Aftersales
  getWarrantyTickets(): WarrantyTicket[] {
    return this.warrantyTickets;
  }

  createWarrantyTicket(data: Omit<WarrantyTicket, "id" | "status" | "warrantyExpiryDate" | "createdAt">): WarrantyTicket {
    const parts = data.deliveryDate.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parts[2];

    const expMonth = month + 6;
    const expYear = expMonth > 12 ? year + 1 : year;
    const normalizedMonth = expMonth > 12 ? expMonth - 12 : expMonth;
    const monthStr = normalizedMonth < 10 ? `0${normalizedMonth}` : `${normalizedMonth}`;
    const warrantyExpiryDate = `${expYear}-${monthStr}-${day}`;

    const newTicket: WarrantyTicket = {
      ...data,
      id: `war-${Date.now()}`,
      status: "OPEN",
      warrantyExpiryDate,
      createdAt: new Date().toISOString(),
    };
    this.warrantyTickets.unshift(newTicket);
    this.notify();
    return newTicket;
  }

  getAftersalesReminders(): AftersalesReminder[] {
    return this.aftersalesReminders;
  }

  createAftersalesReminder(data: Omit<AftersalesReminder, "id" | "createdAt">): AftersalesReminder {
    const newReminder: AftersalesReminder = {
      ...data,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.aftersalesReminders.unshift(newReminder);
    this.notify();
    return newReminder;
  }

  markReminderSent(id: string): boolean {
    const r = this.aftersalesReminders.find((rem) => rem.id === id);
    if (r) {
      r.status = "SENT";
      this.notify();
      return true;
    }
    return false;
  }

  getStats() {
    const totalVehicles = this.vehicles.length;
    const availableCount = this.vehicles.filter((v) => v.status === "AVAILABLE").length;
    const reservedCount = this.vehicles.filter((v) => v.status === "RESERVED").length;
    const soldCount = this.vehicles.filter((v) => v.status === "SOLD").length;
    const inMaintenanceCount = this.vehicles.filter((v) => v.status === "IN_MAINTENANCE").length;

    const totalInventoryValue = this.vehicles
      .filter((v) => v.status === "AVAILABLE")
      .reduce((sum, v) => sum + v.priceCash, 0);

    const totalAcquisitionCost = this.vehicles
      .filter((v) => v.status === "AVAILABLE" && v.acquisitionCost)
      .reduce((sum, v) => sum + (v.acquisitionCost || 0), 0);

    const totalServiceCostAll = this.serviceOrders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + o.costCLP, 0);

    const estimatedProfitMargin = totalInventoryValue - totalAcquisitionCost - totalServiceCostAll;

    const daysSum = this.vehicles.reduce((sum, v) => sum + (v.daysInStock || 0), 0);
    const avgDaysInStock = totalVehicles > 0 ? Math.round(daysSum / totalVehicles) : 0;

    const leadsCount = this.leads.length;
    const leadsWon = this.leads.filter((l) => l.status === "WON").length;
    const conversionRate = leadsCount > 0 ? Math.round((leadsWon / leadsCount) * 100) : 0;

    const activeFinancingApps = this.applications.length;
    const totalTransfersCompleted = this.transfers.filter((t) => t.status === "REGISTERED").length;
    const totalInsuranceCommissions = this.getInsurancePolicies()
      .filter((p) => p.status === "ACTIVE")
      .reduce((sum, p) => sum + p.dealerCommissionCLP, 0);
    const totalTradeInValuations = this.valuations.length;
    const totalAppointments = this.appointments.length;
    const totalServiceOrdersCount = this.serviceOrders.length;
    const totalConsignmentsCount = this.consignments.length;
    const totalInvoicesCount = this.invoices.length;
    const totalAuditLogsCount = this.auditLogs.length;
    const totalInspectionsCount = this.inspections.length;
    const totalWholesaleCount = this.wholesaleListings.length;
    const totalWarrantyTicketsCount = this.warrantyTickets.length;

    return {
      totalVehicles,
      availableCount,
      reservedCount,
      soldCount,
      inMaintenanceCount,
      totalInventoryValue,
      estimatedProfitMargin,
      avgDaysInStock,
      leadsCount,
      leadsWon,
      conversionRate,
      activeFinancingApps,
      totalTransfersCompleted,
      totalInsuranceCommissions,
      totalTradeInValuations,
      totalAppointments,
      totalServiceOrdersCount,
      totalServiceCostAll,
      totalConsignmentsCount,
      totalInvoicesCount,
      totalAuditLogsCount,
      totalInspectionsCount,
      totalWholesaleCount,
      totalWarrantyTicketsCount,
    };
  }
}

export const store = new MemoryStore();

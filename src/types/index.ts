export type Role = "SUPERADMIN" | "DEALER_OWNER" | "DEALER_MANAGER" | "DEALER_SALES_REP";
export type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "IN_MAINTENANCE";
export type Transmission = "MANUAL" | "AUTOMATICA";
export type FuelType = "BENCINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO";
export type BodyType = "SUV" | "SEDAN" | "HATCHBACK" | "CAMIONETA" | "COUPE" | "UTILITARIO";
export type LeadStatus = "NEW" | "CONTACTED" | "INTERESTED" | "NEGOTIATION" | "WON" | "LOST";
export type LeadChannel = "WEB" | "WHATSAPP" | "CHILEAUTOS" | "MERCADOLIBRE" | "WALK_IN";
export type FinancingStatus = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "FUNDED";
export type TransferStatus = "DRAFT" | "INSPECTION_PENDING" | "SIGNATURE_PENDING" | "REGISTERED" | "REJECTED";
export type ValuationCondition = "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_REPAIR";
export type LeadTemperature = "HOT" | "WARM" | "COLD";
export type ServiceCategory = "MECANICA" | "PINTURA_DESABOLLADURA" | "NEUMATICOS_FRENOS" | "DETAILING_ESTETICA" | "TRAMITES_REVISION";
export type ServiceOrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type ConsignmentType = "PHYSICAL" | "VIRTUAL";
export type ConsignmentStatus = "ACTIVE" | "IN_NEGOTIATION" | "SOLD_PENDING_SETTLEMENT" | "SETTLED" | "RETURNED";
export type DTEType = "33" | "34" | "46";
export type SubscriptionPlanTier = "STARTER" | "PRO" | "ENTERPRISE";

export type AuditActionType =
  | "PRICE_CHANGE"
  | "LEAD_EXPORT"
  | "VEHICLE_DELETE"
  | "TRANSFER_STATUS_CHANGE"
  | "DTE_ISSUED"
  | "USER_LOGIN"
  | "PERMISSION_CHANGE";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  rut: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  tagline?: string;
  bannerUrl?: string;
  chileautosToken?: string;
  mercadolibreConnected?: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
}

export interface Vehicle {
  id: string;
  tenantId: string;
  licensePlate: string;
  vin?: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  transmission: Transmission;
  fuelType: FuelType;
  bodyType: BodyType;
  color: string;
  priceCash: number;
  priceFinanced?: number;
  acquisitionCost?: number;
  status: VehicleStatus;
  description: string;
  features: string[];
  images: string[];
  publishedToWeb: boolean;
  publishedToMercadolibre: boolean;
  publishedToChileautos: boolean;
  publishedToYapo: boolean;
  mercadolibreExternalId?: string;
  chileautosExternalId?: string;
  daysInStock?: number;
  reconditioningCostCLP?: number;
  reconditioningStatus?: "EN_TALLER" | "ESPERANDO_REPUESTOS" | "EN_DETAILING" | "LISTO_PARA_EXHIBIR";
  isConsignment?: boolean;
  consignmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  vehicleId?: string;
  assignedUserId?: string;
  name: string;
  email?: string;
  phone: string;
  rut?: string;
  channel: LeadChannel;
  status: LeadStatus;
  notes?: string;
  financingRequested?: boolean;
  downPayment?: number;
  termMonths?: number;
  aiLeadScore?: number;
  aiTemperature?: LeadTemperature;
  aiSummary?: string;
  tradeInDetails?: {
    brand: string;
    model: string;
    year: number;
    mileage: number;
    expectedPrice?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface FinancingApplication {
  id: string;
  tenantId: string;
  leadId: string;
  vehicleId: string;
  applicantName: string;
  applicantRut: string;
  applicantEmail?: string;
  applicantPhone?: string;
  monthlyIncome: number;
  downPayment: number;
  termMonths: number;
  employmentStatus: "DEPENDENT" | "INDEPENDENT";
  financialPartner?: "FORUM" | "TANNER" | "SANTANDER" | "AUTOFIN";
  status: FinancingStatus;
  estimatedMonthlyPayment?: number;
  createdAt: string;
}

export interface AutofactReport {
  hasFines: boolean;
  tagFinesCount: number;
  hasEncumbrance: boolean;
  isStolen: boolean;
  technicalInspectionValid: boolean;
  technicalInspectionExpiry: string;
  soapValid: boolean;
  ownersCount: number;
  mileageRecord: number;
}

export interface InsurancePolicy {
  id: string;
  transferId: string;
  carrier: "BCI Seguros" | "HDI Seguros" | "Mapfre" | "Consorcio";
  policyNumber: string;
  monthlyPremiumCLP: number;
  deductibleUF: number;
  dealerCommissionCLP: number;
  status: "ACTIVE" | "PENDING";
  createdAt: string;
}

export interface DeliveryAct {
  deliveredMileage: number;
  fuelLevel: "1/4" | "1/2" | "3/4" | "Lleno";
  hasSpareTire: boolean;
  hasToolkit: boolean;
  hasDuplicateKey: boolean;
  hasTriangleAndVest: boolean;
  hasManuals: boolean;
  cleanExterior: boolean;
  cleanInterior: boolean;
  signedAt: string;
  receiverName: string;
  receiverRut: string;
}

export interface TransferOrder {
  id: string;
  tenantId: string;
  vehicleId: string;
  buyerName: string;
  buyerRut: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerCity: string;
  salePrice: number;
  fiscalAppraisal: number;
  transferTax15: number;
  notaryFee: number;
  civilRegistryFee: number;
  totalCost: number;
  status: TransferStatus;
  autofactReport: AutofactReport;
  insurancePolicy?: InsurancePolicy;
  deliveryAct?: DeliveryAct;
  createdAt: string;
  completedAt?: string;
}

export interface TradeInValuation {
  id: string;
  tenantId: string;
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  condition: ValuationCondition;
  estimatedMarketPrice: number;
  quickOffer: number;
  recommendedOffer: number;
  maxOffer: number;
  reconditioningEstimateCLP: number;
  expectedGrossProfitCLP: number;
  clientName?: string;
  clientPhone?: string;
  status: "DRAFT" | "OFFERED" | "ACCEPTED" | "REJECTED";
  convertedToVehicleId?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "USER" | "COPILOT" | "SALES_AGENT";
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export interface AppointmentBooking {
  id: string;
  tenantId: string;
  leadName: string;
  leadPhone: string;
  vehicleName: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export interface ServiceOrder {
  id: string;
  tenantId: string;
  vehicleId: string;
  category: ServiceCategory;
  description: string;
  providerName: string;
  costCLP: number;
  invoiceNumber?: string;
  status: ServiceOrderStatus;
  estimatedCompletionDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Consignment {
  id: string;
  tenantId: string;
  vehicleId: string;
  ownerName: string;
  ownerRut: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerBank: string;
  ownerAccountType: "Corriente" | "Vista / Rut" | "Ahorro";
  ownerAccountNumber: string;
  type: ConsignmentType;
  ownerTargetPriceCLP: number;
  agreedSalePriceCLP: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionValue: number;
  contractExclusivityDays: number;
  status: ConsignmentStatus;
  settledAt?: string;
  netPayoutCLP?: number;
  createdAt: string;
}

export interface InvoiceDTE {
  id: string;
  tenantId: string;
  folio: number;
  dteType: DTEType;
  vehicleId?: string;
  transferId?: string;
  receiverName: string;
  receiverRut: string;
  receiverAddress: string;
  receiverCity: string;
  receiverEmail: string;
  description: string;
  exemptAmountCLP: number;
  netTaxableAmountCLP: number;
  vat19CLP: number;
  totalCLP: number;
  siiStatus: "ACCEPTED" | "PENDING" | "REJECTED";
  siiTrackId: string;
  issuedAt: string;
}

export interface TenantSubscription {
  tier: SubscriptionPlanTier;
  priceUF: number;
  maxVehicles: number;
  maxUsers: number;
  aiPhotoCreditsMonthly: number;
  aiPhotoCreditsUsed: number;
  aiCopilotChatsMonthly: number;
  aiCopilotChatsUsed: number;
  billingCycle: "MONTHLY" | "ANNUAL";
  paymentMethod: {
    type: "CREDIT_CARD" | "PAC_DEBIT";
    brand?: string;
    last4?: string;
    bankName?: string;
  };
  nextBillingDate: string;
  status: "ACTIVE" | "PAST_DUE" | "TRIAL";
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: Role;
  actionType: AuditActionType;
  severity: AuditSeverity;
  entityType: "VEHICLE" | "LEAD" | "TRANSFER" | "INVOICE" | "USER" | "SYSTEM";
  entityId: string;
  entityName?: string;
  details: string;
  previousValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
}

export interface DamagePoint {
  id: string;
  x: number;
  y: number;
  type: "RAYON" | "ABOLLADURA" | "TRIZADURA" | "REPINTADO";
  severity: "LEVE" | "MODERADO" | "GRAVE";
  description: string;
  photoUrl?: string;
}

export interface InspectionChecklistItem {
  id: string;
  name: string;
  category: "MECANICA_MOTOR" | "CARROCERIA_PINTURA" | "NEUMATICOS_FRENOS" | "INTERIOR_CONFORT" | "DOCUMENTOS_ACCESORIOS";
  status: "PASS" | "WARNING" | "FAIL";
  notes?: string;
}

export interface VehicleInspection {
  id: string;
  tenantId: string;
  vehicleId: string;
  inspectorName: string;
  inspectorRut: string;
  receptionMileage: number;
  fuelLevel: "1/4" | "1/2" | "3/4" | "Lleno";
  score: number;
  rating: "EXCELENTE" | "BUENO" | "REQUIERE_TALLER";
  items: InspectionChecklistItem[];
  damagePoints: DamagePoint[];
  clientSignature?: string;
  inspectorSignature?: string;
  reconditioningEstimateCLP: number;
  status: "COMPLETED" | "DRAFT";
  createdAt: string;
}

// B2B Wholesale Marketplace
export interface WholesaleListing {
  id: string;
  sellerTenantId: string;
  sellerTenantName: string;
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  licensePlate: string;
  daysInStock: number;
  inspectionScore: number;
  startingPriceCLP: number;
  buyNowPriceCLP: number;
  currentHighestBidCLP?: number;
  highestBidderTenantId?: string;
  highestBidderTenantName?: string;
  status: "OPEN" | "SOLD" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface WholesaleBid {
  id: string;
  listingId: string;
  bidderTenantId: string;
  bidderTenantName: string;
  bidAmountCLP: number;
  timestamp: string;
}

// Aftersales & Warranty (Ley 21.398 Pro-Consumidor 6 Meses)
export interface WarrantyTicket {
  id: string;
  tenantId: string;
  vehicleId: string;
  clientName: string;
  clientPhone: string;
  clientRut: string;
  issueDescription: string;
  category: "MOTOR_TRANSMISION" | "SISTEMA_ELECTRICO" | "FRENOS_SUSPENSION" | "OTRO";
  status: "OPEN" | "IN_REPAIR" | "RESOLVED" | "REJECTED";
  deliveryDate: string;
  warrantyExpiryDate: string; // 6 months from deliveryDate
  resolutionNotes?: string;
  createdAt: string;
}

export interface AftersalesReminder {
  id: string;
  tenantId: string;
  vehicleId: string;
  clientName: string;
  clientPhone: string;
  vehicleDescription: string;
  reminderType: "30_DAYS_CHECK" | "90_DAYS_MAINTENANCE" | "180_DAYS_WARRANTY_END";
  dueDate: string;
  status: "PENDING" | "SENT" | "ACKNOWLEDGED";
  messageText: string;
  createdAt: string;
}

// Digital Notary & Electronic Transfer Mandates (Ley 19.799)
export type NotarySignatureStatus = "DRAFT" | "PENDING_SIGNATURE" | "SIGNED_BY_BUYER" | "NOTARIZED" | "CIVIL_REGISTRY_SUBMITTED";

export interface DigitalNotaryContract {
  id: string;
  transferId: string;
  tenantId: string;
  contractType: "MANDATO_ESPECIAL_TRANSFERENCIA" | "COMPRAVENTA_VEHICULO_USADO";
  grantorName: string;
  grantorRut: string;
  grantorEmail: string;
  grantorPhone: string;
  grantorAddress: string;
  grantorCity: string;
  grantorDocumentNumber?: string;
  representativeName: string;
  representativeRut: string;
  vehicleDescription: string;
  licensePlate: string;
  salePriceCLP: number;
  verificationHashSHA256: string;
  cuvCode: string;
  signatureUrl: string;
  notaryOfficeName: string;
  notaryPublicName: string;
  status: NotarySignatureStatus;
  signedAt?: string;
  notarizedAt?: string;
  createdAt: string;
}


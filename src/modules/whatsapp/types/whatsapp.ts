export type WhatsappIncomingPayload = {
  object: string;
  entry: Entry[];
};

export type Entry = {
  id: string;
  changes: Change[];
};

export type Change = {
  field: string;
  value: ChangeValue;
};

export type ChangeValue = {
  messaging_product: string;
  metadata?: Metadata;
  contacts?: Contact[];
  messages?: WhatsappMessage[];
  statuses?: Status[];
};

export type Metadata = {
  display_phone_number: string;
  phone_number_id: string;
};

export type Contact = {
  wa_id: string;
  profile: Profile;
};

export type Profile = {
  name: string;
};

export type WhatsappMessage = {
  from: string;
  id: string;
  timestamp: string;
  text: TextMessage;
  type: string;
};

export type TextMessage = {
  body: string;
};

export type Status = {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  pricing: Pricing;
};

export type Pricing = {
  billable: boolean;
  pricing_model: string;
  category: string;
  type: string;
};

export type AppRole = "admin" | "sub_ib";
export type Broker = "pu_prime" | "vantage";
export type PartnerStatus = "active" | "inactive";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
};

export type SubIb = {
  id: string;
  user_id: string;
  broker: Broker;
  ib_account_id: string;
  rate_per_lot: number;
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
};

export type SubIbWithProfile = SubIb & {
  profile: Pick<Profile, "email" | "full_name"> | null;
};

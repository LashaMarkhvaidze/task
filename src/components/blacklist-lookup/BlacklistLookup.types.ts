export type Carrier = {
  did: string;
  type: string;
  name: string;
  state: string;
  ratecenter: string;
  country: string;
  clli: string;
  lata: string;
  wireless: string;
  lrn: string;
  npa: string;
  nxx: string;
  nxxx: string;
  ocn: string;
  port_type: string;
}

export type BlacklistLookupResultProps = {
    sid: string;
    status: string;
    message: string;
    code: string;
    offset: number;
    phone: string;
    results: number;
    time: number;
    scrubs: boolean;
    carrier?: Carrier;
}


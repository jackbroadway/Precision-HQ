import type { Broker } from "./types";

export const BROKERS: { value: Broker; label: string }[] = [
  { value: "pu_prime", label: "PU Prime" },
  { value: "vantage", label: "Vantage" },
];

export const brokerLabel = (b: Broker) =>
  BROKERS.find((x) => x.value === b)?.label ?? b;

export const isBroker = (v: unknown): v is Broker =>
  BROKERS.some((b) => b.value === v);

export const formatRate = (rate: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(rate);

export interface Client {
  id: string;
  name: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientData {
  client: Client;
  subscriptionData: SubscriptionData[];
}
export interface Product{
    _id:number;
    name: string;
    storeid:string;
    brand:string;
    model:string;
    description:string;
    category:string;
    subcategory:string;
    bp:number;
    sp:number;
    avatar:[];
    features:[];
    quantity:number;
    approved:boolean;
    verified:boolean;
    createdAt:Date;
    rejected:boolean;
    rejectionReason:string;
  
  }

export interface Avatar {
    url: string;
}


export interface Payment {
    _id: string;
    trackingid: string;
    reference: string;
    __v: number;
    amount: number;
    confirmationCode: string;
    currency: string;
    date: string;
    description: string | null;
    message: string;
    method: string;
    paymentAccount: string;
    paymentStatus: string;
}

export interface DestinationOrOrigin {
    latitude: number;
    longitude: number;
}

export interface OrderDetails {
    _id: string;
    transactionID: string;
    products: Product;
    amount: number;
    deliveryfee: number;
    countryCode: string;
    zipCode: string;
    destination: DestinationOrOrigin;
    origin: DestinationOrOrigin;
    paymentStatus: string;
    payment: Payment[];
    __v: number;
}

export interface Order {
    _id: string;
    buyername: string;
    totalAmount: number;
    orders: OrderDetails[];
    origins: DestinationOrOrigin[];
    destination: DestinationOrOrigin[];
    totalOrders: number;
}

export interface OrdersResponse {
    success: boolean;
    orders: Order[];
}



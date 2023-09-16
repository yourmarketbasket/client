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


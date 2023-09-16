import { MasterServiceService } from "./master-service.service";
import { AuthService } from "../auth.service";

export async function computeTotalStock(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    const numofitems = res.data.length.toLocaleString('en-US')
                    
                    resolve(numofitems);
                } else {
                    if(res.message == "No products found"){
                        resolve(0)
                    }else{
                        resolve(0)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function computeTotalInvestment(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    let investment = 0;
                    res.data.forEach((item:any)=>{
                        investment+=(item.bp*item.quantity)
                    })
                    
                    resolve(investment.toLocaleString('en-US'));
                } else {
                    if(res.message == "No products found"){
                        resolve(0.00)
                    }else{
                        resolve(0.00)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function computeExpectedGrossProfit(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    let investment = 0;
                    let expectedincome = 0;
                    res.data.forEach((item:any)=>{
                        investment+=(item.bp*item.quantity);
                        expectedincome+=(item.sp*item.quantity);
                    })

                    const cegp = (expectedincome-investment);
                    
                    resolve(cegp.toLocaleString('en-US'));
                } else {
                    if(res.message == "No products found"){
                        resolve(0.00)
                    }else{
                        resolve(0.00)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}
export async function computePercentageOfExpectedGrossProfit(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    let investment = 0;
                    let expectedincome = 0;
                    res.data.forEach((item:any)=>{
                        investment+=(item.bp*item.quantity);
                        expectedincome+=(item.sp*item.quantity);
                    })

                    const cegp = (expectedincome-investment);
                    const percentage = ((cegp/investment)*100).toFixed(1);
                    
                    resolve(percentage);
                } else {
                    if(res.message == "No products found"){
                        resolve(0.00)
                    }else{
                        resolve(0.00)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function computeNumberOfRejectedItems(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    let totalRejected = 0;
                    res.data.forEach((item:any)=>{
                        if(item.rejected){
                            totalRejected++;
                        }
                    })
                    
                    resolve(totalRejected);
                } else {
                    if(res.message == "No products found"){
                        resolve(0.00)
                    }else{
                        resolve(0.00)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}
export async function computeNumberOfApprovedItems(storeid: any, ms: MasterServiceService, auth: AuthService) {
    try {
        const response: any = await new Promise((resolve, reject) => {
            ms.getPrdoucts(storeid).subscribe((res: any) => {
                if (res.success) {
                    let totalApproved = 0;
                    res.data.forEach((item:any)=>{
                        if(item.approved){
                            totalApproved++;
                        }
                    })
                    
                    resolve(totalApproved);
                } else {
                    if(res.message == "No products found"){
                        resolve(0.00)
                    }else{
                        resolve(0.00)
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        return error;
    }
}

export function truncateString(str:any) {
    if (str.length <= 18) {
      return str; // If the string length is within the limit, return the original string.
    } else {
      return str.slice(0, 18) + '...'; // Otherwise, truncate the string and add three dots.
    }
}
export function getKForPrice(price: number): any {
    if (price >= 1000) {
        const thousands = Math.floor(price / 1000);
        return `${thousands}k`;
    } else {
        return `${price}`;
    }
}



  
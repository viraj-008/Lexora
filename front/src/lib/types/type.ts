export interface  Bookdetails{
    _id:string,
      title:string,
      images:string[],
      subject:string,
      category:string,
      condition:string,
      classType:string
      price:number,
      author:string,
      edition?:string,
      description:string,
      finalPrice:number,
      shippingCharge:string,
      seller:UserData
      paymentMode:"UPI" | "Bank Account"
      paymentDetails:{
        upiId?:string,
        bankDetails?:{
        accountNumber:string,
        ifscCode:string,
        bankName:string
        }
      }
  createdAt:Date;
}

export interface UserData{
    name:string,
    email:string,
    profilePicture:string,
    phoneNumber?:string,
    address:addresses[]
}

export interface addresses{
    _id:string
     addressLine1:string,
     addressLine2?:string,
     phoneNumber:string,
    city:string,
    state:string,
    pincode:string
}

export interface Product{
    _id:string,
    images:string[],
    title:string,
    price:number,
    finalPrice:number,
    shippingCharge:string,
}

export interface CartItem{
    _id:string,
    product:Product,
    quantity:number
}
export interface OrderItem{
    _id:string,
    product:Bookdetails,
    quantity:number
}

export interface paymentDetails{
        razorpay_orderId:string,
        razorpay_payment_Id:string,
        razorpay_signature:string
}
export interface Order{
    _id:string,
    user:UserData,
    items:OrderItem[],
    totalAmount:number,
    createdAt:Date,
    shippingAddress:addresses,
    paymentStatus:string,
    paymentMode:string,
    paymentMethod:string,
    paymentDetails:paymentDetails,
    status:string

}
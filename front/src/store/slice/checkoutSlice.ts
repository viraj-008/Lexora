import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  step: 'cart' | 'address' | 'payment';
  orderId: string | null;
  orderAmount: number | null;
}

const initialState: CheckoutState = {
  step: 'cart',
  orderId: null,
  orderAmount: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // 👉 1️⃣ Change checkout step
    setCheckoutStep: (state, action: PayloadAction<'cart' | 'address' | 'payment'>) => {
      state.step = action.payload;
    },

    // 👉 2️⃣ Set order ID and amount (optional but useful)
    setOrderId: (state, action: PayloadAction<{ orderId: string; orderAmount: number }>) => {
      state.orderId = action.payload.orderId;
    },

    setOrderAmount:(state,action: PayloadAction<number | null>)=>{
    state.orderAmount= action.payload;
    },
    // 👉 3️⃣ Reset checkout state (optional)
    resetCheckout: (state) => {
      state.step = 'cart';
      state.orderAmount = null;
    },
  },
});

// ✅ Export actions
export const { setCheckoutStep,setOrderId,setOrderAmount, resetCheckout } = checkoutSlice.actions;

// ✅ Export reducer
export default checkoutSlice.reducer;

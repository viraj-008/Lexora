import { createSlice,PayloadAction } from '@reduxjs/toolkit';
interface wishlistItem{
_id:string,
products:string[]
}
interface wishlistState{
 items:wishlistItem[]
}

const initialState : wishlistState = {
     items:[],

}

const wishlistSlice = createSlice({

    name:'wishlist',
    initialState,
    reducers:{
        setWishlist:(state,action:PayloadAction<any>)=>{
            state.items= action.payload
         },

         clearWishList :(state)=>{
         state.items=[]
         },
         addToWishlistAction:(state,action:PayloadAction<wishlistItem>)=>{
            const existingItemIndex = state.items.findIndex(item => item._id===action.payload._id)
            if(existingItemIndex !== -1){
           state.items[existingItemIndex] = action.payload
            }else{
                state.items.push(action.payload)
            }
         },

         removeFromWishListAction:(state,action:PayloadAction<string>)=>{
            state.items=state.items.map(item=>({
                ...item,
                products:item.products.filter(productId => productId !== action.payload)
            })).filter(item=> item.products.length>0)
         }
    }
})

export const {setWishlist,clearWishList,addToWishlistAction,removeFromWishListAction} = wishlistSlice.actions;
export default wishlistSlice.reducer
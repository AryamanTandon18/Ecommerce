import {ALL_PRODUCT_FAIL,ALL_PRODUCT_REQUEST,ALL_PRODUCT_SUCCESS, CLEAR_ERRORS,
    ALL_PRODUCT_DETAILS_REQUEST,
    ALL_PRODUCT_DETAILS_SUCCESS,
    ALL_PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
} from '../constants/productConstants.js'

// in reducer we bring data from backend on the basis of the request status which is handled by in actions
export const productReducer =(state ={products:[]} , action)=>{
switch (action.type) {
    case ALL_PRODUCT_REQUEST:
        return{
            loading:true,
            products:[],
        }
    case ALL_PRODUCT_SUCCESS:
            return{
                loading:false,
                products : action.payload.products,    //payload is fancy name of data
                productsCount:action.payload.productsCount,
                resultPerPage:action.payload.resultPerPage,
                // filteredProductsCount:action.payload.filteredProductsCount,
            }  
   case ALL_PRODUCT_FAIL:
        return{
         loading:false,
         products:action.payload,
        }        
    case CLEAR_ERRORS:
        return{
            ...state,
            error:null,
        }    
 default:
        return{ state }
}
};

export const productDetailsReducer =(state ={product:{}} , action)=>{
    switch (action.type) {
        case ALL_PRODUCT_DETAILS_REQUEST:
            return{
                loading:true,
                ...state,
            }
        case ALL_PRODUCT_DETAILS_SUCCESS:
                return{
                    loading:false,
                    product : action.payload,    //payload is fancy name of data
                }  
       case ALL_PRODUCT_DETAILS_FAIL:
            return{
             loading:false,
             error:action.payload,
            }        
        case CLEAR_ERRORS:
            return{
                ...state,
                error:null,
            }    
     default:
            return state ;
    }
    };
    
export const newReviewReducer = (state={},action)=>{
    switch(action.type){
        case NEW_REVIEW_REQUEST:
            return{
                ...state,
                loading:true,
            }
        case NEW_REVIEW_SUCCESS:
            return {
                loading:false,
                success:action.payload,
            }    
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload,
            }    
        case NEW_REVIEW_RESET:
            return {
                ...state,
                loading:false,
                success:false
            }    
        case CLEAR_ERRORS:
                return {
                  ...state,
                  error: null,
                };
        default:
                return state;    
    }
}    
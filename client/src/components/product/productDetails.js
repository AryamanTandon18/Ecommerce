import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import Carousel from 'react-material-ui-carousel';
import {useSelector, useDispatch } from 'react-redux';
import { getProductDetails, newReview } from '../../actions/productActions'
import Loader from '../layouts/loader/Loader';
import toast from 'react-hot-toast';
// import ReactStars from 'react-stars'
import './productDetails.js'
import './productDetails.css'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ReviewCard from'./ReviewCard.jsx';
import { addItemsToCart } from '../../actions/cartActions.js';
import { clearErrors } from '../../actions/userActions.js';
import { Dialog,DialogTitle,DialogContent,DialogActions,Button } from '@mui/material';
import { Rating } from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';
import ProductPopup from './ProductPopup.jsx'
import CustomImageMagnifier from './customImageMagnifier.jsx'
import { IoPricetagOutline } from "react-icons/io5";

const ProductDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {product,loading,error} = useSelector((state) => state.productDetails);  //to pull data from the redux store.(from the reducer)
    const {success,error:reviewError} = useSelector((state)=>state.newReview); //extracting error from newReview as reviewError so that it does not confuse with the error of productDetails
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [productImage,setProductImage] = useState("");
    const [popup,setPopup] = useState(false);
    const increaseQuantity = () => {
        if (product.stock <= quantity) return;
    
        const qty = quantity + 1;
        setQuantity(qty);
      };
    
      const decreaseQuantity = () => {
        if (1 >= quantity) return;
    
        const qty = quantity - 1;
        setQuantity(qty);
      };
    
      const SubmitReviewToggle=()=>{
        setOpen(!open);
      }
      const reviewSubmitHandler=(e)=>{
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("rating",rating);
        myForm.set("comment",comment);
        // console.log(id);
        myForm.set("productId",id);

        dispatch(newReview(myForm));

        setOpen(false);
      }
      const addToCartHandler=()=>{
        dispatch(addItemsToCart(id,quantity));
        toast.success("Item Added To Cart ");
      } 
     
    useEffect(()=>{
      if(error){
        toast.error(error);
        dispatch(clearErrors());
      }
      if(reviewError){
        toast.error(reviewError);
        dispatch(clearErrors());
      }
      if(success){
        toast.success("Review submitted Successfully");
        dispatch({type:NEW_REVIEW_RESET});
      }

                  //like in backend we use req.params.id to access the product is 
    },[dispatch,error,success,reviewError,product])

    const options={
      size: "large",
    value: product.rating,
    readOnly: true,
    precision: 0.5,
    }

    useEffect(()=>{
      dispatch(getProductDetails(id)); 
    },[id])
    useEffect(()=>{
      if(product?.images) setProductImage(product?.images[0]);
    },[product])
  return ( 
<Fragment>
    {loading?(<Loader/>):error?(toast.error(error.message))
    :product?(
  <Fragment>       
   <div className='ProductDetails'>
    <div>
      <Carousel showStatus={false} showArrows={true} infiniteLoop={false}   showThumbs={true} className='lg:hidden'>
          {
              product.images && 
              product.images.map((item,i)=>(
                  <img className='CarouselImage' style={{position:'relative'}}
                  key={item.url}
                  src={item.url}
                  alt={`${i} slide`}
                  />
              ))
          }
      </Carousel>  
    {
      productImage?.url ?(
        <div className='flex'> 
        <div className="lg:flex flex-col gap-4 mr-4 mt-0.5 hidden">
        {product && product.images.map((imageObj,index)=>(
           <img key={index} src={imageObj.url} className="w-[60px] h-[60px] border-[0.7px] border-gray-700 rounded-lg hover:shadow-image focus:shadow-image active:shadow-image" 
           onClick={()=> setProductImage(imageObj)}
           />
        ))}
        </div>
        <div className="hidden lg:flex flex-col gap-2.5 w-[400px]">
        <div onClick={() => setPopup(true)}>
          <div className='flex'>
            <CustomImageMagnifier src={productImage?.url} alt="productImage" />
          </div>
        </div>
        {popup && (
          <div className="transition-all duration-300 ease-in-out opacity-100 ">
            <ProductPopup
              setPopup={setPopup}
              productImage={productImage}
              product={product}
              setProductImage={setProductImage}
            />
          </div>
        )}
      </div>
      </div>
      ):("No product Image")
    }
    </div> 
<div>                                                  {/* Second main div  */}
    <div className='detailsBlock-1'>
    <h2>{product.name}</h2>
    <p>Product # {product._id}</p>
    </div>
    <div className='detailsBlock-2'>
    <Rating {...options}     sx={{
        zIndex:0
    }}/>
    <span> ({product.numOfReviews} Reviews )</span>
    </div>
    <div className='detailsBlock-3'>
    <h1>{`₹${product.price}`}</h1>
    <div className='detailsBlock-3-1'>
      <div className='detailsBlock-3-1-1'>
        <button onClick={decreaseQuantity}>-</button>
        <input readOnly type='number' value={quantity} />
        <button onClick={increaseQuantity}>+</button>
      </div>
      <button disabled={product.stock<1 ? true: false} onClick={addToCartHandler}>Add to Cart</button>
    </div>
    <p>
      Status:
      <b className={product.stock<1? "redColor" : "greenColor"}>
        {product.stock < 1 ? "OutOfStock" : "InStock"}
      </b>
    </p>
    </div>    
         <div className='detailsBlock-4'>
          Description: <p>{product.description}</p>
         </div>
          <button className='submitReview' onClick={SubmitReviewToggle}>Submit Review</button> {/*  Second main div          */}
          <div className='select-none cursor-pointer'>
      <span className="text-md font-segoe font-semibold text-heading">
                Offers
              </span>
              <ul className="flex flex-col gap-1">
                <li className="text-sm text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Order  and get upto 10%
                  off.
                </li>
                <li className="text-sm text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Get flat 5% off on Bulk
                  order.
                </li>
                <li className="text-sm text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Get a free Demo on Bulk
                  order.
                </li>
                {/* <ProductSlider forOffers={true} /> */}
              </ul>
        </div>    
      </div>    
                                         
    </div>                                    
      <h3 className='reviewHeading'>REVIEWS</h3> 
      <Dialog
       aria-labelledby='simple-dialog-title'
       open={open}
       onClose={SubmitReviewToggle}
      >
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent className='submitDialog'>
        <Rating
        onChange={(e)=>setRating(parseFloat(e.target.value))}
        value={parseFloat(rating)}
        size= "large" />
        <textarea 
        className='submitDialogTextArea'
        cols="30"
        rows='5'
        value={comment}
        onChange={(e)=>{setComment(e.target.value)}}
        >

        </textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={SubmitReviewToggle}>Cancel</Button>
          <Button onClick={reviewSubmitHandler} >Submit</Button>
        </DialogActions>

      </Dialog>
      {product.reviews && product.reviews[0] ?(
        <div className='reviews'> 
        {product.reviews && product.reviews.map( (review)=> <ReviewCard review={review}/>) }
        </div>
      ) : (
        <p className='noReviews'>No Reviews Yet</p>
      )}
   
    </Fragment>
):(<h1>No product data Available</h1>)  }
  
</Fragment>
  )
}

export default ProductDetails
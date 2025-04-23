import { useParams } from "react-router-dom"
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";
import { useAddCartItemMutation, useFetchCartQuery, useRemoveCartItemMutation } from "../cart/cartApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
  const {id} = useParams();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [addCartItem] = useAddCartItemMutation();
  const {data: cart} = useFetchCartQuery();
  const item = cart?.items.find(x => x.productId === +id!);
   const [quantity, setQuantity] = useState(0); 


   useEffect(() => {
     if (item) setQuantity(item.quantity);
   }, [item]);

  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0)
  if(!product || isLoading)  return <div>Loading...</div>

  const handleUpdateCart = () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
    if (!item || quantity > item.quantity){
      addCartItem({product, quantity: updatedQuantity})
    } else{
       removeCartItem({productId: product.id, quantity: updatedQuantity})
    }
   }

   const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;

    if(value >= 0) setQuantity(value)
   }

  const ProductDetails = [
    {label: 'Name', value: product.name },
    {label: 'Description', value: product.description},
    {label: 'Type', value: product.type},
    {label: 'Brand', value: product.brand },
    {label: 'Quantity in stock', value: product.quantityInStock},
  ]
  return (
    <Grid container spacing={6} maxWidth='lg' sx={{mx: 'auto'}}>
        <Grid size={6}>
         <img src = {product?.pictureUrl} alt = {product.name} style={{width: '100%'}} />
        </Grid>
        <Grid size ={6}>
           <Typography variant="h3">{product.name} </Typography>
           <Divider sx={{mb:2}}/>
           <Typography variant="h4" color= 'secondary'> GH₵ {(product.price/100).toFixed(2)} </Typography>
           <TableContainer>
            <Table sx={{
              '& td' : {fontSize:'1rem'}
            }}>
              <TableBody>
               
                  {ProductDetails.map((detail, index) => (
                   <TableRow key={index}>
                     <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                     <TableCell >{detail.value}</TableCell>
                  </TableRow>
                  ))}
               
              </TableBody>
            </Table>
           </TableContainer>
           <Grid container spacing={2} marginTop={3}>
           <Grid size = {6}> 
            <TextField
             variant = "outlined"
             type = "number"
             label = "Quantity in cart"
             fullWidth
             value={quantity}
             onChange = {handleInputChange}
            />
           </Grid>
           <Grid size = {6}>
            <Button
            onClick={handleUpdateCart}
            disabled = {quantity === item?.quantity || !item && quantity === 0}
            sx={{height: '55px'}}
             color="primary"
             size="large"
             variant="contained"
             fullWidth
            >
              {item ? 'Update quantity' : 'Add to Cart'}
            </Button>
             </Grid>
           </Grid>
        </Grid>
    </Grid>
  )
}
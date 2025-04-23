import { Box, Grid, IconButton, Paper, Typography } from "@mui/material"
import { Item } from "../../app/models/cart"
import { Add, Close, Remove } from "@mui/icons-material"
import { useAddCartItemMutation, useRemoveCartItemMutation } from "./cartApi"
import { currencyFormat } from "../../lib/util"

type Props = {
    item: Item
}

export default function CartItem({item}: Props) {
    const [removeCartItem] = useRemoveCartItemMutation();
    const [addCartItem] = useAddCartItemMutation();
  return (
    <Paper sx={{
        height: 140,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
    }}>
        <Box display='flex' alignItems='center'>
            <Box
                 component='img'
                 src ={item.pictureUrl}
                 alt = {item.name}
                 sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: '4px',
                    mr: 8,
                    ml: 4
                 }}
            />

            <Box display= 'flex' flexDirection='column' gap={1}>
                <Typography variant ="h6">{item.name}</Typography>

                <Box display='flex' alignItems='ceter' gap = {3}> 
                    <Typography sx={{fontSize: '1.1rem'}}>
                    {currencyFormat(item.price)} x {item.quantity}
                    </Typography>
                    <Typography sx={{fontSize: '1.1rem'}} color = 'primary'>
                    {currencyFormat(item.price * item.quantity)}
                    </Typography>
                </Box>
               <Grid container spacing={1} alignContent= 'center'>
                    <IconButton 
                        onClick={() => removeCartItem({productId: item.productId, quantity: 1})}
                        color="error"
                        size="small" 
                        sx={{border: 1, borderRadius:1, minWidth: 0}}>
                        <Remove  />
                    </IconButton>
                    <Typography variant="h6">{item.quantity}</Typography>
                    <IconButton 
                        onClick={() => addCartItem({product: item, quantity: 1})}
                        color="success" 
                        size="small" 
                        sx={{border: 1, borderRadius:1, minWidth: 0}}
                    >
                        <Add  />
                    </IconButton>
                
               </Grid>
            </Box>
        </Box>
        <IconButton
                onClick={() => removeCartItem({productId: item.productId, quantity: item.quantity})}
                color = "error"
                size="small" 
                sx={{
                    border: 1, 
                    borderRadius:1, 
                    minWidth: 0, 
                    alignSelf: "start",
                    mr:1,
                    mt:1
                }}
        >
               <Close />
        </IconButton>
    </Paper>
  )
}
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme, useMediaQuery, Card, CardContent, CardActions, Chip, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { useFetchProductsQuery } from "../catalog/catalogApi";
import { Delete, Edit} from "@mui/icons-material";
import { currencyFormat } from "../../lib/util";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "../catalog/catalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import { Product } from "../../app/models/product";
import { useDeleteProductMutation } from "./adminApi";

export default function InventoryPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const productParams = useAppSelector(state => state.catalog);
    const {data, refetch} = useFetchProductsQuery(productParams);
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteProduct] = useDeleteProductMutation();

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditMode(true);
    }

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    if (editMode) return <ProductForm 
        setEditMode = {setEditMode} 
        product={selectedProduct}
        refetch = {refetch}
        setSelectedProduct = {setSelectedProduct}
    />

    // Mobile Card Layout
    const MobileProductCard = ({ product }: { product: Product }) => (
        <Card sx={{ mb: 2, width: '100%' }}>
            <CardContent sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <img 
                        src={product.pictureUrl} 
                        alt={product.name}
                        style={{
                            height: isSmallMobile ? 40 : 50, 
                            width: isSmallMobile ? 40 : 50,
                            objectFit: 'cover',
                            borderRadius: 4,
                            marginRight: 12
                        }}
                    />
                    <Box flex={1} minWidth={0}>
                        <Typography variant="h6" noWrap>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ID: {product.id}
                        </Typography>
                    </Box>
                </Box>
                
                <Box 
                    sx={{ 
                        display: 'flex',
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Price
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {currencyFormat(product.price)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Quantity
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {product.quantityInStock}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1} mb={1}>
                    <Chip 
                        label={product.type} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip 
                        label={product.brand} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                    />
                </Box>
            </CardContent>
            
            <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                <IconButton 
                    onClick={() => handleSelectProduct(product)}
                    color="primary"
                    size="small"
                >
                    <Edit />
                </IconButton>
                <IconButton 
                    onClick={() => handleDeleteProduct(product.id)}
                    color="error"
                    size="small"
                >
                    <Delete />
                </IconButton>
            </CardActions>
        </Card>
    );

    return (
        <>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 2, sm: 0 },
                    p: { xs: 1, sm: 2 }
                }}
            >
                <Typography 
                    variant={isSmallMobile ? 'h5' : 'h4'} 
                    sx={{ 
                        textAlign: { xs: 'center', sm: 'left' },
                        mb: { xs: 0, sm: 0 }
                    }}
                >
                    Inventory
                </Typography>
                <Button 
                    onClick={() => setEditMode(true)} 
                    size={isSmallMobile ? "medium" : "large"}
                    variant="contained"
                    fullWidth={isSmallMobile}
                >
                    Create
                </Button>
            </Box>

            {isMobile ? (
                // Mobile Layout - Cards
                <Box sx={{ p: { xs: 1, sm: 2 } }}>
                    {data && data.items.map(product => (
                        <MobileProductCard key={product.id} product={product} />
                    ))}
                    
                    {data?.pagination && data.items.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <AppPagination
                                metadata={data.pagination}
                                onPageChange={(page: number) => dispatch(setPageNumber(page))}
                            />
                        </Box>
                    )}
                </Box>
            ) : (
                // Desktop Layout - Table
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">Product</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="center">Type</TableCell>
                                <TableCell align="center">Brand</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.items.map(product => (
                                <TableRow
                                    key={product.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {product.id}
                                    </TableCell> 
                                    <TableCell align="left">
                                        <Box display="flex" alignItems="center">
                                            <img 
                                                src={product.pictureUrl} 
                                                alt={product.name}
                                                style={{
                                                    height: 50, 
                                                    width: 50,
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                    marginRight: 16
                                                }}
                                            />
                                            <Typography variant="body2" noWrap>
                                                {product.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="bold">
                                            {currencyFormat(product.price)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={product.type} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={product.brand} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold">
                                            {product.quantityInStock}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            onClick={() => handleSelectProduct(product)}
                                            color="primary"
                                            size="small"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <Box sx={{ p: 3 }}>
                        {data?.pagination && data.items.length > 0 && (
                            <AppPagination
                                metadata={data.pagination}
                                onPageChange={(page: number) => dispatch(setPageNumber(page))}
                            />
                        )}
                    </Box>
                </TableContainer>
            )}
        </>
    )
}
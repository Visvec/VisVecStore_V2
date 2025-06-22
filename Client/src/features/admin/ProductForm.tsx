import { FieldValues, useForm } from "react-hook-form"
import { createProductSchema, CreateProductSchema } from "../../lib/schemas/createProductSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Grid, Paper, Typography, useTheme, useMediaQuery } from "@mui/material"
import AppTextInput from "../../app/shared/components/AppTextInput"
import { useFetchFiltersQuery } from "../catalog/catalogApi"
import AppSelectInput from "../../app/shared/components/AppSelectInput"
import AppDropZone from "../../app/shared/components/AppDropZone"
import { useMemo, useEffect } from "react"
import { Product } from "../../app/models/product"
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi"
import { LoadingButton } from '@mui/lab'
import { handleApiError } from "../../lib/util"

type Props = {
    setEditMode: (value: boolean) => void;
    product: Product | null;
    refetch: () => void
    setSelectedProduct: (value: Product | null) => void
}

export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const {control, handleSubmit, watch, reset, setError, formState: {isSubmitting} } = useForm<CreateProductSchema>({
         mode: 'onTouched',
        resolver: zodResolver(createProductSchema)
    })
    const watchFile = watch('file');
    const {data} = useFetchFiltersQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    // Create preview URL for the file
    const filePreview = useMemo(() => {
        if (watchFile && watchFile instanceof File) {
            return URL.createObjectURL(watchFile);
        }
        return null;
    }, [watchFile]);

    // Cleanup the object URL when file changes or component unmounts
    useEffect(() => {
        return () => {
            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);

    useEffect(() => {
        if(product) reset(product);

        return () => {
            if(filePreview) URL.revokeObjectURL(filePreview)
        }
    }, [product, reset, filePreview]);

    const createFormData = (items: FieldValues) => {
        const formData = new FormData();
        for (const key in items) {
                formData.append(key, items[key])
        }

        return formData;
    }

    const onSubmit = async (data: CreateProductSchema) => {
       try {
        const formData = createFormData(data);
        
        if (filePreview) formData.append('file', filePreview);

        if(product) await updateProduct({id: product.id, data: formData}).unwrap();
        else await createProduct(formData).unwrap();
        setEditMode(false);
        setSelectedProduct(null);
        refetch();
       } catch (error) {
                console.log(error);
                handleApiError<CreateProductSchema>(error, setError, 
                    ['brand','description','file','name','pictureUrl','price','quantityInStock','type']);
       }
    }

    return (
        <Box 
            component={Paper} 
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                maxWidth: 'lg', 
                mx: 'auto',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{
                    mb: { xs: 2, sm: 3, md: 4 },
                    textAlign: { xs: 'center', sm: 'left' }
                }}
            >
                Product details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid size={12}>
                        <AppTextInput control={control} name="name" label='Product name'/>
                    </Grid>  
                    <Grid size={{ xs: 12, sm: 6 }}>
                        {data?.brands && 
                            <AppSelectInput 
                                items={data.brands}
                                control={control} 
                                name="brand" 
                                label='Brand'/>}
                    </Grid> 
                    <Grid size={{ xs: 12, sm: 6 }}>
                        {data?.types && 
                            <AppSelectInput 
                                items={data.types}
                                control={control} 
                                name="type" 
                                label='Type'/>}
                    </Grid> 
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AppTextInput type="number" control={control} name="price" 
                            label='Price in Pesewas'/>
                    </Grid> 
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AppTextInput type="number" control={control} name="quantityInStock" label='Quantity in stock'/>
                    </Grid> 
                    <Grid size={12}>
                        <AppTextInput 
                            control={control} 
                            multiline
                            rows={isMobile ? 3 : 4}
                            name="description" 
                            label='Description'/>
                    </Grid> 
                    <Grid 
                        size={12} 
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'stretch', md: 'center' },
                            gap: { xs: 2, md: 3 }
                        }}
                    >
                        <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                            <AppDropZone name="file" control={control}/>
                        </Box>
                        {(filePreview || product?.pictureUrl) && (
                            <Box 
                                sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-end' },
                                    flex: { md: 1 },
                                    minWidth: 0
                                }}
                            >
                                <img 
                                    src={filePreview || product?.pictureUrl} 
                                    alt='preview of image'
                                    style={{
                                        maxHeight: isMobile ? 150 : isTablet ? 180 : 200,
                                        maxWidth: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: theme.shape.borderRadius
                                    }}
                                />
                            </Box>
                        )}
                    </Grid>           
                </Grid>
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        gap: { xs: 2, sm: 0 },
                        mt: { xs: 2, sm: 3 }
                    }}
                >
                    <Button 
                        onClick={() => setEditMode(false)} 
                        variant="contained" 
                        color="inherit"
                        fullWidth={isMobile}
                        sx={{ order: { xs: 2, sm: 1 } }}
                    >
                        Cancel
                    </Button>
                    <LoadingButton 
                        loading={isSubmitting}
                        variant="contained" 
                        color="success" 
                        type="submit"
                        fullWidth={isMobile}
                        sx={{ order: { xs: 1, sm: 2 } }}
                    >
                        Submit
                    </LoadingButton>
                </Box>
            </form>
        </Box>
    )
}
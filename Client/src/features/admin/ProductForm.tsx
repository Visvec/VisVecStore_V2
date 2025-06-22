import { FieldValues, useForm } from "react-hook-form"
import { createProductSchema, CreateProductSchema } from "../../lib/schemas/createProductSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Grid, Paper, Typography } from "@mui/material"
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
        <Box component={Paper} sx={{p:4, maxWidth: 'lg', mx: 'auto'}}>
            <Typography variant="h4" sx={{mb: 4}}>
                Product details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <AppTextInput control={control} name="name" label='Product name'/>
                    </Grid>  
                    <Grid size={6}>
                        {data?.brands && 
                            <AppSelectInput 
                                items={data.brands}
                                control={control} 
                                name="brand" 
                                label='Brand'/>}
                    </Grid> 
                    <Grid size={6}>
                        {data?.types && 
                            <AppSelectInput 
                                items={data.types}
                                control={control} 
                                name="type" 
                                label='Type'/>}
                    </Grid> 
                    <Grid size={6}>
                        <AppTextInput type="number" control={control} name="price" 
                            label='Price in Pesewas'/>
                    </Grid> 
                    <Grid size={6}>
                        <AppTextInput type="number" control={control} name="quantityInStock" label='Quantity in stock'/>
                    </Grid> 
                    <Grid size={12}>
                        <AppTextInput 
                            control={control} 
                            multiline
                            rows={4}
                            name="description" 
                            label='Description'/>
                    </Grid> 
                    <Grid size={12} display='flex' justifyContent='space-between' 
                        alignItems='center'>
                        <AppDropZone name="file" control={control}/>
                        {filePreview ? (
                            <img src={filePreview} alt='preview of image' 
                                style={{maxHeight: 200}}/>
                        ): product?.pictureUrl?(
                            <img src={product?.pictureUrl} alt='preview of image' 
                                style={{maxHeight: 200}}/>
                        ): null}
                    </Grid>           
                </Grid>
                <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                    <Button onClick ={() => setEditMode(false)} variant="contained" color="inherit">Cancel</Button>
                    <LoadingButton 
                        loading ={isSubmitting}
                        variant="contained" 
                        color="success" 
                        type="submit"
                        >
                        Submit
                    </LoadingButton>
                </Box>
            </form>
        </Box>
    )
}
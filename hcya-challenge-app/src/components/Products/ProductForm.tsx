import { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, mapFormDataToApiData } from '../../schemas/productSchema';
import { 
  Drawer, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  CircularProgress,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBrands } from '../../hooks/brands';
import { useSupercategories } from '../../hooks/supercategories';
import { useCategories } from '../../hooks/categories';
import { useSubcategories } from '../../hooks/subcategories';
import { useCreateProduct } from '../../hooks/products';

type FormValues = {
  name: string;
  sku: string;
  description: string;
  price: string;
  stock: string;
  imgUrl: string;
  brandId: string;
  supercategoryId: string;
  categoryId: string;
  subcategoryId: string;
};

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProductForm({ open, onClose, onSuccess }: ProductFormProps) {
  const { data: brands = [] } = useBrands();
  const { data: supercategories = [] } = useSupercategories();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productFormSchema as any),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      price: '0',
      stock: '0',
      imgUrl: '',
      brandId: '',
      supercategoryId: '',
      categoryId: '',
      subcategoryId: undefined
    },
    mode: 'all'
  });

  const supercategoryId = watch('supercategoryId');
  const categoryId = watch('categoryId');

  // Filter categories based on selected supercategory
  const filteredCategories = supercategoryId
    ? categories.filter(cat => cat.supercategoryId === Number(supercategoryId))
    : [];

  // Filter subcategories based on selected category
  const filteredSubcategories = categoryId
    ? subcategories.filter(sub => sub.categoryId === Number(categoryId))
    : [];

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (supercategoryId) {
      setValue('categoryId', '');
      setValue('subcategoryId', '');
    }
  }, [supercategoryId, setValue]);

  useEffect(() => {
    if (categoryId) {
      setValue('subcategoryId', '');
    }
  }, [categoryId, setValue]);

  // Reset form when opening/closing
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Convert form data to API data format
    const apiData = mapFormDataToApiData(data);
    
    // Create the product with properly typed data
    createProduct({
      ...apiData,
      description: apiData.description || '',
      imgUrl: apiData.imgUrl || ''
    }, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error creating product:', error);
        // Handle API validation errors here if needed
      }
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '500px' },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 3, py: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Nuevo Producto
            </Typography>
            <IconButton onClick={onClose} edge="end" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={1.5}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Nombre del producto"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="SKU"
                    error={!!errors.sku}
                    helperText={errors.sku?.message as string}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Descripción"
                    error={!!errors.description}
                    helperText={errors.description?.message as string}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                  />
                )}
              />
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Precio"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price?.message as string}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0, step: '0.01' }
                    }}
                  />
                )}
              />
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Stock"
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message as string}
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 0 }}
                  />
                )}
              />
              <Controller
                name="imgUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="URL de la imagen"
                    error={!!errors.imgUrl}
                    helperText={errors.imgUrl?.message as string}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" margin="dense" error={!!errors.brandId}>
                    <InputLabel>Marca</InputLabel>
                    <Select
                      {...field}
                      label="Marca"
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.brandId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.brandId?.message as string}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="supercategoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" margin="dense" error={!!errors.supercategoryId}>
                    <InputLabel>Supercategoría</InputLabel>
                    <Select
                      {...field}
                      label="Supercategoría"
                    >
                      {supercategories.map((supercategory) => (
                        <MenuItem key={supercategory.id} value={supercategory.id.toString()}>
                          {supercategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.supercategoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.supercategoryId?.message as string}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" margin="dense" error={!!errors.categoryId}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      {...field}
                      label="Categoría"
                      disabled={!supercategoryId}
                    >
                      {filteredCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryId?.message as string}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="subcategoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" margin="dense" error={!!errors.subcategoryId}>
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
                      {...field}
                      label="Subcategoría"
                      disabled={!categoryId}
                    >
                      {filteredSubcategories.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subcategoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.subcategoryId?.message as string}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Stack>
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', bottom: 0, zIndex: 1 }}>
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                color="inherit"
                disabled={isPending}
                size="large"
              >
                Descartar
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending}
                size="large"
                startIcon={isPending ? <CircularProgress size={20} /> : undefined}
              >
                {isPending ? 'Creando...' : 'Crear'}
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
}

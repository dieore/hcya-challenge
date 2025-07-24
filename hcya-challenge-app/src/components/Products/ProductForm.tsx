import { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, type Product } from '../../schemas/productSchema';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbar } from '../../store/snackbar/snackbarSlice';
import { setDirtyState } from '../../store/dirty/dirtySlice';
import { openModal } from '../../store/modal/modalSlice';
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
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBrands } from '../../hooks/brands';
import { useSupercategories } from '../../hooks/supercategories';
import { useCategories } from '../../hooks/categories';
import { useSubcategories } from '../../hooks/subcategories';
import { useCreateProduct, useUpdateProduct } from '../../hooks/products';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: Product | null;
}

export default function ProductForm({ open, onClose, onSuccess, product }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const { data: brands = [] } = useBrands();
  const { data: supercategories = [] } = useSupercategories();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const isEditing = !!product?.id;
  
  const handleSubmitForm = (data: Product) => {    
    if (isEditing && product) {
      const { id, ...productData } = data;

      updateProduct(
        { 
          id: id!, 
          product: productData
        },
        {
          onSuccess: () => {
            dispatch(showSnackbar({ 
              message: 'Producto actualizado exitosamente',
              severity: 'success' as const
            }));
            onClose();
            onSuccess?.();
          },
          onError: (error: Error) => {
            console.error('Error updating product:', error);
            dispatch(showSnackbar({ 
              message: 'Error al actualizar el producto',
              severity: 'error' as const
            }));
          }
        }
      );
    } else {
      createProduct(data, {
        onSuccess: () => {
          dispatch(showSnackbar({ 
            message: 'Producto creado exitosamente',
            severity: 'success' as const
          }));
          onClose();
          onSuccess?.();
        },
        onError: (error: Error) => {
          console.error('Error creating product:', error);
          dispatch(showSnackbar({ 
            message: 'Error al crear el producto',
            severity: 'error' as const
          }));
        }
      });
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<Product>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      brandId: product.brandId,
      supercategoryId: product.supercategoryId,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId
    } : {
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      imgUrl: '',
      brandId: '',
      supercategoryId: '',
      categoryId: '',
      subcategoryId: ''
    },
    mode: 'all'
  });

  const supercategoryId = watch('supercategoryId');
  const categoryId = watch('categoryId');

  useEffect(() => {
    if (isDirty) {      
      setValue('categoryId', '');
      setValue('subcategoryId', '');
    }
  }, [supercategoryId]);

  useEffect(() => {
    if (isDirty) {
      setValue('subcategoryId', '');
    }
  }, [categoryId]);

  useEffect(() => {
    if (open) {
      if (product) {
        reset(product);
      } else {
        reset({
          name: '',
          sku: '',
          description: '',
          price: 0,
          stock: 0,
          imgUrl: '',
          brandId: '',
          supercategoryId: '',
          categoryId: '',
          subcategoryId: ''
        });
      }
    }
  }, [open, product, reset]);

  useEffect(() => {
    dispatch(setDirtyState({ model: 'products', key: 'productForm', isDirty }));
  }, [dispatch, isDirty]);

  const onSubmit: SubmitHandler<Product> = (data) => {
    handleSubmitForm(data);
    dispatch(setDirtyState({ model: 'products', key: 'productForm', isDirty: false }));
  };

  const handleClose = () => {
    if (isDirty) {
      dispatch(openModal({
        title: 'Descartar cambios',
        message: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres descartarlos?',
        onConfirm: () => {
          onClose();
          dispatch(setDirtyState({ model: 'products', key: 'productForm', isDirty: false }));
        }
      }));
    } else {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '500px' },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
          <IconButton onClick={handleClose} edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Nombre"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    fullWidth
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
                  />
                )}
              />
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    size="small"
                    label="Precio"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price?.message as string}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    size="small"
                    label="Stock"
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message as string}
                    fullWidth
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
                  />
                )}
              />
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small"  error={!!errors.brandId}>
                    <InputLabel>Marca</InputLabel>
                    <Select
                      {...field}
                      label="Marca"
                    >
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.brandId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.brandId?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="supercategoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small"  error={!!errors.supercategoryId}>
                    <InputLabel>Super categoría</InputLabel>
                    <Select
                      {...field}
                      label="Super categoría"
                    >
                      {supercategories.map((supercategory) => (
                        <MenuItem key={supercategory.id} value={supercategory.id.toString()}>
                          {supercategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.supercategoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.supercategoryId?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small"  error={!!errors.categoryId}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      {...field}
                      label="Categoría"
                      disabled={!supercategoryId}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryId?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="subcategoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small"  error={!!errors.subcategoryId}>
                    <InputLabel>Sub categoría</InputLabel>
                    <Select
                      {...field}
                      label="Sub categoría"
                      disabled={!categoryId}
                    >
                      {subcategories.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subcategoryId && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.subcategoryId?.message}</FormHelperText>
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
                onClick={handleClose}
              >
                Descartar
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? <CircularProgress size={24} color="inherit" /> : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
}

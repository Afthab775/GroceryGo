import React, { useState, useEffect } from 'react'
import {
  Box, TextField, Typography, Button, Select, MenuItem,
  InputLabel, FormControl, Paper, Grid, Chip, alpha, Divider
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

export default function Updateproducts() {
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("admintoken");
  const { pid } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/category/getcategory`)
      .then((res) => {
        console.log(res.data);
        setCategory(res.data.categories);
      })
      .catch((error) => {
        console.log(error);
        showSnackbar("Error loading categories", "error");
      });
  }, []);

  const [subcategories, setSubcategories] = useState([]);

  const [products, setProducts] = useState({
    pname: '',
    pdescription: '',
    pprice: '',
    pquantity: '',
    punit: '',
    pimage: '',
    cid: '',
    subid: ''
  });

  useEffect(() => {
    if (loaded) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/product/getproductbyid/${pid}`)
      .then((res) => {
        const prod = res.data.oneproduct;
        setProducts({
          pname: prod.product_name || '',
          pdescription: prod.product_description || '',
          pprice: prod.product_price || '',
          pquantity: prod.product_quantity || '',
          punit: prod.product_unit || '',
          pimage: prod.product_image || '',
          cid: prod.categoryID || '',
          subid: prod.subcategoryID || '',
        });
        setLoaded(true);
        setImagePreview(
          prod.product_image.startsWith("http")
            ? prod.product_image
            : `${import.meta.env.VITE_API_URL}/api/image/${prod.product_image}`);
        
        return axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getbycategory/${prod.categoryID}`);
      })
      .then((res2) => {
        if (res2) {
          setSubcategories(res2.data.subcats || []);
        }
      })
      .catch((error) => {
        console.log(error);
        showSnackbar("Error loading product details", "error");
      });
  }, [pid, loaded]);

  const handlechange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pimage") {
      const file = files[0];
      setProducts({ ...products, pimage: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
    else if (name === "cid") {
      setProducts({ ...products, cid: value, subid: "" });

      // Load subcategories of selected category
      axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getbycategory/${value}`)
        .then((res) => {
          setSubcategories(res.data.subcats || []);
        })
        .catch((err) => {
          console.log(err);
          showSnackbar("Error loading subcategories", "error");
        });
    }
    else {
      setProducts({ ...products, [name]: value });
    }
  };

  const validateForm = () => {
    if (!products.pname.trim()) {
      showSnackbar("Please enter product name", "warning");
      return false;
    }
    if (!products.pdescription.trim()) {
      showSnackbar("Please enter product description", "warning");
      return false;
    }
    if (!products.pprice) {
      showSnackbar("Please enter product price", "warning");
      return false;
    }
    if (!products.pquantity) {
      showSnackbar("Please enter stock quantity", "warning");
      return false;
    }
    if (!products.punit.trim()) {
      showSnackbar("Please enter product unit", "warning");
      return false;
    }
    if (!products.cid) {
      showSnackbar("Please select a category", "warning");
      return false;
    }
    if (!products.subid) {
      showSnackbar("Please select a subcategory", "warning");
      return false;
    }
    return true;
  };

  const handleupdate = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append('product_name', products.pname);
      data.append('product_description', products.pdescription);
      data.append('product_price', products.pprice);
      data.append('product_quantity', products.pquantity);
      data.append('product_unit', products.punit);
      data.append('pimage', products.pimage);
      data.append('categoryID', products.cid);
      data.append('subcategoryID', products.subid);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/product/updateproduct/${pid}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "admin-token": admintoken
        }
      });

      if (res.status === 201) {
        showSnackbar("Product updated successfully", "success");
        setTimeout(() => {
          navigate('/admin/viewproducts');
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showSnackbar("Unauthorized access. Please login as admin.", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Failed to update product", "error");
      }
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha('#4caf50', 0.1),
            display: 'inline-flex'
          }}>
            <EditNoteIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              Update Product
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Edit product details and save changes
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate('/admin/viewproducts')}
          sx={{
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#43a047',
              bgcolor: alpha('#4caf50', 0.02),
            },
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          View All Products
        </Button>
      </Paper>

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: '800px',
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
          background: '#fff',
        }}
      >
        <Box component="form" autoComplete='off'>
          <Grid container spacing={3}>
            {/* Product Name */}
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                value={products.pname}
                fullWidth
                label="Product Name"
                name='pname'
                onChange={handlechange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4caf50',
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                value={products.pdescription}
                fullWidth
                label="Product Description"
                name='pdescription'
                onChange={handlechange}
                multiline
                minRows={3}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4caf50',
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            {/* Price and Quantity Row */}
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='off'
                value={products.pprice}
                fullWidth
                label="Price (₹)"
                name='pprice'
                type="number"
                onChange={handlechange}
                InputProps={{
                  startAdornment: <Typography sx={{ color: '#999', mr: 1 }}>₹</Typography>,
                }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4caf50',
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='off'
                value={products.pquantity}
                fullWidth
                label="Stock Quantity"
                name='pquantity'
                type="number"
                onChange={handlechange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4caf50',
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            {/* Unit - Full Width */}
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                value={products.punit}
                fullWidth
                label="Unit (e.g., kg, pcs, liter)"
                name='punit'
                onChange={handlechange}
                placeholder="e.g., 1kg, 500ml, 6 pieces"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fff' },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                      boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4caf50',
                    fontWeight: 600,
                  },
                }}
              />
            </Grid>

            {/* Category Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{
                  "&.Mui-focused": { color: "#4caf50" },
                }}>
                  Select Category
                </InputLabel>

                <Select
                  value={products.cid}
                  label="Select Category"
                  onChange={handlechange}
                  name='cid'
                  autoComplete='off'
                  required
                  sx={{
                    bgcolor: '#f8f9fa',
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4caf50",
                    },
                    "&.Mui-focused": {
                      bgcolor: '#fff',
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4caf50 !important",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>Select a category</MenuItem>
                  {category.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subcategory Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{
                  "&.Mui-focused": { color: "#4caf50" },
                }}>
                  Select Sub Category
                </InputLabel>

                <Select
                  value={products.subid}
                  label="Select Sub Category"
                  onChange={handlechange}
                  name='subid'
                  autoComplete='off'
                  disabled={!products.cid}
                  required
                  sx={{
                    bgcolor: !products.cid ? '#f5f5f5' : '#f8f9fa',
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4caf50",
                    },
                    "&.Mui-focused:not(.Mui-disabled)": {
                      bgcolor: '#fff',
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4caf50 !important",
                      },
                    },
                    "&.Mui-disabled": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {products.cid ? 'Select a subcategory' : 'Select a category first'}
                  </MenuItem>
                  {subcategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.sub_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Product Image" size="small" />
              </Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <input
                  accept="image/*"
                  type="file"
                  id="product-image"
                  name='pimage'
                  onChange={handlechange}
                  style={{ display: 'none' }}
                />

                <label htmlFor="product-image">
                  <Paper
                    elevation={0}
                    sx={{
                      width: 140,
                      height: 140,
                      border: '2px dashed',
                      borderColor: imagePreview ? '#4caf50' : '#ccc',
                      borderRadius: 3,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      backgroundColor: imagePreview ? '#fff' : '#f8f9fa',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#4caf50',
                        backgroundColor: alpha('#4caf50', 0.02),
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    {imagePreview ? (
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(76, 175, 80, 0.9)',
                          color: 'white',
                          py: 0.5,
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          Change
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <CloudUploadOutlinedIcon sx={{
                          fontSize: 48,
                          color: '#ccc',
                          mb: 1,
                        }} />
                        <Typography variant="caption" sx={{
                          color: '#999',
                          display: 'block',
                          fontWeight: 500,
                        }}>
                          Upload Image
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </label>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500, mb: 1 }}>
                    Image Guidelines:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                    • Supported formats: JPG, PNG, GIF
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                    • Max file size: 5MB
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                    • Recommended: Square image for best results
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant='outlined'
                  onClick={() => navigate('/admin/viewproducts')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderColor: '#ccc',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#4caf50',
                      bgcolor: alpha('#4caf50', 0.02),
                      color: '#4caf50',
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant='contained'
                  onClick={handleupdate}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  }}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Helper Tips Card */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: '800px',
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha('#4caf50', 0.03),
          border: '1px solid',
          borderColor: alpha('#4caf50', 0.1),
        }}
      >
        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
          <strong style={{ color: '#4caf50' }}>📝 Note:</strong> Changes will be reflected immediately in the product listing.
        </Typography>
      </Paper>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}
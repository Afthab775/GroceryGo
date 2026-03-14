import React, { useEffect, useState } from 'react'
import {
  Box, TextField, Typography, Button, Paper, alpha,
  FormControl, InputLabel, Select, MenuItem, Grid, Divider, Chip
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

export default function UpdateSubCat() {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const admintoken = localStorage.getItem("admintoken");
  const navigate = useNavigate();
  const { subid } = useParams();

  const [subcategory, setSubcategory] = useState({
    subname: '',
    subimage: '',
    cid: ''
  });

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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getsubcategorybyid/${subid}`)
      .then((res) => {
        const sub = res.data.subcategory;
        setSubcategory({
          subname: sub.sub_name || '',
          subimage: sub.sub_image || '',
          cid: sub.parent_category || '',
        });
        setImagePreview(
          sub.sub_image.startsWith("http")
            ? sub.sub_image
            : `${import.meta.env.VITE_API_URL}/api/image/${sub.sub_image}`);
      })
      .catch((error) => {
        console.log(error);
        showSnackbar("Error loading subcategory details", "error");
      });
  }, [subid]);

  const handlechange = (e) => {
    if (e.target.name == "subimage") {
      const file = e.target.files[0];
      setSubcategory({ ...subcategory, subimage: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setSubcategory({ ...subcategory, [e.target.name]: e.target.value });
      console.log({ [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!subcategory.subname.trim()) {
      showSnackbar("Please enter subcategory name", "warning");
      return false;
    }
    if (!subcategory.cid) {
      showSnackbar("Please select a category", "warning");
      return false;
    }
    return true;
  };

  const handleupdate = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append('sub_name', subcategory.subname);
      data.append('sub_image', subcategory.subimage);
      data.append('parent_category', subcategory.cid);

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/subcategory/updatesubcategory/${subid}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "admin-token": admintoken
        }
      });

      if (res.status === 201) {
        showSnackbar("Sub Category updated successfully", "success");
        setTimeout(() => {
          navigate('/admin/viewcategories');
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showSnackbar("Unauthorized access. Please login as admin.", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Failed to update subcategory", "error");
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
              Update Sub Category
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Edit subcategory details and save changes
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/viewcategories')}
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
          View Categories
        </Button>
      </Paper>

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: '700px',
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
            {/* Sub Category Name Field */}
            <Grid item xs={12}>
              <TextField
                autoComplete='off'
                value={subcategory.subname}
                fullWidth
                label="Sub Category Name"
                name='subname'
                onChange={handlechange}
                placeholder="e.g., Fresh Fruits, Organic Vegetables"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#fff',
                    },
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{
                  "&.Mui-focused": { color: "#4caf50" },
                }}>
                  Select Parent Category
                </InputLabel>

                <Select
                  value={subcategory.cid}
                  label="Select Parent Category"
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                        {cat.category_name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Sub Category Image" size="small" />
              </Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                <input
                  accept="image/*"
                  type="file"
                  name='subimage'
                  id="subcategory-image"
                  onChange={handlechange}
                  autoComplete='off'
                  style={{ display: 'none' }}
                />

                <label htmlFor="subcategory-image">
                  <Paper
                    elevation={0}
                    sx={{
                      width: 160,
                      height: 160,
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
                          Change Image
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <CloudUploadOutlinedIcon sx={{
                          fontSize: 48,
                          color: '#ccc',
                          mb: 1,
                        }} />
                        <Typography variant="body2" sx={{
                          color: '#999',
                          fontWeight: 500,
                        }}>
                          Upload Image
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: '#ccc',
                          display: 'block',
                          mt: 0.5,
                        }}>
                          Click to browse
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </label>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 1.5 }}>
                    Image Guidelines:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#4caf50' }} />
                      Supported formats: JPG, PNG, GIF
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#4caf50' }} />
                      Max file size: 5MB
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#4caf50' }} />
                      Recommended: Square image (500x500px)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant='outlined'
                  onClick={() => navigate('/admin/viewcategories')}
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
                  {loading ? 'Updating...' : 'Update Sub Category'}
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
          maxWidth: '700px',
          mt: 3,
          p: 2.5,
          borderRadius: 2,
          bgcolor: alpha('#4caf50', 0.03),
          border: '1px solid',
          borderColor: alpha('#4caf50', 0.1),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box sx={{
            minWidth: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: alpha('#4caf50', 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700 }}>ℹ️</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, mb: 0.5 }}>
              Update Information
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.6 }}>
              Changes will be reflected immediately. The subcategory will be updated under its parent category.
              Make sure the category selection is correct.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}
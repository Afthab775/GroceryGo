import React, { useState, useEffect } from 'react'
import {
  Box, Paper, IconButton, Typography, Button, Avatar,
  Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, alpha, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, InputAdornment, Tooltip, Stack
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import axios from 'axios';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#4caf50',
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha('#4caf50', 0.02),
  },
  '&:hover': {
    backgroundColor: alpha('#4caf50', 0.05),
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ViewProducts() {
  const admintoken = localStorage.getItem("admintoken");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const fetchproducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getproduct`);
      setProducts(response.data.products);
      console.log("All products", response.data.products);
    } catch (error) {
      console.log(error);
      showSnackbar("Error fetching products", "error");
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  const handledelete = async (pid) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/deleteproduct/${pid}`,
        { headers: { "admin-token": admintoken } }
      );
      
      if (res.status === 201 || res.status === 200) {
        showSnackbar("Product deleted successfully", "success");
        fetchproducts();
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showSnackbar("Unauthorized access. Please login as admin.", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Failed to delete product", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const filteredProducts = products.filter(product =>
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryID?.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subcategoryID?.sub_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
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
            <InventoryIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              Products Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Total {products.length} products in inventory
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f8f9fa',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            component={RouterLink}
            to="/admin/addproducts"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#43a047' },
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Paper>

      {/* Products Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Stock</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell align="right">SubCategory</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <InventoryIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Add your first product to get started'}
                  </Typography>
                  {!searchTerm && (
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/admin/addproducts"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2, bgcolor: '#4caf50' }}
                    >
                      Add Product
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <StyledTableRow key={product._id}>
                  <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={`${import.meta.env.VITE_API_URL}/api/image/${product.product_image}`}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                          {product.product_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          {product.product_description?.substring(0, 50)}
                          {product.product_description?.length > 50 ? '...' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      ₹{product.product_price}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {product.product_unit}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Chip
                      label={product.product_quantity}
                      size="small"
                      sx={{
                        bgcolor: product.product_quantity > 10 ? alpha('#4caf50', 0.1) : alpha('#ff9800', 0.1),
                        color: product.product_quantity > 10 ? '#4caf50' : '#ff9800',
                        fontWeight: 600,
                        minWidth: 50,
                      }}
                    />
                    {product.product_quantity < 5 && (
                      <Tooltip title="Low stock">
                        <WarningIcon sx={{ fontSize: 16, color: '#ff9800', ml: 1, verticalAlign: 'middle' }} />
                      </Tooltip>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Chip
                      label={product.categoryID?.category_name || 'N/A'}
                      size="small"
                      sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50', fontWeight: 500 }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Chip
                      label={product.subcategoryID?.sub_name || 'N/A'}
                      size="small"
                      sx={{ bgcolor: alpha('#2196f3', 0.1), color: '#2196f3', fontWeight: 500 }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Edit Product">
                      <IconButton
                        component={RouterLink}
                        to={`/admin/updateproducts/${product._id}`}
                        sx={{ 
                          color: '#4caf50',
                          '&:hover': { bgcolor: alpha('#4caf50', 0.1) }
                        }}
                      >
                        <ModeEditOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton
                        onClick={() => handleDeleteClick(product)}
                        sx={{ 
                          color: '#f44336',
                          '&:hover': { bgcolor: alpha('#f44336', 0.1) }
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#333' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666' }}>
            Are you sure you want to delete{' '}
            <strong>{selectedProduct?.product_name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            disabled={loading}
            sx={{ 
              borderColor: '#ccc',
              color: '#666',
              '&:hover': { borderColor: '#999' },
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handledelete(selectedProduct?._id)}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              boxShadow: 'none',
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}
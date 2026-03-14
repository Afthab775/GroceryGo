import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import {
  Box, Paper, IconButton, Typography, Button, Avatar,
  Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, alpha, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, InputAdornment, Tooltip, Stack
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';
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

export default function Viewsubcategories() {
  const admintoken = localStorage.getItem("admintoken");
  const { subid } = useParams();
  const navigate = useNavigate();
  const [subcats, setSubcats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubcat, setSelectedSubcat] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const fetchSubcats = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getbycategory/${subid}`)
      .then((res) => {
        setSubcats(res.data.subcats || []);
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error fetching subcategories", "error");
      });
  };

  // Fetch category name
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/category/getcategorybyid/${subid}`)
      .then((res) => {
        setCategoryName(res.data.onecategory?.category_name || 'Category');
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error loading category details", "error");
      });
  }, [subid]);

  useEffect(() => {
    fetchSubcats();
  }, [subid]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/subcategory/deletesubcategory/${id}`,
        { headers: { "admin-token": admintoken } }
      );
      
      if (res.status === 201 || res.status === 200) {
        showSnackbar("Subcategory deleted successfully", "success");
        fetchSubcats();
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showSnackbar("Unauthorized access. Please login as admin.", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Failed to delete subcategory", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (subcat) => {
    setSelectedSubcat(subcat);
    setOpenDialog(true);
  };

  const filteredSubcats = subcats.filter(sub =>
    sub.sub_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <CategoryIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              Subcategories - {categoryName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Total {subcats.length} subcategories
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Search subcategories..."
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
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/viewcategories')}
            sx={{
              borderColor: '#ccc',
              color: '#666',
              '&:hover': {
                borderColor: '#4caf50',
                bgcolor: alpha('#4caf50', 0.02),
                color: '#4caf50',
              },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/admin/addsubcategories"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#43a047' },
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            Add Subcategory
          </Button>
        </Stack>
      </Paper>

      {/* Subcategories Table */}
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
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Subcategory Name</StyledTableCell>
              <StyledTableCell align="center">Image</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubcats.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <CategoryIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No subcategories found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Add your first subcategory to get started'}
                  </Typography>
                  {!searchTerm && (
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/admin/addsubcategories"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2, bgcolor: '#4caf50' }}
                    >
                      Add Subcategory
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredSubcats.map((subcat, index) => (
                <StyledTableRow key={subcat._id}>
                  <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={
                          subcat.sub_image.startsWith("http")
                            ? subcat.sub_image
                            : `${import.meta.env.VITE_API_URL}/api/image/${subcat.sub_image}`}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        {subcat.sub_name}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Avatar
                      src={
                        subcat.sub_image.startsWith("http")
                          ? subcat.sub_image
                          : `${import.meta.env.VITE_API_URL}/api/image/${subcat.sub_image}`}
                      variant="rounded"
                      sx={{ width: 60, height: 60, mx: 'auto' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Edit Subcategory">
                      <IconButton
                        component={RouterLink}
                        to={`/admin/updatesubcategories/${subcat._id}`}
                        sx={{
                          color: '#4caf50',
                          '&:hover': { bgcolor: alpha('#4caf50', 0.1) }
                        }}
                      >
                        <ModeEditOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Subcategory">
                      <IconButton
                        onClick={() => handleDeleteClick(subcat)}
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
        <DialogTitle sx={{ fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#ff9800' }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666' }}>
            Are you sure you want to delete subcategory{' '}
            <strong>{selectedSubcat?.sub_name}</strong>? This action cannot be undone.
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
            onClick={() => handleDelete(selectedSubcat?._id)}
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
  )
}
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, LinearProgress } from '@mui/material'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PeopleIcon from '@mui/icons-material/People'
import CategoryIcon from '@mui/icons-material/Category'
import PaymentIcon from '@mui/icons-material/Payment'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("admintoken");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate stats from fetched data
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalCategories = categories.length;
  const totalRevenue = payments.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchUsers(),
        fetchOrders()
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category/getcategory`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getproduct`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getuser`);
      setUsers(res.data.getusers || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/orders`, {
        headers: { "admin-token": admintoken }
      });
      
      const allOrders = response.data.orders || [];
      setOrders(allOrders);
      
      const paidOrders = allOrders.filter(order => order.paymentStatus === "paid");
      setPayments(paidOrders);

      const activeOrder = allOrders.filter(order => order.status !== "Cancelled");
      setActiveOrders(activeOrder);

      const cancel = allOrders.filter(order => order.status === "Cancelled");
      setCancelled(cancel);
    } catch (error) {
      console.log(error);
    }
  };

  // Stats with real data
  const stats = [
    { 
      title: 'Total Products', 
      value: totalProducts.toLocaleString(), 
      icon: <ShoppingBagIcon />, 
      color: '#4caf50', 
      link: '/admin/viewproducts'
    },
    { 
      title: 'Total Users', 
      value: totalUsers.toLocaleString(), 
      icon: <PeopleIcon />, 
      color: '#2196f3', 
      link: '/admin/manageusers'
    },
    { 
      title: 'Categories', 
      value: totalCategories.toLocaleString(), 
      icon: <CategoryIcon />, 
      color: '#ff9800', 
      link: '/admin/viewcategories'
    },
    { 
      title: 'Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: <PaymentIcon />, 
      color: '#9c27b0', 
      link: '/admin/viewpayments'
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Quick actions with navigation
  const quickActions = [
    { name: 'Add Product', path: '/admin/addproducts' },
    { name: 'Add Category', path: '/admin/addcategories' },
    { name: 'Add Sub Category', path: '/admin/addsubcategories'},
    { name: 'View Orders', path: '/admin/vieworders' },
    { name: 'Manage Users', path: '/admin/manageusers' },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                },
              }}
              onClick={() => navigate(stat.link)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                  {stat.icon}
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Recent Orders
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#4caf50', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/admin/vieworders')}
              >
                View All →
              </Typography>
            </Box>
            
            {recentOrders.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No recent orders</Typography>
              </Box>
            ) : (
              recentOrders.map((order, index) => (
                <Box key={order._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Order #{order._id.slice(-8)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      ₹{order.grandTotal?.toLocaleString()}
                    </Typography>
                    <Box sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1, 
                      bgcolor: order.status === 'Delivered' ? '#e8f5e9' : 
                               order.status === 'Cancelled' ? '#ffebee' : '#fff3e0',
                      color: order.status === 'Delivered' ? '#4caf50' : 
                             order.status === 'Cancelled' ? '#f44336' : '#ff9800',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {order.status}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {order.items?.length || 0} items
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>•</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {order.paymentMethod}
                    </Typography>
                  </Box>
                  {index < recentOrders.length - 1 && (
                    <LinearProgress sx={{ mt: 1, bgcolor: '#f0f0f0' }} variant="determinate" value={100} />
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Quick Actions
            </Typography>
            {quickActions.map((action, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#e8f5e9', transform: 'translateX(5px)' },
                }}
                onClick={() => navigate(action.path)}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                  {action.name}
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Summary Card */}
          <Paper sx={{ p: 3, mt: 3, borderRadius: 3, border: '1px solid #f0f0f0', bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Payment Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Paid Orders</Typography>
              <Typography variant="body2" fontWeight={600}>{payments.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Pending Orders</Typography>
              <Typography variant="body2" fontWeight={600}>
                {orders.length - activeOrders.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Cancelled Orders</Typography>
              <Typography variant="body2" fontWeight={600}>{cancelled.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Total Orders</Typography>
              <Typography variant="body2" fontWeight={600}>{orders.length}</Typography>
            </Box>
            <LinearProgress 
              sx={{ mt: 2, bgcolor: '#e0e0e0' }} 
              variant="determinate" 
              value={orders.length ? (payments.length / orders.length) * 100 : 0} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
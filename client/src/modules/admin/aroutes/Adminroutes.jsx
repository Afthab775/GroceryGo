import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import ResponsiveDrawer from '../acomponents/ResponsiveDrawer'
import Dashboard from '../acomponents/Dashboard'
import ManageUsers from '../acomponents/ManageUsers'
import ManageCategories from '../acomponents/ManageCategories'
import ManageProducts from '../acomponents/ManageProducts'
import ViewPayments from '../acomponents/ViewPayments'
import ViewCategories from '../acomponents/ViewCategories'
import ViewProducts from '../acomponents/ViewProducts'
import Login from '../acomponents/Login'
import Updatecategories from '../acomponents/Updatecategories'
import Updateproducts from '../acomponents/Updateproducts'
import SubCat from '../acomponents/SubCat'
import Viewsubcategories from '../acomponents/Viewsubcategories'
import UpdateSubCat from '../acomponents/UpdateSubCat'
import ManageOrder from '../acomponents/ManageOrder'
import ViewOrders from '../acomponents/ViewOrders'

const ProtectedRoute = ({ children }) => {
  const admintoken = localStorage.getItem("admintoken");

  if (!admintoken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const ProtectedLayout = ({ children }) => {
  return (
    <ResponsiveDrawer>
      {children}
    </ResponsiveDrawer>
  );
};

export default function Adminroutes() {
  return (
    <div>
        
      <Routes>
        <Route 
          path="/login" 
          element={
            localStorage.getItem("admintoken")
            ? <Navigate to="/admin/dashboard" replace />
            : <Login />
          } 
        />

        <Route 
          path='/'
          element={
            localStorage.getItem("admintoken") 
            ? <Navigate to="/admin/dashboard" replace /> 
            : <Navigate to="/admin/login" replace />
          }
        />

        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/manageusers' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ManageUsers/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/addcategories' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ManageCategories/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/addsubcategories' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SubCat/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/addproducts' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ManageProducts/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/viewpayments' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ViewPayments/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/viewcategories' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ViewCategories/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/viewproducts' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ViewProducts/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/updatecategories/:cid' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Updatecategories/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/updatesubcategories/:subid' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <UpdateSubCat/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/updateproducts/:pid' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Updateproducts/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/viewsubcategories/:subid' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Viewsubcategories/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/manageorder/:id' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ManageOrder/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path='/vieworders' 
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ViewOrders/>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  )
}

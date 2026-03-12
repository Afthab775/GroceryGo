import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Radio,
  IconButton,
  Dialog,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import home from "../../../assets/home.png";
import work from "../../../assets/company.png";
import ConfirmationDialog from "../../../ConfirmationDialog";
import CustomSnackbar from "../../../CustomSnackbar";
import useSnackbar from "../../../useSnackbar";

function AddressScreen({ onBack, refreshAddresses }) {
  const token = localStorage.getItem("usertoken");

  const [open, setOpen] = useState(false);
  const [typee, setType] = useState("Home");
  const [address, setAddress] = useState({
    type: "Home",
    building: "",
    floor: "",
    landmark: "",
    name: "",
    phone: "",
  });
  const [eaddress, setEaddress] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    addressId: null
  });
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const handlechange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    console.log({ [e.target.name]: e.target.value });
  };

  const addAddress = () => {
    console.log(address);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/address/add`,
        address,
        { headers: { "auth-token": token } }
      )
      .then((res) => {
        console.log(res.data);
        showSnackbar("Address saved successfully", "success");
        setOpen(false);

        return axios.get(
          `${import.meta.env.VITE_API_URL}/api/address/get`,
          { headers: { "auth-token": token } }
        );
      })
      .then((res) => {
        const updated = res.data.addresses || [];
        setEaddress(updated);

        if (refreshAddresses) {
          refreshAddresses();
        }
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error saving address", "error");
      });
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/get`,
        { headers: { "auth-token": token } }
      );
      setEaddress(res.data.addresses || []);
    } catch (err) {
      console.log(err);
      showSnackbar("Error fetching addresses", "error");
    }
  };

  const setDefault = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/address/default/${id}`,
        {},
        { headers: { "auth-token": token } }
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/get`,
        { headers: { "auth-token": token } }
      );

      const updated = res.data.addresses || [];
      setEaddress(updated);
      showSnackbar("Default address updated", "success");

      if (refreshAddresses) {
        refreshAddresses();
      }
    } catch (err) {
      console.log(err);
      showSnackbar("Error setting default address", "error");
    }
  };

  const deleteAddress = async (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete Address",
      message: "Are you sure you want to delete this address?",
      addressId: id,
      onConfirm: async () => {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/address/delete/${id}`,
            { headers: { "auth-token": token } }
          );

          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/address/get`,
            { headers: { "auth-token": token } }
          );

          const updated = res.data.addresses || [];
          setEaddress(updated);
          showSnackbar("Address deleted successfully", "success");

          if (refreshAddresses) {
            refreshAddresses();
          }
        } catch (err) {
          console.log(err);
          showSnackbar(err.response?.data?.msg || "Error deleting address", "error");
        }
      }
    });
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            color: "#2e7d32",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          + Add delivery address
        </Typography>

        {eaddress.length === 0 ? (
          <Typography sx={{ mt: 2 }} color="gray">
            No saved addresses
          </Typography>
        ) : (
          eaddress.map((add) => (
            <Card
              key={add._id}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                cursor: "pointer",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Radio
                    checked={add.isDefault}
                    onChange={() => setDefault(add._id)}
                    color="success"
                  />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <img
                        src={add.type === "Home" ? home : work}
                        alt=""
                        width={18}
                      />
                      <Typography fontWeight={600}>
                        {add.type}
                      </Typography>
                    </Box>

                    <Typography fontSize={14}>
                      {add.building},{" "}
                      {add.floor && `${add.floor}, `}
                      {add.landmark}
                    </Typography>

                    <Typography fontSize={13} color="gray">
                      {add.name} • {add.phone}
                    </Typography>
                  </Box>
                </Box>

                {!add.isDefault && (
                  <IconButton onClick={() => deleteAddress(add._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Box>
            </Card>
          ))
        )}
      </Box>

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={700} fontSize={18} sx={{ mb: 2 }}>
              Enter complete address
            </Typography>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              onClick={() => {
                setType("Home");
                setAddress((prev) => ({ ...prev, type: "Home" }));
              }}
              variant={typee === "Home" ? "contained" : "outlined"}
              startIcon={<img src={home} alt="Home" width={16} />}
              sx={typeButtonStyle(typee === "Home")}
            >
              Home
            </Button>

            <Button
              onClick={() => {
                setType("Work");
                setAddress((prev) => ({ ...prev, type: "Work" }));
              }}
              variant={typee === "Work" ? "contained" : "outlined"}
              startIcon={<img src={work} alt="Work" width={16} />}
              sx={typeButtonStyle(typee === "Work")}
            >
              Work
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="building"
              label="Flat / House.No / Building name*"
              fullWidth
              onChange={handlechange}
              sx={greyTextField}
            />
            <TextField
              name="floor"
              label="Floor (Optional)"
              fullWidth
              onChange={handlechange}
              sx={greyTextField}
            />
            <TextField
              name="landmark"
              label="Nearby landmark*"
              fullWidth
              onChange={handlechange}
              sx={greyTextField}
            />
            <TextField
              name="name"
              label="Name*"
              fullWidth
              onChange={handlechange}
              sx={greyTextField}
            />
            <TextField
              name="phone"
              label="Phone number*"
              fullWidth
              onChange={handlechange}
              sx={greyTextField}
            />

            <Button
              variant="contained"
              onClick={addAddress}
              sx={{
                mt: 1,
                bgcolor: "#1b5e20",
                py: 1.2,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { bgcolor: "#145a32" },
              }}
            >
              Save Address
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={handleConfirmClose}
        onConfirm={() => {
          if (confirmDialog.onConfirm) {
            confirmDialog.onConfirm();
          }
          handleConfirmClose();
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </>
  );
}

const typeButtonStyle = (active) => ({
  px: 1.5,
  py: 0.5,
  minWidth: "auto",
  textTransform: "none",
  fontSize: "0.85rem",
  borderRadius: 2,
  bgcolor: active ? "#1b5e20" : "transparent",
  color: active ? "#fff" : "#1b5e20",
  borderColor: "#1b5e20",
  "&:hover": {
    bgcolor: active ? "#145a32" : "rgba(27,94,32,0.08)",
  },
});

const greyTextField = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#c4c4c4" },
    "&:hover fieldset": { borderColor: "#b0b0b0" },
    "&.Mui-focused fieldset": { borderColor: "#c4c4c4" },
  },
  "& .MuiInputLabel-root": { color: "#777" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#777" },
};

export default AddressScreen;
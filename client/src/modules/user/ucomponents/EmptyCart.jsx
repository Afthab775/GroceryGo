import { Box, Typography, Button } from "@mui/material";
import empty from "../../../assets/empty.png";

const EmptyCart = ({ onClose }) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      px: 3,
      textAlign: "center",
    }}
  >
    <img
      src={empty}
      alt="Empty Cart"
      style={{ width: 180, marginBottom: 16 }}
    />

    <Typography fontWeight={700} fontSize={18} gutterBottom>
      Your cart is empty
    </Typography>

    <Typography fontSize={14} color="gray" sx={{ mb: 3 }}>
      Looks like you haven’t added anything yet
    </Typography>

    <Button
      variant="contained"
      sx={{
        bgcolor: "#1b5e20",
        borderRadius: 2,
        px: 4,
        "&:hover": { bgcolor: "#145a32" },
      }}
      onClick={onClose}
    >
      Start shopping
    </Button>
  </Box>
);

export default EmptyCart;
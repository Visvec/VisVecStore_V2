import {
  Box,
  Container,
  Typography,
  Avatar,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useGetProfileQuery } from "../account/accountApi";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let localShippingAddress = null;
  if (profile?.email) {
    const userEmail = profile.email.toLowerCase();
    localShippingAddress = JSON.parse(localStorage.getItem(`shippingAddress_${userEmail}`) || 'null');
  }

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error">Failed to load profile data.</Typography>
      </Container>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={isMobile ? "flex-start" : "center"}
      sx={{ mb: 1 }}
    >
      <Typography
        fontWeight={500}
        color="textSecondary"
        sx={{ flexBasis: isMobile ? '100%' : '40%', mb: isMobile ? 0.5 : 0 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          flexBasis: isMobile ? '100%' : '55%',
          textAlign: isMobile ? 'left' : 'right',
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 2, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} alignItems="center" mb={2}>
          <Avatar
            src={profile.profilePhoto || ""}
            sx={{ width: 60, height: 60, mb: isMobile ? 1 : 0, mr: isMobile ? 0 : 2 }}
          />
          <Typography variant={isMobile ? "h6" : "h5"} textAlign={isMobile ? "center" : "left"}>
            {profile.firstName} {profile.lastName}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Personal Details
        </Typography>
        <InfoRow label="First Name" value={profile.firstName} />
        <InfoRow label="Last Name" value={profile.lastName} />
        <InfoRow label="Date of Birth" value={profile.dateOfBirth} />

        {localShippingAddress && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Shipping Details
            </Typography>
            <InfoRow label="Hostel" value={localShippingAddress.hostel} />
            <InfoRow label="Landmark" value={localShippingAddress.landmark} />
            <InfoRow label="City" value={localShippingAddress.city} />
            <InfoRow label="Region" value={localShippingAddress.region} />
            <InfoRow label="Contact" value={localShippingAddress.contact} />
          </>
        )}

        <Box display="flex" justifyContent="center" mt={2}></Box>
      </Paper>
    </Container>
  );
}

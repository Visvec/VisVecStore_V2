import {
  Box,
  Container,
  Typography,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import { useGetProfileQuery } from "../account/accountApi";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useGetProfileQuery();

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
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
      <Typography fontWeight={500} color="textSecondary" sx={{ flexBasis: '40%' }}>
        {label}
      </Typography>
      <Typography sx={{ flexBasis: '55%', textAlign: 'right' }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={profile.profilePhoto || ""} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h6">
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

        <Box display="flex" justifyContent="center" mt={2}>
         
        </Box>
      </Paper>
    </Container>
  );
}

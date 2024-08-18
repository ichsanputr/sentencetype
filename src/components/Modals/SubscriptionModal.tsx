import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useTheme } from "@mui/material/styles";
import { setLoadingQris } from "../../store/testSlice";
import { Typography, Box, Button, Link } from "@mui/material";
import { Email, QrCodeScanner, CardMembership, History, CallMade } from '@mui/icons-material';
import { UserContext } from "../../store/userContext";
import axios from "axios";
import {
  setShowSubscriptionModal
} from "../../store/testSlice";

type packagesType = {
  id: number,
  text: string,
  source: string | number,
  length: string,
  priceIdr: number,
  priceEn: number,
  time: string
};

type paymentType = {
  package: string,
  trx_ref: string,
  checkout_url: string,
  status: string,
  kind: number,
  expired: string,
  created_at: number,
};

function PackagesCard({ sentence, active }: { sentence: packagesType, active: boolean }) {
  const theme = useTheme();
  return (
    <Box
      boxSizing={"border-box"}
      display="grid"
      p={1}
      sx={{
        borderRadius: "10px",
        padding: "16px 24px",
        marginBottom: "1rem",
        width: "100%",
        border: '6px solid',
        borderColor: active ? theme.sub.main : 'transparent',
        backgroundColor: theme.sub.alt,
        transition: "background-color 0.2s ease-in-out",
        cursor: "pointer"
      }}
    >
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: {
            xs: 2,
            sm: 3,
          },
        }}
        variant="body1"
        color={theme.text.main}
      >
        {sentence.text}
      </Typography>
      <Typography
        sx={{
          opacity: 0.9,
          lineHeight: "1.5 !important"
        }}
        variant="subtitle2"
        color={theme.sub.main}
      >
        {sentence.source}
      </Typography>
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        variant="subtitle1"
        marginTop={1}
        color={theme.text.main}
      >
        {sentence.length}
      </Typography>
    </Box>
  );
}

function PaymentCard({ payment }: { payment: paymentType }) {
  const theme = useTheme();
  return (
    <Box
      boxSizing={"border-box"}
      display="block"
      p={1}
      sx={{
        borderRadius: "10px",
        padding: "16px 24px",
        width: {
          xs: "100%",
          sm: "fit-content"
        },
        marginBottom: {
          xs: "1rem",
          sm: 0
        },
        height: {
          xs: "154px",
          sm: "176px"
        },
        border: '6px solid',
        borderColor: 'transparent',
        backgroundColor: theme.sub.alt,
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <Typography
        variant="body1"
        color={theme.text.main}
      >
        Package {payment.package}
      </Typography>
      <Typography
        variant="subtitle2"
        color={theme.sub.main}
      >
        Status: {payment.status}
      </Typography>
      <Typography
        sx={{
          opacity: 0.9,
        }}
        variant="subtitle2"
        color={theme.sub.main}
      >
        Expired At: {payment.kind == 1 ? '~' : payment.expired}
      </Typography>
      {payment.status == 'UNPAID' && <Typography
        sx={{
          cursor: "pointer",
        }}
        variant="body1"
        color={theme.text.main}
      >
        <Link href={payment.checkout_url} target="_blank" sx={{
          display: "flex",
          alignItems: "center"
        }} rel="noopener noreferrer"><p>Pay Now</p> <CallMade sx={{ marginLeft: "2px" }} fontSize="small" /></Link>
      </Typography>}
    </Box>
  );
}

function SubscriptionBoxModal() {
  const open = useAppSelector((state) => state.test.showSubscriptionModal);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [selectedPackage, setSelectedPackage] = useState<number>(1)
  const [listPayments, setListPayments] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState<string>("packages")
  const { username, user } = React.useContext(UserContext);
  const [packages, setPackages] = useState<packagesType[]>([
    {
      id: 1,
      text: "1 Month",
      source: "You can undertake all test and use all feature in this app for 1 month",
      length: "1$ / 10.000 Rp",
      priceIdr: 10000,
      priceEn: 1,
      time: "1$ / 10.000 Rp",
    },
    {
      id: 2,
      text: "3 Months",
      source: "You can undertake all test and use all feature in this app for 3 months",
      length: "2.5$ / 25.000 Rp",
      priceIdr: 25000,
      priceEn: 3,
      time: "90",
    },
    {
      id: 3,
      text: "Lifetime",
      source: "You can undertake all test and use all feature in this app for lifetime",
      length: "5$ / 80.000 Rp",
      priceIdr: 80000,
      priceEn: 5,
      time: "90",
    }
  ]);

  useEffect(() => {
    if (selectedTab != 'payment') {
      return
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://api.catsentence.com/payment/' + user?.email);
        setListPayments(data.data)
      } catch (err) {
        console.error(err)
      }
    };

    fetchData();
  }, [selectedTab]);

  const handleClose = () => {
    dispatch(setShowSubscriptionModal(false));
  };

  function selectPackage(id: number) {
    setSelectedPackage(id)
  }

  async function createPaymentQris() {
    dispatch(setLoadingQris(true))

    const _selectedPackage: any = packages.filter(v => {
      return v.id == selectedPackage
    })[0]

    try {
      const { data: { data } } = await axios.post('https://api.catsentence.com/payment/tripay/create', {
        price: _selectedPackage.priceIdr,
        name: username,
        email: user?.email,
        package_name: _selectedPackage.text
      });

      window.open(data.checkout_url, '_blank')
    } catch (err) {
      console.log(err)
    }

    setTimeout(() => {
      dispatch(setLoadingQris(false))
    }, 3000)
  }

  async function createPaymentPaypal() {
    dispatch(setLoadingQris(true))

    const _selectedPackage: any = packages.filter(v => {
      return v.id == selectedPackage
    })[0]

    try {
      const { data } = await axios.post('https://api.catsentence.com/payment/paypal/create', {
        price: _selectedPackage.priceEn,
        name: username,
        email: user?.email,
        package_name: _selectedPackage.text
      });

      window.open(data.checkout_url, '_blank')
    } catch (err) {
      console.log(err)
    }

    setTimeout(() => {
      dispatch(setLoadingQris(false))
    }, 3000)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          maxWidth: "1000px",
          display: "block",
          backgroundColor: theme.background.main,
          height: "fit-content",
          gridAutoColumns: "1fr",
          borderRadius: "10px",
          outline: `0.25rem solid ${theme.sub.alt}`,
          padding: {
            xs: "1rem",
            sm: "2rem",
          },
        }}
      >
        <Box marginBottom={"0.5rem"}>
          <Typography variant="h5" fontWeight={600} color={theme.sub.main}>
            Subscription
          </Typography>
        </Box>
        <Box display={"flex"} marginBottom={"0.5rem"}>
          <Box onClick={() => setSelectedTab("packages")} sx={{
            marginTop: 1,
            borderRadius: 2,
            padding: "0 6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            backgroundColor: selectedTab == "packages" ? theme.main.main : ''
          }} color={selectedTab == "packages" ? "white" : theme.sub.main}>
            <CardMembership sx={{ fontSize: 16, marginRight: "3px" }} />
            <p>Packages</p>
          </Box>
          <Box onClick={() => setSelectedTab("payment")} sx={{
            marginTop: 1,
            borderRadius: 2,
            padding: "0 6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginLeft: 2,
            backgroundColor: selectedTab == "payment" ? theme.main.main : ''
          }} color={selectedTab == "payment" ? "white" : theme.sub.main}>
            <History sx={{ fontSize: 18, marginRight: "3px" }} />
            <p>Payment</p>
          </Box>
        </Box>
        {selectedTab == "packages" && <Box>
          <Typography variant="subtitle1" sx={{
            marginTop: 1
          }} color={theme.sub.main}>
            Your subscription active until: <span style={{textDecoration: "underline"}}>3 days</span>
          </Typography>
          <Box
            overflow={"auto"}
            mt={1}
            sx={{
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.sub.main,
                borderRadius: "10px",
              },
              display: {
                sm: "flex"
              },
              gap: 2,
              marginTop: 3,
              height: {
                xs: "280px",
                sm: "fit-content"
              }
            }}
          >
            {packages.map((_sentence) => (
              <div onClick={() => selectPackage(_sentence.id)}>
                <PackagesCard key={_sentence.id} sentence={_sentence} active={selectedPackage == _sentence.id} />
              </div>
            ))}
          </Box>
          <Box marginTop={3} display={{ sm: "flex" }} alignItems={"center"} justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600} color={theme.sub.main}>
              Pay with Paypal or Qris (Indonesia)
            </Typography>
            <Box display="flex" marginTop={{ xs: 3, sm: 0 }} sx={{
              float: "right"
            }} gap={2}>
              <Button variant="contained" onClick={createPaymentPaypal}>
                Paypal
              </Button>
              <Button variant="contained" onClick={createPaymentQris} sx={{
                alignItems: "center"
              }}>
                <QrCodeScanner fontSize="small" />
                <div style={{ paddingTop: 2, paddingLeft: 4 }}>
                  Qris
                </div>
              </Button>
            </Box>
          </Box>
        </Box>}
        {selectedTab == "payment" && <Box>
          <Typography variant="subtitle1" sx={{
            marginTop: 1
          }} color={theme.sub.main}>
            List of all your payments.
          </Typography>
          <Box
            overflow={"auto"}
            mt={1}
            sx={{
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.sub.main,
                borderRadius: "10px",
              },
              display: {
                xs: "block",
                sm: "flex"
              },
              marginTop: 3,
              gap: 2,
              height: {
                xs: "280px",
                sm: "fit-content"
              }
            }}
          >
            {listPayments && listPayments.map((_payment: any) => (
              <PaymentCard key={_payment.id} payment={_payment} />
            ))}
          </Box>
        </Box>}
      </Box>
    </Modal>
  );
}

export default SubscriptionBoxModal;

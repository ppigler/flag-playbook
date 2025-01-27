import { Container } from "@mui/material";
import { Metadata } from "next";
import Navigation from "@/component/Navigation/Navigation";

export const metadata: Metadata = {
  title: "Flag Football Playbook",
  description:
    "Create, customize, and print flag football playbooks with ease using our free online interactive editor. Perfect for coaches and teams!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Container
          maxWidth="lg"
          id="body-container"
          sx={{ paddingBlockEnd: 12, overflowX: "hidden", height: "100vh" }}
        >
          {children}
        </Container>
        <Navigation />
      </body>
    </html>
  );
}

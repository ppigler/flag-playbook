"use client";

import PdfDocument from "@/component/PdfExport/PdfExport";
import Playbook from "@/component/Playbook/Playbook";
import SelectFormationDialog from "@/component/SelectFormationDialog/SelectFormationDialog";
import { usePlayStore } from "@/store/playStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TbSquareRoundedPlus } from "react-icons/tb";
import { TbPrinter } from "react-icons/tb";
import { TbSettings } from "react-icons/tb";

const ExportPlaybookButton = ({ disabled }: { disabled?: boolean }) => (
  <Button size="small" aria-label="export playbook" disabled={disabled}>
    Export Playbook
  </Button>
);

const PlaysPage = () => {
  const plays = usePlayStore.use.plays();
  const formations = useSettingsStore.use.formations();

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);

  const handleOpenFormationModal = () => setIsFormationModalOpen(true);
  const handleCloseFormationModal = () => setIsFormationModalOpen(false);

  const isExportPlaysDisabled = useMemo(
    () => Object.keys(plays).length === 0,
    [plays]
  );

  return (
    <>
      <SelectFormationDialog
        formations={formations}
        handleClose={handleCloseFormationModal}
        isOpened={isFormationModalOpen}
      />
      <Grid container spacing={3}>
        <Grid size={4}>
          <Card>
            <CardContent
              sx={{
                height: 40,
                justifyContent: "center",
                display: "flex",
              }}
            >
              <TbSquareRoundedPlus size={40} />
            </CardContent>
            <CardActions>
              <Button onClick={handleOpenFormationModal} size="small">
                Add new play
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent
              sx={{
                height: 40,
                justifyContent: "center",
                display: "flex",
              }}
            >
              <TbPrinter size={40} />
            </CardContent>
            <CardActions>
              {isExportPlaysDisabled ? (
                <ExportPlaybookButton disabled />
              ) : (
                <PDFDownloadLink document={<PdfDocument />}>
                  <ExportPlaybookButton />
                </PDFDownloadLink>
              )}
            </CardActions>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent
              sx={{
                height: 40,
                justifyContent: "center",
                display: "flex",
              }}
            >
              <TbSettings size={40} />
            </CardContent>
            <CardActions>
              <Link passHref href="/settings" aria-label="settings">
                <Button size="small">Settings</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
        <Playbook />
      </Grid>
    </>
  );
};

export default PlaysPage;

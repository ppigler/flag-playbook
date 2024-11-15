/* eslint-disable jsx-a11y/alt-text */
import {
  CUTOUT_BORDER,
  PLAY_BORDER,
  PLAYS_PER_NEXT_SEGMENT,
  PLAYS_PER_ROW,
  PLAYS_PER_SEGMENT,
} from "@/constants/export";
import { usePlayStore } from "@/store/playStore";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: "4cm",
    width: "4cm",
    margin: 2,
    border: PLAY_BORDER,
    borderRadius: 6,
    overflow: "hidden",
  },
  title: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  topRight: {
    top: 0,
    left: "100vw",
    position: "absolute",
    transform: "rotate(90deg)",
    transformOrigin: "top left",
  },
});

const PdfDocument = () => {
  const plays = usePlayStore.getState().plays;
  const playbook = Object.values(plays).map(({ image }, idx) => ({
    image,
    name: idx + 1,
  }));
  const wristCoachPages = Math.min(
    Math.ceil(playbook.length / PLAYS_PER_ROW),
    6
  );

  const isPlaybookEmpty = playbook.filter(({ image }) => !!image).length === 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        {!isPlaybookEmpty && (
          <View>
            {playbook.slice(0, wristCoachPages).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  {
                    borderBottom: index % 2 ? CUTOUT_BORDER : "none",
                    borderRight: CUTOUT_BORDER,
                    borderLeft: CUTOUT_BORDER,
                  },
                ]}
              >
                {playbook
                  .slice(0, PLAYS_PER_SEGMENT)
                  .slice(index * PLAYS_PER_ROW, (index + 1) * PLAYS_PER_ROW)
                  .map(({ image }, subIdx) => (
                    <View key={`${index}-${subIdx}`} style={styles.image}>
                      <Text style={styles.title}>
                        {index * PLAYS_PER_ROW + subIdx + 1}
                      </Text>
                      <Image src={image} />
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}
        {!isPlaybookEmpty && (
          <View style={[styles.topRight, { border: CUTOUT_BORDER }]}>
            {playbook.map((_, index) => (
              <View key={index} style={styles.row}>
                {playbook
                  .slice(PLAYS_PER_SEGMENT)
                  .slice(index * PLAYS_PER_ROW, (index + 1) * PLAYS_PER_ROW)
                  .map(({ image }, subIdx) => (
                    <View key={`${index}-${subIdx}`} style={styles.image}>
                      <Text style={styles.title}>
                        {index * PLAYS_PER_ROW +
                          PLAYS_PER_NEXT_SEGMENT +
                          subIdx}
                      </Text>
                      <Image src={image} />
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfDocument;

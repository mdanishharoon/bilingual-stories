import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Noto Sans font
Font.register({
  family: "NotoSansSC",
  fonts: [
    { src: "/fonts/NotoSansSC-Regular.ttf" },
    { src: "/fonts/NotoSansSC-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "NotoSansSC",
    fontSize: 12,
    backgroundColor: "#f8f5ff",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: "#6d28d9",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#6d28d9",
    marginBottom: 4,
  },
  text: {
    marginBottom: 8,
    color: "#22223b",
    lineHeight: 1.5,
  },
  image: {
    width: 240,
    height: 240,
    objectFit: "cover",
    marginBottom: 16,
    borderRadius: 8,
  },
});

export function StoryPDFDocument({ storyTitle, chineseTitle, storyPages }) {
  return (
    <Document>
      {storyPages.map((page, idx) => (
        <Page key={idx} size="A4" style={styles.page} wrap>
          {idx === 0 && (
            <Text style={styles.title}>
              {storyTitle}
              {chineseTitle ? ` / ${chineseTitle}` : ""}
            </Text>
          )}
          {page.image &&
            typeof page.image === "string" &&
            page.image.trim() !== "" &&
            !page.image.includes("placeholder.svg") && (
              <PDFImage style={styles.image} src={page.image} />
            )}
          <View style={styles.section}>
            <Text style={styles.label}>English:</Text>
            <Text style={styles.text}>{page.english}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>中文:</Text>
            <Text style={styles.text}>{page.chinese}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
} 
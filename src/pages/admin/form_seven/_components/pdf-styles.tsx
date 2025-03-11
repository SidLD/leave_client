import { StyleSheet } from "@react-pdf/renderer"

// PDF styles
export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  headerImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  table: {
    display: "none",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    minHeight: 20,
  },
  tableCell: {
    padding: 3,
    fontSize: 8,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "left",
  },
  headerCell: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  approvers: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  approverSection: {
    width: "30%",
    marginTop: 10,
  },
  approverTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 20,
  },
  approverName: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 5,
  },
  approverLine: {
    borderTopWidth: 1,
    borderColor: "#000",
    width: "80%",
    alignSelf: "center",
  },
}) as any

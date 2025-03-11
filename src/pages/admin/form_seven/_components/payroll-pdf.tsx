import { Document, Page, Text, View } from "@react-pdf/renderer"
import type { PayrollPeriod } from "./type"
import { styles } from "./pdf-styles"

interface PayrollPDFProps {
  data: PayrollPeriod
}

export const PayrollPDF = ({ data }: PayrollPDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Republic of the Philippines</Text>
        <Text style={styles.headerText}>Department of Education</Text>
        <Text style={styles.headerText}>SCHOOLS DIVISION OF QUEZON CITY</Text>
        <Text style={styles.title}>Implementation of Programs for Basic Education</Text>
        <Text style={styles.subtitle}>Monthly Payroll Worksheet & Report of Service</Text>
        <Text style={styles.subtitle}>
          For the Month of {data.month} {data.year}
        </Text>
      </View>

      <Text style={{ marginBottom: 5 }}>Station: {data.station}</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.headerCell]}>
          <Text style={[styles.tableCell, { width: "10%" }]}>Emp. ID</Text>
          <Text style={[styles.tableCell, { width: "20%" }]}>Name</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Position Title</Text>
          <Text style={[styles.tableCell, { width: "5%" }]}>Status</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>PERA/ACA</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>Remarks</Text>
          <Text style={[styles.tableCell, { width: "30%" }]}>Absences/Undertime</Text>
        </View>

        {data.employees.map((employee) => (
          <View key={employee.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "10%" }]}>{employee.user.employeeId}</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>{employee.user.name}</Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>{employee.user.position}</Text>
            <Text style={[styles.tableCell, { width: "5%" }]}>{employee.s}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{employee.peraOrAca}</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>{employee.remark}</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {employee.abesencesOrUndertime.incluseiveDate
                ? `Date: ${employee.abesencesOrUndertime.incluseiveDate}, 
                Days: ${employee.abesencesOrUndertime.dayOrHr}, 
                Cause: ${employee.abesencesOrUndertime.cause}, 
                Action: ${employee.abesencesOrUndertime.divisionAction}, 
                Deduction: Basic ${employee.abesencesOrUndertime.deduction.basic}, 
                PERA/ACA: ${employee.abesencesOrUndertime.deduction.pOrA}`
                : "None"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.approvers}>
        <View style={styles.approverSection}>
          <Text style={styles.approverTitle}>Prepared by:</Text>
          <View style={styles.approverLine} />
          <Text style={styles.approverName}>{data.approverOne}</Text>
        </View>
        <View style={styles.approverSection}>
          <Text style={styles.approverTitle}>Reviewed by:</Text>
          <View style={styles.approverLine} />
          <Text style={styles.approverName}>{data.approverTwo}</Text>
        </View>
        <View style={styles.approverSection}>
          <Text style={styles.approverTitle}>Approved by:</Text>
          <View style={styles.approverLine} />
          <Text style={styles.approverName}>{data.approverThree}</Text>
        </View>
      </View>
    </Page>
  </Document>
)


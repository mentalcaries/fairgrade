import * as XLSX from 'xlsx';
import type { StudentWithGrades } from '~/types';

export const exportAssessmentsToExcel = (students: StudentWithGrades[]) => {
  const exportData = students.map((student) => ({
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Student ID': student.studentId,
    Supervisor: student.consultantName || '-',
    Attendance: student.attendance ?? '-',
    'Factual Knowledge': student.factualKnowledge ?? '-',
    'Clinical Approach': student.clinicalApproach ?? '-',
    'Reliability and Deportment': student.reliabilityDeportment ?? '-',
    Initiative: student.initiative ?? '-',
    Average: student.average ?? '-',
    'Final (out of 20)': student.finalScore ?? '-',
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assessments');

  const date = new Date().toISOString().split('T')[0];
  const filename = `assessments_${date}.xlsx`;

  XLSX.writeFile(wb, filename);
};

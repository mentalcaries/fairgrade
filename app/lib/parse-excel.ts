import * as XLSX from 'xlsx';

interface StudentRow {
  firstName: string;
  lastName: string;
  studentId: string;
  status: 'valid' | 'duplicate' | 'invalid';
  error?: string;
}

export const parseStudentExcelFile = async (
  file: File
): Promise<StudentRow[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('No sheets found in file');
  }

  const firstSheet = workbook.Sheets[firstSheetName];
  if (!firstSheet) {
    throw new Error('Could not read sheet');
  }

  const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
  }) as string[][];

  if (jsonData.length === 0) {
    throw new Error('File is empty');
  }

  const headerRow = jsonData[0];

  if (!headerRow) {
    throw new Error('Could not find header row');
  }

  const firstNameCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return lower.includes('first') && lower.includes('name');
  });

  const lastNameCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return lower.includes('last') && lower.includes('name');
  });

  const studentIdCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return (
      (lower.includes('student') && lower.includes('id')) ||
      lower === 'id' ||
      lower.includes('student number') ||
      lower.includes('studentid')
    );
  });

  if (firstNameCol === -1 || lastNameCol === -1 || studentIdCol === -1) {
    throw new Error(
      'Could not find required columns: First Name, Last Name, Student ID'
    );
  }

  const students: StudentRow[] = [];
  const seenIds = new Set<string>();

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row) continue;

    const firstName = row[firstNameCol]?.toString().trim();
    const lastName = row[lastNameCol]?.toString().trim();
    const studentId = row[studentIdCol]?.toString().trim();

    if (!firstName || !lastName || !studentId) {
      const missingFields: string[] = [];
      if (!firstName) missingFields.push('First Name');
      if (!lastName) missingFields.push('Last Name');
      if (!studentId) missingFields.push('Student ID');

      students.push({
        firstName: firstName || '',
        lastName: lastName || '',
        studentId: studentId || '',
        status: 'invalid',
        error: `Missing: ${missingFields.join(', ')}`,
      });
      continue;
    }

    const isDuplicate = seenIds.has(studentId);
    seenIds.add(studentId);

    students.push({
      firstName,
      lastName,
      studentId,
      status: isDuplicate ? 'duplicate' : 'valid',
      error: isDuplicate ? 'Duplicate in file' : undefined,
    });
  }

  return students;
};

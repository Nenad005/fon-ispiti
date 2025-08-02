export type ExamTerm = {
  predmet: string;
  tip: string;
  datum: string;
  od: string;
  do: string;
};

export type ExamPeriod = {
  url: string;               // ✅ URL of the PDF
  datum: string;
  termini: ExamTerm[];       // ✅ List of terms
};

export type ExamSemester = {
  [examName: string]: ExamPeriod;  // e.g. "Први зимски колоквијум"
};

export type ExamType = {
  [semesterName: string]: ExamSemester; // e.g. "ЗИМСКИ СЕМЕСТАР"
};

export type ExamData = {
  [examType: string] : ExamType;
};

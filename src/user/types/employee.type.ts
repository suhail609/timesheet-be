type ReportingManager = {
  id: string;
  firstName: string;
  email: string;
};

export type EmployeeWithReportingManager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  reportingManagerId: string | null;
  role: string;
  reportingManager: ReportingManager | null;
};

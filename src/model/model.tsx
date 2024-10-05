export interface TReportFormData {
  title: string
  description: string
  file: Blob
  currentTime: string
}

export interface ReportsDataSet extends TReportFormData{
  id: number
  isServerUpload: boolean
  tryCount: number
  createAt: string
}
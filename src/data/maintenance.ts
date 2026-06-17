export type Maintenance = {
  id: string
  assets_id: string
  users_id: string
  categories_id: string
  issue_type: string
  problem_description: string
  remark: string | null
  status: string
  maintenance_date: string
  completed_date: string | null
  created_at: string
  updated_at: string
  accepted_by: any | null
  image_url: string
  preview_url: string
  asset: {
    id: string
    asset_code: string
    name: string
    serial_number: string
    purchased_date: string
    warranty_period: number
    model: string
    ram_capacity: string
    storage: string
    category_id: string
    status: string
    condition: string
    created_at: string
    updated_at: string
    deleted_at: string | null
  } | null
  user: {
    id: string
    employee_id: string
    name: string
    email: string
    position: string
    status: string
    phone_number: string
    joined_date: string
    left_date: string | null
    email_verified_at: string | null
    created_at: string
    updated_at: string
  } | null
  category: {
    id: string
    name: string
    created_at: string
    updated_at: string
  } | null
  media: any[]
}
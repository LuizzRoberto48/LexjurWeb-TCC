export interface Page {
  page_limit: number;
  paginate_offset: number;
}

export interface PageRequest {
  page: number;
  total_items: number;
  total_items_per_page: number;
  total_pages: number;
  items: any[];
}

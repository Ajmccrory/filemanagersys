export interface Case {
    id: number;
    title: string;
    description: string;
    date_created: string;
    file_path?: string;
    evidence: Evidence[];
  }
  
  export interface Evidence {
    id: number;
    title: string;
    description: string;
    date_added: string;
    case_id: number;
  }
  
  export interface Entity {
    id: number;
    name: string;
    type: 'person' | 'organization';
    role?: string;
    case_id: number;
    facts: Fact[];
    tags: Tag[];
  }
  
  export interface Fact {
    id: number;
    content: string;
    entity_id: number;
    date_added: string;
  }
  
  export interface Tag {
    id: number;
    name: string;
  }
  
  export type ApiError = {
    message: string;
    status: number;
  };
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
  }